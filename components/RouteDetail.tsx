import React, { useEffect, useState } from 'react';
import { RouteOption, TransportMode, RouteStep } from '../types';
import { Clock, MapPin, ArrowLeft, ExternalLink, Navigation, RefreshCw } from 'lucide-react';

interface RouteDetailProps {
  route: RouteOption;
  onBack: () => void;
}

const getStepColor = (mode: TransportMode) => {
  switch (mode) {
    case TransportMode.SUBWAY: return "bg-red-500";
    case TransportMode.BUS: return "bg-yellow-500";
    case TransportMode.TRAM: return "bg-green-600";
    case TransportMode.FERRY: return "bg-blue-500";
    case TransportMode.WALK: return "bg-gray-300";
    default: return "bg-gray-400";
  }
};

const StepCard: React.FC<{ step: RouteStep; isLast: boolean }> = ({ step, isLast }) => {
  // Simulate live countdown ticking
  const [minutes, setMinutes] = useState(step.waitMinutes || 0);

  useEffect(() => {
    if (!step.waitMinutes) return;
    
    // Just a visual effect to make it feel alive, reducing by 1 every 60s
    const interval = setInterval(() => {
      setMinutes((prev) => (prev > 0 ? prev - 1 : step.waitMinutes || 5)); // Reset to original if 0 for loop
    }, 60000);
    
    return () => clearInterval(interval);
  }, [step.waitMinutes]);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(step.locationName)}`;

  const isTransit = [TransportMode.SUBWAY, TransportMode.BUS, TransportMode.TRAM, TransportMode.FERRY].includes(step.mode);

  return (
    <div className="relative pl-8 pb-8 last:pb-0">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gray-200" />
      )}
      
      {/* Timeline Dot */}
      <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${getStepColor(step.mode)}`}>
        {/* Inner dot handled by color */}
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold text-white mb-1 ${getStepColor(step.mode)}`}>
              {step.mode === 'SUBWAY' ? '港鐵' : 
               step.mode === 'BUS' ? '巴士' :
               step.mode === 'TRAM' ? '電車' :
               step.mode === 'FERRY' ? '渡輪' :
               step.mode === 'WALK' ? '步行' : step.mode} {step.lineName ? `• ${step.lineName}` : ''}
            </span>
            <h4 className="font-semibold text-gray-800 text-lg">{step.instruction}</h4>
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">{step.duration}</span>
        </div>

        {isTransit && step.waitMinutes !== undefined && (
          <div className="flex items-center text-sm text-blue-600 bg-blue-50 p-2 rounded-md mb-3 animate-pulse">
             <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
             下一班車： <span className="font-bold mx-1">{minutes === 0 ? '即將到達' : `${minutes} 分鐘後`}</span>
          </div>
        )}

        {/* Location & Map Button */}
        {step.locationName && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
            <div className="flex items-center text-gray-500 text-sm truncate mr-2">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{step.locationName}</span>
            </div>
            
            <a 
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-full transition-colors"
            >
              地圖 <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const RouteDetail: React.FC<RouteDetailProps> = ({ route, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-6 shadow-md sticky top-0 z-20">
        <div className="flex items-center mb-4">
          <button onClick={onBack} className="p-1 hover:bg-blue-700 rounded-full transition-colors mr-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold truncate flex-1">路線詳情</h2>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold">{route.totalDuration}</h1>
            <p className="text-blue-100 text-sm">{route.summary}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-semibold">{route.cost}</div>
            <div className="text-xs text-blue-200">預計車費</div>
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="relative">
           {route.steps.map((step, index) => (
             <StepCard 
               key={index} 
               step={step} 
               isLast={index === route.steps.length - 1} 
             />
           ))}
           
           {/* End Flag */}
           <div className="relative pl-8 pt-2">
             <div className="absolute left-0 top-3 w-6 h-6 rounded-full bg-gray-800 border-4 border-white shadow-sm flex items-center justify-center">
               <div className="w-2 h-2 bg-white rounded-full" />
             </div>
             <div className="text-gray-800 font-bold">抵達目的地</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RouteDetail;