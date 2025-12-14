import { Destination, BucketListItem, Itinerary } from '../types';

// Mock Destinations Data
const MOCK_DESTINATIONS: Destination[] = [
  {
    id: 'd1',
    name: 'Santorini',
    country: 'Greece',
    description: 'Whitewashed houses, deep blue waters, and stunning sunsets.',
    imageUrl: 'https://picsum.photos/id/400/800/600',
    priceLevel: 'Luxury',
    rating: 4.8
  },
  {
    id: 'd2',
    name: 'Kyoto',
    country: 'Japan',
    description: 'Ancient temples, traditional tea houses, and cherry blossoms.',
    imageUrl: 'https://picsum.photos/id/401/800/600',
    priceLevel: 'Moderate',
    rating: 4.9
  },
  {
    id: 'd3',
    name: 'Bali',
    country: 'Indonesia',
    description: 'Tropical paradise with lush jungles, beaches, and rich culture.',
    imageUrl: 'https://picsum.photos/id/402/800/600',
    priceLevel: 'Budget',
    rating: 4.7
  },
  {
    id: 'd4',
    name: 'Reykjavik',
    country: 'Iceland',
    description: 'Land of fire and ice, northern lights, and geothermal lagoons.',
    imageUrl: 'https://picsum.photos/id/403/800/600',
    priceLevel: 'Luxury',
    rating: 4.6
  },
  {
    id: 'd5',
    name: 'Cusco',
    country: 'Peru',
    description: 'Gateway to Machu Picchu, rich Incan history and Andes mountains.',
    imageUrl: 'https://picsum.photos/id/404/800/600',
    priceLevel: 'Moderate',
    rating: 4.8
  },
  {
    id: 'd6',
    name: 'New York City',
    country: 'USA',
    description: 'The city that never sleeps, skyscrapers, and Broadway.',
    imageUrl: 'https://picsum.photos/id/405/800/600',
    priceLevel: 'Luxury',
    rating: 4.5
  }
];

// Local Storage Keys
const KEY_BUCKETLIST = 'plango_bucketlist';
const KEY_ITINERARIES = 'plango_itineraries';

export const dataService = {
  getDestinations: async (): Promise<Destination[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_DESTINATIONS;
  },

  getDestinationById: async (id: string): Promise<Destination | undefined> => {
    return MOCK_DESTINATIONS.find(d => d.id === id);
  },

  // Bucket List Operations
  getBucketList: (): string[] => {
    const stored = localStorage.getItem(KEY_BUCKETLIST);
    return stored ? JSON.parse(stored) : [];
  },

  addToBucketList: (destinationId: string) => {
    const list = dataService.getBucketList();
    if (!list.includes(destinationId)) {
      list.push(destinationId);
      localStorage.setItem(KEY_BUCKETLIST, JSON.stringify(list));
    }
  },

  removeFromBucketList: (destinationId: string) => {
    let list = dataService.getBucketList();
    list = list.filter(id => id !== destinationId);
    localStorage.setItem(KEY_BUCKETLIST, JSON.stringify(list));
  },

  // Itinerary Operations
  saveItinerary: (itinerary: Itinerary) => {
    const stored = localStorage.getItem(KEY_ITINERARIES);
    const itineraries: Itinerary[] = stored ? JSON.parse(stored) : [];
    itineraries.unshift(itinerary); // Add to top
    localStorage.setItem(KEY_ITINERARIES, JSON.stringify(itineraries));
  },

  getSavedItineraries: (): Itinerary[] => {
    const stored = localStorage.getItem(KEY_ITINERARIES);
    return stored ? JSON.parse(stored) : [];
  }
};