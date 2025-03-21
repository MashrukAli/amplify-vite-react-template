import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { fetchBonsaiList } from './services/strapiService';
import Navbar from './components/Navbar';
import BlogList from './components/BlogList';
import SinglePost from './components/SinglePost';
import CollectionPage from './components/Pages/CollectionPage';
import Footer from './components/Footer';
import DoorAnimation from './components/DoorAnimation';
import FadeInSection from './components/FadeInSection';
import FadeInSectionReverse from './components/FadeInSectionReverse';
import LeasePage from './components/Pages/LeasePage'; 
import CompanyPage from './components/Pages/CompanyPage';
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

  // Use the specified bonsai image for the door animation
  const backgroundImage = 'https://coa-en-strapi-media.s3.ap-northeast-1.amazonaws.com/a_beautiful_bonsai_tree_surrounded_by_lush_greenery_and_rocks_radiating_tranquility_free_photo_9ded2cdbb3.jpg';

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <>
                <DoorAnimation backgroundImage={backgroundImage} />
                <FadeInSection 
                  image="https://th.bing.com/th/id/OIP.cZnviLjCg3jE5wrhd06USgAAAA?rs=1&pid=ImgDetMain"
                  title="The Art of Bonsai"
                  description="Bonsai is the ancient Japanese art form of growing and training miniature trees in containers. Dating back over a thousand years, this practice combines horticultural techniques and artistic design to create living sculptures that embody harmony, balance, and tranquility. Each bonsai tells a unique story through its carefully shaped branches, weathered trunk, and meticulously maintained foliage."
                />
                <FadeInSectionReverse
                  image="https://images.unsplash.com/photo-1611387729672-25583e070328?q=80&w=1000"
                  title="Cultivating Tranquility"
                  description="The practice of bonsai cultivation is as much about personal growth as it is about nurturing the tree. It teaches patience, mindfulness, and respect for nature's rhythms. Through careful pruning, wiring, and repotting, bonsai artists guide their trees into harmonious forms that reflect both natural beauty and artistic vision. This delicate balance creates a living meditation that can bring peace and focus to our busy modern lives."
                />
                <BlogList posts={posts} />
              </>
            } />
            <Route path="/collection" element={<CollectionPage />} />
            <Route path="/lease" element={<LeasePage />} />
            <Route path="/company" element={<CompanyPage />} />
            <Route path="/bonsai/:id" element={<SinglePost />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;