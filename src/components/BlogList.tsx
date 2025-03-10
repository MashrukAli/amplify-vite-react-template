import React from 'react';
import { Link } from 'react-router-dom';
import { getStrapiImageUrl } from '../services/strapiService';

interface BlogListProps {
  posts: any[];
}

const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  console.log('Posts in BlogList:', posts);
  
  // Find a post with MainImage for the hero section
  const heroPost = posts && posts.length > 0 ? posts.find(post => post && post.MainImage) || posts[0] : null;
  
  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Hero Section */}
      {heroPost && heroPost.MainImage && (
        <div className="relative h-[70vh] bg-cover bg-center" 
             style={{ backgroundImage: `url(${getStrapiImageUrl(heroPost.MainImage)})` }}>
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 font-serif">Bonsai Rental</h1>
              <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-300">
                Experience the tranquility of nature with our premium bonsai collection
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Introduction Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-serif mb-6 text-white">Our Bonsai Collection</h2>
        <p className="max-w-2xl mx-auto text-gray-400 mb-12">
          Each bonsai in our collection has been carefully cultivated and maintained to represent 
          the perfect balance between nature and art. Browse our selection and find your perfect companion.
        </p>
      </div>

      {/* Gallery Grid - Using your existing mapping logic */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts && posts.length > 0 ? (
            posts.map((post) => {
              // Use documentId instead of id for the link
              const postId = post.documentId || post.id;
              
              return (
                <Link 
                  to={`/bonsai/${postId}`} 
                  key={postId} 
                  className="group bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-emerald-900/30 transition-shadow duration-300 border border-gray-800"
                >
                  {post.MainImage && post.MainImage.url && (
                    <div className="h-64 overflow-hidden">
                      <img
                        src={getStrapiImageUrl(post.MainImage)}
                        alt={post.Title || post.Type || "Bonsai image"}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-serif mb-2 text-white">{post.Title || post.Type}</h3>
                    <p className="text-gray-400 mb-2">{post.Type}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <p className="text-emerald-400 font-medium">${post.Price}/month</p>
                      <span className="text-emerald-400 flex items-center">
                        View Details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-400">
              <p>No bonsai listings found. Please add some in the Strapi admin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogList;