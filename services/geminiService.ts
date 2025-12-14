import { GoogleGenAI, Type } from "@google/genai";
import { TravelStyle, Itinerary, ItineraryDay } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure process.env.API_KEY.");
  }
  return new GoogleGenAI({ apiKey });
};

export const geminiService = {
  generateItinerary: async (
    destination: string,
    days: number,
    style: TravelStyle
  ): Promise<Itinerary> => {
    const ai = createClient();
    
    // Schema definition for strict JSON output
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        destination: { type: Type.STRING },
        days: { type: Type.INTEGER },
        style: { type: Type.STRING },
        itinerary: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.INTEGER },
              activities: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time_of_day: { type: Type.STRING, enum: ["Morning", "Afternoon", "Evening"] },
                    activity_title: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["time_of_day", "activity_title", "description"]
                }
              }
            },
            required: ["day", "activities"]
          }
        }
      },
      required: ["destination", "days", "style", "itinerary"]
    };

    const prompt = `
      Create a detailed ${days}-day travel itinerary for ${destination}.
      The travel style is "${style}".
      
      For each day, provide 3 main activity blocks: Morning, Afternoon, and Evening.
      Ensure the activities are realistic for the location and fit the requested style.
      
      Return ONLY valid JSON.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.7,
        }
      });

      const jsonText = response.text;
      if (!jsonText) throw new Error("No data received from Gemini");

      const parsedData = JSON.parse(jsonText);

      // Map the AI response to our internal TypeScript model
      const schedule: ItineraryDay[] = parsedData.itinerary.map((dayItem: any) => ({
        day: dayItem.day,
        activities: dayItem.activities.map((act: any) => ({
          time: act.time_of_day,
          title: act.activity_title,
          description: act.description
        }))
      }));

      const newItinerary: Itinerary = {
        id: crypto.randomUUID(),
        destinationName: parsedData.destination,
        days: parsedData.days,
        style: style,
        schedule: schedule,
        createdAt: new Date().toISOString()
      };

      return newItinerary;

    } catch (error) {
      console.error("Gemini Generation Error:", error);
      throw error;
    }
  }
};