import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BlogList from './components/BlogList';
import CreatePost from './components/CreatePost';
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
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={
              <>
                <h1 className="text-3xl font-bold mb-6">Welcome to {user?.signInDetails?.loginId}'s Blog</h1>
                <CreatePost client={client} />
                <BlogList posts={posts} client={client} />
              </>
            } />
            <Route path="/post/:id" element={<SinglePost client={client} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;