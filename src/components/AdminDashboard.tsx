import React, { useState } from 'react';
import CreatePost from './CreatePost';
import EditPost from './EditPost';
import { StorageImage } from "@aws-amplify/ui-react-storage";
import type { Schema } from "../../amplify/data/resource";
import { Button } from '@aws-amplify/ui-react';

interface AdminDashboardProps {
  posts: Array<Schema["Todo"]["type"]>;
  client: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ posts, client }) => {
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const deletePost = (id: string) => {
    if (window.confirm("Are you sure you want to delete this bonsai?")) {
      client.models.Todo.delete({ id });
    }
  };

  const toggleEdit = (postId: string) => {
    if (editingPostId === postId) {
      setEditingPostId(null);
    } else {
      setEditingPostId(postId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <CreatePost client={client} onSuccess={() => {}} />
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Manage Posts</h2>
        <div className="grid grid-cols-1 gap-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {post.imagePath && (
                    <StorageImage
                      path={post.imagePath}
                      alt={post.title || "Bonsai image"}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold">{post.title}</h3>
                    <p className="text-gray-600">{post.type}</p>
                    <p className="text-green-600 font-bold">${post.price}/month</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => toggleEdit(post.id)}
                    variation="primary"
                  >
                    {editingPostId === post.id ? 'Cancel Edit' : 'Edit'}
                  </Button>
                  <button 
                    onClick={() => deletePost(post.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {/* Expandable edit section */}
              {editingPostId === post.id && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <EditPost 
                    client={client} 
                    post={post} 
                    onCancel={() => setEditingPostId(null)} 
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;