import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import { StorageImage } from "@aws-amplify/ui-react-storage";
import '@aws-amplify/ui-react/styles.css';

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo(content: string, imagePath: string) {
    client.models.Todo.create({ content, imagePath });
  }
    
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <FileUploader
        acceptedFileTypes={['image/*']}
        path="public/"
        maxFileCount={1}
        isResumable
        onUploadSuccess={(event: { key?: string }) => {
          if (event.key) {
            const content = window.prompt("Todo content");
            if (content) {
              createTodo(content, event.key);
              setImages([...images, event.key]);
            }
          }
        }}        
      />
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.content}
            {todo.imagePath && (
              <StorageImage
                path={todo.imagePath}
                alt={todo.content || "Todo image"}
                width={100}
                height={100}
              />
            )}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo with an image.
        <br />
        <button onClick={signOut}>Sign out</button>
      </div>
    </main> 
  );
}

export default App;
