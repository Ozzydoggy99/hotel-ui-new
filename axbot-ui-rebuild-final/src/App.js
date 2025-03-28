import { useState } from 'react';
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";

// (rest of your App.js from canvas)

import { useState } from 'react';
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [loginError, setLoginError] = useState('');

  const handleLogin = () => {
    if (username.trim() === 'Ozzydog' && password.trim() === 'Ozzydog') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  const handleFloorSelection = async (floor) => {
    try {
      const response = await fetch('https://testhotelsite.com/api/request-service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service: selectedService,
          floor: floor
        })
      });

      const result = await response.json();
      setConfirmation(`Service requested: ${result.status || 'Success'}`);
    } catch (error) {
      console.error('Error sending service request:', error);
      setConfirmation('Failed to request service.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm shadow-xl rounded-2xl">
          <CardContent className="grid gap-4 p-6">
            <h2 className="text-3xl font-bold text-center text-gray-800">Hotel Login</h2>
            <input
              className="border border-gray-300 rounded p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="border border-gray-300 rounded p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {loginError && <p className="text-red-600 text-sm text-center">{loginError}</p>}
            <Button className="text-lg py-3" onClick={handleLogin}>Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedService) {
    return (
      <div className="p-4 grid gap-4">
        <Card>
          <CardContent className="grid gap-4 p-6">
            <h2 className="text-2xl font-bold text-center">Select a Service</h2>
            <div className="flex justify-center gap-4">
              <Button className="text-lg px-6 py-4" onClick={() => setSelectedService('trash')}>Trash</Button>
              <Button className="text-lg px-6 py-4" onClick={() => setSelectedService('laundry')}>Laundry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 grid gap-4">
      <Card>
        <CardContent className="grid gap-4 p-6">
          <h2 className="text-2xl font-bold text-center">{selectedService === 'trash' ? 'Trash Collection' : 'Laundry Pickup'}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(floor => (
              <Button key={floor} className="text-lg py-4" onClick={() => handleFloorSelection(floor)}>
                Floor {floor}
              </Button>
            ))}
          </div>
          <Button variant="outline" onClick={() => {
            setSelectedService(null);
            setConfirmation(null);
          }}>Back</Button>
          {confirmation && <p className="text-center text-green-600 font-medium mt-4">{confirmation}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
