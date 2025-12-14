import React, { useEffect, useState } from 'react';
import { User, Map, Calendar, Settings, LogOut } from 'lucide-react';
import { authService } from '../services/authService';
import { dataService } from '../services/dataService';
import { User as UserType, Itinerary } from '../types';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [bucketCount, setBucketCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const u = await authService.getCurrentUser();
      setUser(u);
      setItineraries(dataService.getSavedItineraries());
      setBucketCount(dataService.getBucketList().length);
    };
    loadData();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
          <img 
            src={user.avatar || 'https://via.placeholder.com/150'} 
            alt="Profile" 
            className="w-32 h-32 rounded-full border-4 border-plango-100"
          />
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500 mb-4">{user.email}</p>
            <div className="flex justify-center md:justify-start space-x-4">
              <div className="bg-blue-50 px-4 py-2 rounded-xl text-center">
                <div className="text-2xl font-bold text-blue-600">{itineraries.length}</div>
                <div className="text-xs text-blue-400 uppercase font-bold">Trips Planned</div>
              </div>
              <div className="bg-pink-50 px-4 py-2 rounded-xl text-center">
                <div className="text-2xl font-bold text-pink-600">{bucketCount}</div>
                <div className="text-xs text-pink-400 uppercase font-bold">Bucket List</div>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center space-x-2"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        {/* Content Tabs / Sections */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Calendar className="mr-2 text-plango-500" /> 
            Saved Itineraries
          </h2>
          
          {itineraries.length > 0 ? (
            <div className="grid gap-6">
              {itineraries.map(it => (
                <div key={it.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{it.destinationName}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {it.days} Days • {it.style} Style • Created on {new Date(it.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="text-plango-600 font-medium text-sm hover:underline">
                      View Details
                    </button>
                  </div>
                  <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
                    {it.schedule.slice(0, 3).map(day => (
                      <span key={day.day} className="px-3 py-1 bg-gray-100 rounded text-xs text-gray-600 whitespace-nowrap">
                        Day {day.day}: {day.activities[0]?.title}
                      </span>
                    ))}
                    {it.schedule.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 rounded text-xs text-gray-400">
                        +{it.schedule.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
              <p>You haven't generated any itineraries yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;