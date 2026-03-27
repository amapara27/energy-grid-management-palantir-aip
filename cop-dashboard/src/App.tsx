import { useState } from 'react';
// Make sure this path matches where Kiro put your client.ts!
import { client, auth } from './client'; 
// Use the exact API name for your Transformer object here
import { Transformer } from '@grid/sdk'; 

export default function App() {
  const [output, setOutput] = useState<any>(null);

  const handleLogin = async () => {
    try {
      // This will redirect you to the Palantir login screen
      await auth.signIn(); 
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const testConnection = async () => {
    try {
      setOutput("Fetching from Foundry...");
      
      // OSDK v2 syntax to fetch the first 5 transformers
      const response = await client(Transformer).fetchPage({ pageSize: 5 });
      
      setOutput(response.data);
    } catch (error) {
      console.error("Fetch failed:", error);
      setOutput("Error: Check console for details.");
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Grid 360 COP</h1>
      <p>Status: Vite Client Active</p>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={handleLogin}
          style={{ padding: '10px', background: '#333', color: 'white', cursor: 'pointer' }}
        >
          1. Log In to Palantir
        </button>
        <button 
          onClick={testConnection}
          style={{ padding: '10px', background: '#0055ff', color: 'white', cursor: 'pointer' }}
        >
          2. Fetch Transformers
        </button>
      </div>

      <div style={{ background: '#1e1e1e', color: '#00ffcc', padding: '20px', borderRadius: '8px' }}>
        <pre>{JSON.stringify(output, null, 2)}</pre>
      </div>
    </div>
  );
}