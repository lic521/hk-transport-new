import React, { useState } from 'react';
import { MapPin, Navigation, Search, Loader2 } from 'lucide-react';

interface SearchFormProps {
  onSearch: (origin: string, destination: string) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin && destination) {
      onSearch(origin, destination);
    }
  };

  return (
    <div className="flex flex-col h-full justify-center px-6 fade-in-up">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
          <Navigation size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">香港交通 AI</h1>
        <p className="text-gray-500">智能規劃您的香港出行路線</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            出發地
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="例如：中環7號碼頭"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            目的地
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-red-400" />
            </div>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="例如：山頂廣場"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !origin || !destination}
          className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              正在搜尋路線...
            </>
          ) : (
            <>
              <Search className="-ml-1 mr-2 h-5 w-5" />
              查詢路線
            </>
          )}
        </button>
      </form>

      <div className="mt-8 grid grid-cols-3 gap-4 text-center text-gray-500 text-xs">
        <div className="flex flex-col items-center">
          <div className="p-2 bg-red-50 rounded-full mb-1 text-red-500"><MapPin size={16} /></div>
          <span>港鐵</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="p-2 bg-yellow-50 rounded-full mb-1 text-yellow-600"><Navigation size={16} /></div>
          <span>巴士</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="p-2 bg-green-50 rounded-full mb-1 text-green-600"><MapPin size={16} /></div>
          <span>電車</span>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;