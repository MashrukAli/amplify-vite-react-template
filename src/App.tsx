import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BlogList from './components/BlogList';
import AdminDashboard from './components/AdminDashboard';
import SinglePost from './components/SinglePost';

// Configure client with API key for unauthenticated access
const publicClient = generateClient<Schema>({
  authMode: 'apiKey'
});

// Main app content with authentication context
function AppContent() {
  const [posts, setPosts] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { user, signOut } = useAuthenticator((context) => [context.user, context.signOut]);
  
  useEffect(() => {
    publicClient.models.Todo.observeQuery().subscribe({
      next: (data) => setPosts([...data.items]),
    });
  }, []);

  // Create authenticated client when user is logged in
  const getClient = () => {
    if (user) {
      return generateClient<Schema>({ authMode: 'userPool' });
    }
    return publicClient;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar isAuthenticated={!!user} />
        
        <Routes>
          <Route path="/" element={
            <main className="flex-grow container mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold mb-6">Available Bonsai</h1>
              <BlogList posts={posts} />
            </main>
          } />
          <Route path="/bonsai/:id" element={<SinglePost client={publicClient} />} />
          <Route 
            path="/admin" 
            element={
              user ? (
                <AdminDashboard 
                  posts={posts} 
                  client={getClient()} 
                  signOut={signOut} 
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/login" 
            element={
              user ? (
                <Navigate to="/admin" replace />
              ) : (
                <div className="container mx-auto px-4 py-8">
                  <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
                  <Authenticator />
                </div>
              )
            } 
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

// Root component that provides authentication context
function App() {
  return (
    <Authenticator.Provider>
      <AppContent />
    </Authenticator.Provider>
  );
}

export default App;