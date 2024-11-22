import { Request, Response } from 'express';
import axios from 'axios';
import Location from '../models/location.model';

// Controller to save the user's location
export const saveUserLocation = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // Reverse geocode to get the city and country from latitude and longitude
    const { city, country } = await reverseGeocode(latitude, longitude);

    // Create a new location record for the user (no userId required now)
    const location = new Location({
      city,
      country,
      coordinates: [longitude, latitude], // Store the coordinates directly
    });

    // Save the location in the database
    await location.save();

    return res.status(201).json({ message: 'Location saved successfully', location });
  } catch (error) {
    console.error('Error saving user location:', error);
    return res.status(500).json({ message: 'Failed to save location' });
  }
};

// Function to reverse geocode latitude and longitude into city and country
const reverseGeocode = async (latitude: number, longitude: number): Promise<{ city: string, country: string }> => {
  const REVERSE_GEOCODING_API = 'https://api.opencagedata.com/geocode/v1/json';
  const API_KEY = '002462556f154351947ada0d9dbf8ba0'; // Replace with your actual API key

  try {
    const response = await axios.get(REVERSE_GEOCODING_API, {
      params: {
        q: `${latitude},${longitude}`,
        key: API_KEY,
      },
    });

    const results = response.data.results[0];
    const city = results.components.city || results.components.town || results.components.village || '';
    const country = results.components.country || '';

    if (!city || !country) {
      throw new Error('Unable to extract city or country');
    }

    return { city, country };
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    throw new Error('Failed to reverse geocode location');
  }
};
