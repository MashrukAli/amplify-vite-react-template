import React from 'react';
import { Link } from 'react-router-dom';
import { StorageImage } from "@aws-amplify/ui-react-storage";
import type { Schema } from "../../amplify/data/resource";

interface BlogListProps {
  posts: Array<Schema["Todo"]["type"]>;
  client: any;
}

const BlogList: React.FC<BlogListProps> = ({ posts, client }) => {
  const deletePost = (id: string) => {
    client.models.Todo.delete({ id });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white shadow-md rounded-lg overflow-hidden">
          <Link to={`/post/${post.id}`} className="block">
            {post.imagePath && (
              <div className="w-full h-48 overflow-hidden">
                <StorageImage
                  path={post.imagePath}
                  alt={post.content || "Blog post image"}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <p className="text-lg font-semibold mb-2">{post.content}</p>
            </div>
          </Link>
          <div className="px-4 pb-4">
            <button 
              onClick={() => deletePost(post.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
