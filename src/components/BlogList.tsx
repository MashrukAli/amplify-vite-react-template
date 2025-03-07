import React from 'react';
import { Link } from 'react-router-dom';
import { getStrapiImageUrl } from '../services/strapiService';

interface BlogListProps {
  posts: any[];
}

const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  console.log('Posts in BlogList:', posts);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts && posts.length > 0 ? (
        posts.map((post) => {
          console.log('Individual post:', post);
          
          // Use documentId instead of id for the link
          const postId = post.documentId || post.id;
          
          return (
            <Link 
              to={`/bonsai/${postId}`} 
              key={postId} 
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {post.MainImage && post.MainImage.url && (
                <img
                  src={getStrapiImageUrl(post.MainImage)}
                  alt={post.Title || post.Type || "Bonsai image"}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{post.Title || post.Type}</h2>
                <p className="text-gray-600 mb-2">{post.Type}</p>
                <p className="text-green-600 font-bold">${post.Price}/month</p>
              </div>
            </Link>
          );
        })
      ) : (
        <div className="col-span-3 text-center py-8">
          <p>No bonsai listings found. Please add some in the Strapi admin.</p>
        </div>
      )}
    </div>
  );
};

export default BlogList;