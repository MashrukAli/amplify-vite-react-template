// src/components/SinglePost.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh] bg-black">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-48 w-48 bg-gray-800 rounded-full mb-8"></div>
          <div className="h-6 w-48 bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center bg-black text-white">
        <h2 className="text-2xl font-semibold mb-4">Bonsai not found</h2>
        <Link to="/" className="text-emerald-400 hover:text-emerald-300">
          Return to collection
        </Link>
      </div>
    );
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
    <div className="bg-black text-gray-200 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Link 
          to="/"
          className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Collection
        </Link>

        <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-800">
          <div className="md:flex">
            {/* Image Gallery */}
            <div className="md:w-1/2">
              <div className="relative h-[500px]">
                {allImages.length > 0 && allImages[currentImageIndex] && (
                  <img
                    src={allImages[currentImageIndex]}
                    alt={post.Title || "Bonsai image"}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {allImages.length > 1 && (
                  <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4">
                    <button 
                      onClick={prevImage}
                      className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={nextImage}
                      className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
                
                {/* Image counter */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                )}
              </div>
              
              {/* Thumbnail gallery */}
              {allImages.length > 1 && (
                <div className="flex overflow-x-auto p-2 space-x-2 bg-gray-800">
                  {allImages.map((img, index) => (
                    <button 
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden ${
                        index === currentImageIndex ? 'ring-2 ring-emerald-400' : ''
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Bonsai Details */}
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-serif mb-4 text-white">{post.Title || post.Type}</h1>
              <p className="text-emerald-400 text-2xl font-medium mb-6">${post.Price}/month</p>
              
              <div className="mb-6">
                <h2 className="text-xl font-medium mb-2 text-gray-200">Description</h2>
                <p className="text-gray-400">{post.Description || `A beautiful ${post.Type || 'bonsai'} specimen.`}</p>
              </div>
              
              {post.CareInstructions && (
                <div className="mb-6">
                  <h2 className="text-xl font-medium mb-2 text-gray-200">Care Instructions</h2>
                  <p className="text-gray-400">{post.CareInstructions}</p>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div>
                  <p className="text-gray-500">Type</p>
                  <p className="font-medium text-gray-300">{post.Type || "Bonsai"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Age</p>
                  <p className="font-medium text-gray-300">{post.Age || "Unknown"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Size</p>
                  <p className="font-medium text-gray-300">{post.Size || "Medium"}</p>
                </div>
              </div>
              
              <a 
                href="#contact" 
                className="inline-block bg-emerald-700 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Inquire About This Bonsai
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;