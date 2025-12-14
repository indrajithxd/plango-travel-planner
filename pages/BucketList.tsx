import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { Destination } from '../types';
import { dataService } from '../services/dataService';
import DestinationCard from '../components/DestinationCard';

const BucketList: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBucketList = async () => {
      const savedIds = dataService.getBucketList();
      const allDestinations = await dataService.getDestinations();
      const saved = allDestinations.filter(d => savedIds.includes(d.id));
      setDestinations(saved);
      setLoading(false);
    };
    loadBucketList();
  }, []);

  const handleRemove = (id: string) => {
    dataService.removeFromBucketList(id);
    setDestinations(prev => prev.filter(d => d.id !== id));
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading your dreams...</div>;

  return (
    <div className="min-h-screen bg-gray-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-red-100 rounded-full text-red-500">
          <Heart size={28} fill="currentColor" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">My Bucket List</h1>
      </div>

      {destinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map(dest => (
            <DestinationCard 
              key={dest.id} 
              destination={dest} 
              isSaved={true}
              onToggleSave={handleRemove}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 glass rounded-3xl border border-dashed border-gray-300">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
            <Heart size={40} />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Your bucket list is empty</h3>
          <p className="text-gray-500 mb-8 max-w-md text-center">
            Start exploring exotic locations and save them here to plan your future adventures.
          </p>
          <Link 
            to="/" 
            className="flex items-center space-x-2 bg-plango-500 text-white px-6 py-3 rounded-full hover:bg-plango-600 transition-colors shadow-lg shadow-plango-200"
          >
            <span>Explore Destinations</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default BucketList;