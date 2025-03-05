import React from 'react';
import { Link } from 'react-router-dom';
import { StorageImage } from "@aws-amplify/ui-react-storage";
import type { Schema } from "../../amplify/data/resource";

interface BlogListProps {
  posts: Array<Schema["Todo"]["type"]>;
}

const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link 
          to={`/bonsai/${post.id}`} 
          key={post.id} 
          className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          {post.imagePath && (
            <StorageImage
              path={post.imagePath}
              alt={post.title || "Bonsai image"}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-2">{post.type}</p>
            <p className="text-green-600 font-bold">${post.price}/month</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BlogList;