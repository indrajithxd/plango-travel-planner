export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  priceLevel: 'Budget' | 'Moderate' | 'Luxury';
  rating: number;
}

export interface BucketListItem {
  id: string;
  destinationId: string;
  addedAt: string;
}

export enum TravelStyle {
  Relaxed = 'Relaxed',
  Adventure = 'Adventure',
  Budget = 'Budget',
  Luxury = 'Luxury',
  Cultural = 'Cultural'
}

export interface Activity {
  time: string; // "Morning", "Afternoon", "Evening"
  title: string;
  description: string;
}

export interface ItineraryDay {
  day: number;
  activities: Activity[];
}

export interface Itinerary {
  id: string;
  destinationName: string;
  days: number;
  style: TravelStyle;
  schedule: ItineraryDay[];
  createdAt: string;
}

// For Gemini API Response
export interface GeminiItineraryResponse {
  destination: string;
  days: number;
  style: string;
  itinerary: {
    day: number;
    activities: {
      time_of_day: string;
      activity_title: string;
      description: string;
    }[];
  }[];
}