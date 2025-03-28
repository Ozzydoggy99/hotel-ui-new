
import { useState } from 'react';
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [selectedRooms, setSelectedRooms] = useState([]);

  const handleLogin = () => {
    if (username.trim() === 'Ozzydog' && password.trim() === 'Ozzydog') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  const handleFloorSelection = (floor) => {
    setSelectedFloor(floor);
    setSelectedRooms([]);
  };

  const toggleRoomSelection = (room) => {
    setSelectedRooms((prev) =>
      prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room]
    );
  };

  const handleRoomConfirmation = async () => {
    try {
      const response = await fetch('https://testhotelsite.com/api/request-service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service: selectedService,
          floor: selectedFloor,
          rooms: selectedRooms
        })
      });

      const result = await response.json();
      setConfirmation(\`Service requested for rooms: \${selectedRooms.join(', ')} — \${result.status || 'Success'}\`);
    } catch (error) {
      console.error('Error sending service request:', error);
      setConfirmation('Failed to request service.');
    }
  };

  const renderRoomSelectionPage = () => {
    const roomStart = selectedFloor * 100;
    const roomNumbers = Array.from({ length: 9 }, (_, i) => roomStart + i * 4);

    return (
      <div className="p-4 grid gap-4">
        <Card>
          <CardContent className="grid gap-4 p-6">
            <h2 className="text-2xl font-bold text-center">Select Rooms on Floor {selectedFloor}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {roomNumbers.map((room) => (
                <Button
                  key={room}
                  className={\`h-24 text-lg font-semibold rounded-md \${selectedRooms.includes(room) ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'}\`}
                  onClick={() => toggleRoomSelection(room)}
                >
                  Room {room}
                </Button>
              ))}
            </div>
            <Button
              className="bg-blue-600 text-white mt-4"
              onClick={handleRoomConfirmation}
              disabled={selectedRooms.length === 0}
            >
              Confirm Selection
            </Button>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => setSelectedFloor(null)}
            >
              Back to Floors
            </Button>
            {confirmation && <p className="text-center text-green-600 font-medium mt-4">{confirmation}</p>}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderServicePage = () => {
    const colors = [
      'bg-red-300', 'bg-orange-300', 'bg-yellow-300',
      'bg-green-300', 'bg-blue-300', 'bg-purple-300'
    ];

    return (
      <div className="p-4 grid gap-4">
        <Card>
          <CardContent className="grid gap-4 p-6">
            <h2 className="text-2xl font-bold text-center">
              {selectedService === 'trash' ? 'Trash Collection' : 'Laundry Pickup'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((floor, index) => (
                <Button
                  key={floor}
                  className={\`h-24 text-lg font-semibold text-white \${colors[index]} rounded-md\`}
                  onClick={() => handleFloorSelection(floor)}
                >
                  Floor {floor}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => {
                setSelectedService(null);
                setConfirmation(null);
              }}
            >
              Back
            </Button>
            {confirmation && <p className="text-center text-green-600 font-medium mt-4">{confirmation}</p>}
          </CardContent>
        </Card>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm shadow-xl rounded-2xl">
          <CardContent className="grid gap-6 p-6">
            <h2 className="text-3xl font-bold text-center text-gray-800">Hotel Login</h2>
            <div className="grid gap-4">
              <input
                className="border border-gray-300 rounded p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="border border-gray-300 rounded p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {loginError && <p className="text-red-600 text-sm text-center">{loginError}</p>}
              <Button className="text-lg py-3 w-full" onClick={handleLogin}>Login</Button>
            </div>
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
            <div className="flex justify-center gap-8">
              <Button className="bg-pink-500 text-white w-32 h-32 text-xl rounded-md" onClick={() => setSelectedService('trash')}>Trash</Button>
              <Button className="bg-indigo-500 text-white w-32 h-32 text-xl rounded-md" onClick={() => setSelectedService('laundry')}>Laundry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedService && selectedFloor) return renderRoomSelectionPage();
  return renderServicePage();
}
