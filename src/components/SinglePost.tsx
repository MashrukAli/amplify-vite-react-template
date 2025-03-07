// src/components/SinglePost.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBonsaiById, getStrapiImageUrl } from '../services/strapiService';

const SinglePost: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        setLoading(true);
        console.log(`Fetching post with ID: ${id}`);
        const result = await fetchBonsaiById(id);
        console.log('Single post data:', result);
        setPost(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        navigate('/');
      }
    };

    fetchPost();
  }, [id, navigate]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!post) {
    return <div className="container mx-auto px-4 py-8">Bonsai not found</div>;
  }

  // Prepare images array
  const mainImageUrl = post.MainImage ? getStrapiImageUrl(post.MainImage) : null;
  
  const additionalImageUrls = post.AdditionalImages ? 
    post.AdditionalImages.map((img: any) => getStrapiImageUrl(img)) : [];
  
  const allImages = [mainImageUrl, ...additionalImageUrls].filter(Boolean);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/')}
        className="mb-4 text-blue-600 hover:text-blue-800"
      >
        ← Back to Bonsai List
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Slideshow */}
        <div className="relative">
          <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
            {allImages.length > 0 && allImages[currentImageIndex] && (
              <img
                src={allImages[currentImageIndex]}
                alt={post.Title || "Bonsai image"}
                className="w-full h-[500px] object-cover rounded-lg"
              />
            )}
          </div>
          {allImages.length > 1 && (
            <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4">
              <button 
                onClick={prevImage}
                className="bg-black bg-opacity-50 text-white p-2 rounded-full"
              >
                ←
              </button>
              <button 
                onClick={nextImage}
                className="bg-black bg-opacity-50 text-white p-2 rounded-full"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Bonsai Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{post.Title || post.Type}</h1>
          <p className="text-gray-600 mb-2">{post.Type}</p>
          <p className="text-green-600 font-bold text-2xl mb-4">${post.Price}/month</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 p-3 rounded">
              <p className="font-semibold">Size</p>
              <p>{post.Size}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded">
              <p className="font-semibold">Age</p>
              <p>{post.Age}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <div className="prose" dangerouslySetInnerHTML={{ __html: post.Description }} />
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-2">Care Instructions</h2>
            <div className="prose" dangerouslySetInnerHTML={{ __html: post.CareInstructions }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;