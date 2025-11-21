import React from 'react';
import { RouteOption, TransportMode } from '../types';
import { Clock, DollarSign, ChevronRight, Train, Bus, Footprints, Ship, Navigation } from 'lucide-react';

interface RouteListProps {
  routes: RouteOption[];
  onSelectRoute: (route: RouteOption) => void;
  onBack: () => void;
}

const getModeIcon = (mode: TransportMode, className = "w-4 h-4") => {
  switch (mode) {
    case TransportMode.SUBWAY: return <Train className={className} />;
    case TransportMode.BUS: return <Bus className={className} />;
    case TransportMode.TRAM: return <Train className={className} />; // Reusing Train for Tram
    case TransportMode.FERRY: return <Ship className={className} />;
    case TransportMode.WALK: return <Footprints className={className} />;
    default: return <Navigation className={className} />;
  }
};

// Helper to extract unique main modes for summary icons
const getRouteIcons = (route: RouteOption) => {
  const mainModes = route.steps
    .map(s => s.mode)
    .filter(m => m !== TransportMode.WALK);
  const uniqueModes = Array.from(new Set(mainModes));
  
  // If only walking, show walking
  if (uniqueModes.length === 0) return [TransportMode.WALK];
  return uniqueModes;
};

const RouteList: React.FC<RouteListProps> = ({ routes, onSelectRoute, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="px-6 py-4 bg-white shadow-sm z-10 sticky top-0">
        <button onClick={onBack} className="text-sm text-blue-600 font-medium mb-2 flex items-center">
          ← 返回搜尋
        </button>
        <h2 className="text-2xl font-bold text-gray-800">選擇路線</h2>
        <p className="text-gray-500 text-sm">為您找到的最佳方案</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {routes.map((route) => (
          <div
            key={route.id}
            onClick={() => onSelectRoute(route)}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer active:scale-[0.98]"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1">
                  {getRouteIcons(route).map((mode, idx) => (
                    <div key={idx} className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border-2 border-white">
                      {getModeIcon(mode as TransportMode)}
                    </div>
                  ))}
                </div>
              </div>
              {route.tags.length > 0 && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  {route.tags[0]}
                </span>
              )}
            </div>

            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800">{route.summary}</h3>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{route.totalDuration}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span>{route.cost}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteList;