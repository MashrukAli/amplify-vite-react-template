import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BlogList from './components/BlogList';
import AdminDashboard from './components/AdminDashboard';
import SinglePost from './components/SinglePost';

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator();
  const [posts, setPosts] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setPosts([...data.items]),
    });
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} signOut={signOut} />
        <Routes>
          <Route path="/" element={
            <main className="flex-grow container mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold mb-6">Available Bonsai</h1>
              <BlogList posts={posts} />
            </main>
          } />
          <Route path="/bonsai/:id" element={<SinglePost client={client} />} />
          <Route 
            path="/admin" 
            element={
              user ? (
                <AdminDashboard posts={posts} client={client} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;