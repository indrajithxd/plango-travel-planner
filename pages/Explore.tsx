import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Destination } from '../types';
import { dataService } from '../services/dataService';
import DestinationCard from '../components/DestinationCard';

const Explore: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filtered, setFiltered] = useState<Destination[]>([]);
  const [search, setSearch] = useState('');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await dataService.getDestinations();
      setDestinations(data);
      setFiltered(data);
      setSavedIds(dataService.getBucketList());
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const results = destinations.filter(d => 
      d.name.toLowerCase().includes(lowerSearch) || 
      d.country.toLowerCase().includes(lowerSearch)
    );
    setFiltered(results);
  }, [search, destinations]);

  const handleToggleSave = (id: string) => {
    if (savedIds.includes(id)) {
      dataService.removeFromBucketList(id);
      setSavedIds(prev => prev.filter(sid => sid !== id));
    } else {
      dataService.addToBucketList(id);
      setSavedIds(prev => [...prev, id]);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-plango-500 py-16 px-4 sm:px-6 lg:px-8 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Discover Your Next Adventure</h1>
          <p className="text-plango-100 text-lg mb-8">Explore curated destinations tailored for every traveler.</p>
          
          <div className="relative max-w-lg mx-auto">
            <input 
              type="text"
              placeholder="Search countries, cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full text-gray-800 shadow-xl focus:outline-none focus:ring-2 focus:ring-plango-300"
            />
            <Search className="absolute left-4 top-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Popular Destinations</h2>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-plango-600">
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(dest => (
              <DestinationCard 
                key={dest.id} 
                destination={dest} 
                isSaved={savedIds.includes(dest.id)}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No destinations found for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;