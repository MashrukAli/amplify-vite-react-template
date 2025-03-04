import React, { useState } from 'react';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import { TextField, Button, Flex, Heading, Card } from '@aws-amplify/ui-react';
import { StorageImage } from "@aws-amplify/ui-react-storage";
import type { Schema } from "../../amplify/data/resource";
import { FiSave, FiX, FiUpload } from 'react-icons/fi';

interface EditPostProps {
  client: any;
  post: Schema["Todo"]["type"];
  onCancel: () => void;
}

const EditPost: React.FC<EditPostProps> = ({ client, post, onCancel }) => {
  const [title, setTitle] = useState(post.title || '');
  const [price, setPrice] = useState<number | undefined>(post.price ?? undefined);
  const [type, setType] = useState(post.type || '');
  const [size, setSize] = useState(post.size || '');
  const [age, setAge] = useState(post.age || '');
  const [description, setDescription] = useState(post.description || '');
  const [careInstructions, setCareInstructions] = useState(post.careInstructions || '');
  const [imagePath, setImagePath] = useState(post.imagePath || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title || !imagePath || !price) {
      alert('Please provide all required fields.');
      return;
    }

    setIsSaving(true);
    try {
      await client.models.Todo.update({
        id: post.id,
        title,
        price,
        type,
        size,
        age,
        description,
        careInstructions,
        imagePath,
      });
      
      alert('Bonsai listing updated successfully!');
      onCancel();
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update bonsai listing. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <div className="space-y-4">
              <TextField
                label="Title"
                placeholder="Enter bonsai name/title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full"
              />

              <TextField
                label="Monthly Price ($)"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                className="w-full"
              />

              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Type"
                  placeholder="Enter bonsai type..."
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full"
                />

                <TextField
                  label="Size"
                  placeholder="Enter bonsai size..."
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full"
                />
              </div>

              <TextField
                label="Age"
                placeholder="Enter bonsai age..."
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full"
              />
            </div>
          </Card>

          <Card className="mt-4">
            <TextField
              label="Description"
              placeholder="Enter detailed description..."
              as="textarea"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full"
            />
          </Card>

          <Card className="mt-4">
            <TextField
              label="Care Instructions"
              placeholder="Enter care instructions..."
              as="textarea"
              rows={4}
              value={careInstructions}
              onChange={(e) => setCareInstructions(e.target.value)}
              className="w-full"
            />
          </Card>
        </div>
        
        <div>
          <Card>
            <Heading level={5} className="mb-4">Bonsai Image</Heading>
            
            <div className="mb-6">
              {imagePath ? (
                <div className="relative">
                  <StorageImage
                    path={imagePath}
                    alt={title || "Bonsai image"}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-center px-4">Current image</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No image available</p>
                </div>
              )}
            </div>
            
            <div className="border-t pt-4">
              <p className="font-medium mb-2 flex items-center gap-2">
                <FiUpload /> Upload New Image
              </p>
              <FileUploader
                acceptedFileTypes={['image/*']}
                path="public/"
                maxFileCount={1}
                isResumable
                onUploadStart={() => setIsUploading(true)}
                onUploadSuccess={(event: { key?: string }) => {
                  if (event.key) {
                    setImagePath(event.key);
                  }
                  setIsUploading(false);
                }}
                onUploadError={() => setIsUploading(false)}
              />
              {isUploading && (
                <p className="text-blue-600 mt-2">Uploading image...</p>
              )}
            </div>
          </Card>

          <div className="mt-8">
            <p className="text-sm text-gray-500 mb-4">
              Last updated: {new Date(post.updatedAt || '').toLocaleString()}
            </p>
            
            <Flex direction="row" gap="1rem" justifyContent="flex-end">
              <Button 
                onClick={onCancel} 
                variation="link"
                isDisabled={isSaving}
                className="flex items-center gap-1"
              >
                <FiX /> Cancel
              </Button>
              <Button 
                type="submit" 
                variation="primary"
                isLoading={isSaving}
                isDisabled={isUploading || isSaving}
                loadingText="Saving..."
                className="flex items-center gap-1"
              >
                <FiSave /> Save Changes
              </Button>
            </Flex>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditPost; 