import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { fetchBonsaiList } from './services/strapiService';
import Navbar from './components/Navbar';
import BlogList from './components/BlogList';
import SinglePost from './components/SinglePost';
import Footer from './components/Footer';

function App() {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    const loadBonsaiData = async () => {
      try {
        const bonsaiData = await fetchBonsaiList();
        setPosts(bonsaiData);
      } catch (error) {
        console.error('Failed to load bonsai data:', error);
      }
    };
    
    loadBonsaiData();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<BlogList posts={posts} />} />
            <Route path="/bonsai/:id" element={<SinglePost />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;