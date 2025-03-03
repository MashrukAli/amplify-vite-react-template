import React, { useState } from 'react';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import { TextField, Button, Flex, Heading } from '@aws-amplify/ui-react';

interface CreatePostProps {
  client: any;
}

const CreatePost: React.FC<CreatePostProps> = ({ client }) => {
  const [content, setContent] = useState('');
  const [imagePath, setImagePath] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (content && imagePath) {
      client.models.Todo.create({ content, imagePath });
      setContent('');
      setImagePath('');
      alert('Blog post created successfully!');
    } else {
      alert('Please provide both content and an image.');
    }
  };

  return (
    <Flex as="form" direction="column" gap="1rem" onSubmit={handleSubmit}>
      <Heading level={3}>Create New Blog Post</Heading>
      <TextField
        label="Blog Content"
        placeholder="Write your blog post here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <FileUploader
        acceptedFileTypes={['image/*']}
        path="public/"
        maxFileCount={1}
        isResumable
        onUploadSuccess={(event: { key?: string }) => {
          if (event.key) {
            setImagePath(event.key);
          }
        }}
      />
      <Button type="submit" variation="primary">
        Submit
      </Button>
    </Flex>
  );
};

export default CreatePost;
