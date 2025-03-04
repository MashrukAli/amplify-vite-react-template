import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StorageImage } from "@aws-amplify/ui-react-storage";
import type { Schema } from "../../amplify/data/resource";

interface SinglePostProps {
  client: any;
}

const SinglePost: React.FC<SinglePostProps> = ({ client }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Schema["Todo"]["type"] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const result = await client.models.Todo.get({ id });
        setPost(result.data);
      } catch (error) {
        console.error('Error fetching post:', error);
        navigate('/');
      }
    };

    fetchPost();
  }, [id, client, navigate]);

  if (!post) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  console.log('Post data:', post);

  const allImages = [post.imagePath, ...(post.additionalImages || [])].filter(Boolean);

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
            {allImages[currentImageIndex] && (
              <StorageImage
                path={allImages[currentImageIndex]}
                alt={post.title || "Bonsai image"}
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
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-2xl font-bold text-green-600 mb-4">
              ${post.price}/month
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Type</h3>
                <p>{post.type}</p>
              </div>
              <div>
                <h3 className="font-semibold">Size</h3>
                <p>{post.size}</p>
              </div>
              <div>
                <h3 className="font-semibold">Age</h3>
                <p>{post.age}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <p className="text-gray-700">{post.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Care Instructions</h2>
            <p className="text-gray-700">{post.careInstructions}</p>
          </div>

          <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
            Rent This Bonsai
          </button>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;