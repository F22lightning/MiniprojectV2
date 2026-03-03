import { useState, useEffect } from 'react';
import OrderBoard from './components/OrderBoard';
import { ChefHat, Clock } from 'lucide-react';
import { format } from 'date-fns';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col pt-16">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm border-b border-gray-100 z-50 flex items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <ChefHat className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            Kitchen<span className="text-emerald-500">Buddy</span> <span className="text-gray-400 font-medium text-sm ml-2">KDS</span>
          </h1>
        </div>

        <div className="flex items-center space-x-2 text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
          <Clock className="w-4 h-4" />
          <span className="font-medium text-sm">{format(currentTime, 'HH:mm')} น.</span>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-auto p-6">
        <OrderBoard />
      </main>
    </div>
  );
}

export default App;
