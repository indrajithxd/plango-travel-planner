import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, Clock, Save, CheckCircle } from 'lucide-react';
import { TravelStyle, Itinerary } from '../types';
import { geminiService } from '../services/geminiService';
import { dataService } from '../services/dataService';

const ItineraryGenerator: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [style, setStyle] = useState<TravelStyle>(TravelStyle.Relaxed);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Itinerary | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;
    if (!process.env.API_KEY) {
      setError("Missing API Key. Please set process.env.API_KEY.");
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setSaved(false);

    try {
      const itinerary = await geminiService.generateItinerary(destination, days, style);
      setResult(itinerary);
    } catch (err: any) {
      setError('Failed to generate itinerary. Please try again. ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (result) {
      dataService.saveItinerary(result);
      setSaved(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-plango-50 to-white pb-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-plango-100 rounded-full text-plango-600 mb-4">
            <Sparkles size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">AI Itinerary Planner</h1>
          <p className="text-lg text-gray-600">Tell us where and when, and we'll plan the perfect trip.</p>
        </div>

        {/* Input Form */}
        <div className="glass bg-white p-8 rounded-3xl shadow-xl border border-white/50 mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Destination */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Where to?</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g., Paris, Tokyo"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-plango-500 focus:border-transparent transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Duration (Days)</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value))}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-plango-500 outline-none"
                  />
                </div>
              </div>

              {/* Style */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Travel Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as TravelStyle)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-plango-500 outline-none appearance-none"
                >
                  {Object.values(TravelStyle).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-plango-600 to-plango-500 hover:shadow-plango-200 hover:-translate-y-1'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Magic...</span>
                </span>
              ) : (
                'Generate Itinerary'
              )}
            </button>
          </form>
          {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
        </div>

        {/* Results Section */}
        {result && (
          <div className="animate-fade-in-up space-y-8">
            <div className="flex justify-between items-end border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{result.destinationName}</h2>
                <p className="text-gray-500 flex items-center mt-1">
                  <span className="bg-plango-100 text-plango-700 text-xs px-2 py-1 rounded mr-2 uppercase tracking-wide font-bold">{result.style}</span>
                  {result.days} Days Trip
                </p>
              </div>
              <button 
                onClick={handleSave}
                disabled={saved}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                  saved ? 'bg-green-100 text-green-700' : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {saved ? <CheckCircle size={18} /> : <Save size={18} />}
                <span>{saved ? 'Saved to Profile' : 'Save Itinerary'}</span>
              </button>
            </div>

            <div className="space-y-8">
              {result.schedule.map((dayItem) => (
                <div key={dayItem.day} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="bg-plango-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-plango-200">
                      {dayItem.day}
                    </div>
                    <h3 className="ml-4 text-xl font-bold text-gray-800">Day {dayItem.day}</h3>
                  </div>

                  <div className="space-y-6 border-l-2 border-gray-100 ml-5 pl-8 relative">
                    {dayItem.activities.map((activity, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[39px] top-1 w-4 h-4 rounded-full bg-white border-4 border-plango-300"></div>
                        <div className="flex items-center text-sm font-semibold text-plango-600 mb-1 uppercase tracking-wider">
                          <Clock size={14} className="mr-1" />
                          {activity.time}
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1">{activity.title}</h4>
                        <p className="text-gray-600 leading-relaxed">{activity.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryGenerator;