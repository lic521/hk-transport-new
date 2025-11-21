import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import RouteList from './components/RouteList';
import RouteDetail from './components/RouteDetail';
import { fetchRoutes } from './services/geminiService';
import { RouteOption, Screen } from './types';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('search');
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (origin: string, destination: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await fetchRoutes(origin, destination);
      setRoutes(results);
      setScreen('routes');
    } catch (err) {
      console.error(err);
      setError("無法找到路線，請重試。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRoute = (route: RouteOption) => {
    setSelectedRoute(route);
    setScreen('details');
  };

  const handleBack = () => {
    if (screen === 'details') {
      setScreen('routes');
      setSelectedRoute(null);
    } else if (screen === 'routes') {
      setScreen('search');
      setRoutes([]);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-white shadow-2xl overflow-hidden relative">
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold">×</button>
        </div>
      )}

      <main className="h-[100dvh] w-full relative">
        {screen === 'search' && (
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        )}
        
        {screen === 'routes' && (
          <RouteList 
            routes={routes} 
            onSelectRoute={handleSelectRoute} 
            onBack={handleBack} 
          />
        )}

        {screen === 'details' && selectedRoute && (
          <RouteDetail 
            route={selectedRoute} 
            onBack={handleBack} 
          />
        )}
      </main>
    </div>
  );
};

export default App;