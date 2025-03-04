import React, { useState } from 'react';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import { TextField, Button, Heading, Card } from '@aws-amplify/ui-react';
import { FiSave, FiUpload } from 'react-icons/fi';

interface CreatePostProps {
  client: any;
  onSuccess?: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ client, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number | undefined>();
  const [type, setType] = useState('');
  const [size, setSize] = useState('');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');
  const [careInstructions, setCareInstructions] = useState('');
  const [imagePath, setImagePath] = useState('');
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
      await client.models.Todo.create({
        title,
        price,
        type,
        size,
        age,
        description,
        careInstructions,
        imagePath,
      });

      // Reset form
      setTitle('');
      setPrice(undefined);
      setType('');
      setSize('');
      setAge('');
      setDescription('');
      setCareInstructions('');
      setImagePath('');
      
      alert('Bonsai listing created successfully!');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create bonsai listing. Please try again.');
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
            
            <div className="mb-4">
              <p className="font-medium mb-2 flex items-center gap-2">
                <FiUpload /> Upload Image
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
              {imagePath && (
                <p className="text-green-600 mt-2">Image uploaded successfully!</p>
              )}
            </div>
          </Card>

          <div className="mt-8">
            <Button 
              type="submit" 
              variation="primary"
              isLoading={isSaving}
              isDisabled={isUploading || isSaving}
              loadingText="Creating..."
              className="w-full flex items-center justify-center gap-1"
            >
              <FiSave /> Create Bonsai Listing
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreatePost;
