import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { Button, Heading, Text, View } from '@aws-amplify/ui-react';
import type { Schema } from "../../amplify/data/resource";

interface SinglePostProps {
  client: any;
}

// Define a type for the nested data structure
interface PostResponse {
  data: Schema["Todo"]["type"];
}

const SinglePost: React.FC<SinglePostProps> = ({ client }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError("No post ID provided");
        setLoading(false);
        return;
      }
      
      try {
        console.log("Fetching post with ID:", id);
        const postData = await client.models.Todo.get({ id });
        console.log("Post data received:", postData);
        
        if (!postData) {
          setError("Post not found");
        } else {
          setPost(postData);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(`Error fetching post: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, client]);

  if (loading) {
    return <div className="text-center py-8">Loading post...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-xl mb-4 text-red-500">{error}</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  if (!post || !post.data) {
    return (
      <div className="text-center py-8">
        <p className="text-xl mb-4">Post not found</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  // Access the post data from the nested structure
  const postData = post.data;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Button 
        onClick={() => navigate('/')}
        className="mb-6"
      >
        ← Back to Posts
      </Button>
      
      <View className="bg-white shadow-lg rounded-lg overflow-hidden">
        {postData.imagePath && (
          <div className="w-full">
            <StorageImage
              path={postData.imagePath}
              alt={postData.content || "Blog post image"}
              className="w-full h-64 object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          <Heading level={2} className="text-2xl font-bold mb-4">
            {postData.content}
          </Heading>
          
          <Text className="text-gray-600">
            {/* If you had more content fields, you could display them here */}
            {postData.content}
          </Text>
        </div>
      </View>
      
      {/* Debug information */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <p className="font-bold">Debug Info:</p>
        <p>Post ID: {id}</p>
        <pre className="mt-2 bg-gray-200 p-2 rounded overflow-auto">
          {JSON.stringify(post, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default SinglePost;