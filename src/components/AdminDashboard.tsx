import React from 'react';

interface AdminDashboardProps {
  posts: any[];
  signOut: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ posts, signOut }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Manage Content in Strapi</h2>
        <p className="mb-4">
          Your content is now managed through the Strapi CMS. Click the button below to open the Strapi admin panel.
        </p>
        <a 
          href="https://jwpqgsxvee.ap-northeast-1.awsapprunner.com/admin" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
        >
          Open Strapi Admin
        </a>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Current Bonsai Listings</h2>
        <div className="grid grid-cols-1 gap-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {post.attributes.mainImage?.data && (
                    <img
                      src={`http://localhost:1337${post.attributes.mainImage.data.attributes.url}`}
                      alt={post.attributes.title || "Bonsai image"}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold">{post.attributes.title}</h3>
                    <p className="text-gray-600">{post.attributes.type}</p>
                    <p className="text-green-600 font-bold">${post.attributes.price}/month</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;