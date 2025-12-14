import React from 'react';
import { MapPin, DollarSign, Star, Heart } from 'lucide-react';
import { Destination } from '../types';

interface Props {
  destination: Destination;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

const DestinationCard: React.FC<Props> = ({ destination, isSaved, onToggleSave }) => {
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={destination.imageUrl} 
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
        
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleSave(destination.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full glass transition-colors ${
            isSaved ? 'bg-red-500 text-white border-none' : 'text-white hover:bg-white/20'
          }`}
        >
          <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
        </button>

        <div className="absolute bottom-3 left-3 text-white">
          <h3 className="text-xl font-bold">{destination.name}</h3>
          <div className="flex items-center text-sm opacity-90">
            <MapPin size={14} className="mr-1" />
            {destination.country}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center text-yellow-500">
            <Star size={16} fill="currentColor" />
            <span className="ml-1 text-sm font-semibold text-gray-700">{destination.rating}</span>
          </div>
          <div className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600 flex items-center">
            {destination.priceLevel === 'Budget' && <DollarSign size={12} />}
            {destination.priceLevel === 'Moderate' && <><DollarSign size={12} /><DollarSign size={12} /></>}
            {destination.priceLevel === 'Luxury' && <><DollarSign size={12} /><DollarSign size={12} /><DollarSign size={12} /></>}
            <span className="ml-1">{destination.priceLevel}</span>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-grow">
          {destination.description}
        </p>

        <button className="w-full py-2 mt-auto bg-plango-50 text-plango-600 rounded-lg font-medium hover:bg-plango-100 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;