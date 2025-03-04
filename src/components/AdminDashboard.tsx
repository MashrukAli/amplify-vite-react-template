import React from 'react';
import CreatePost from './CreatePost';
import { StorageImage } from "@aws-amplify/ui-react-storage";
import type { Schema } from "../../amplify/data/resource";

interface AdminDashboardProps {
  posts: Array<Schema["Todo"]["type"]>;
  client: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ posts, client }) => {
  const deletePost = (id: string) => {
    client.models.Todo.delete({ id });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <CreatePost client={client} />
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Manage Posts</h2>
        <div className="grid grid-cols-1 gap-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {post.imagePath && (
                  <StorageImage
                    path={post.imagePath}
                    alt={post.content || "Blog post image"}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <p className="text-lg">{post.content}</p>
              </div>
              <button 
                onClick={() => deletePost(post.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;