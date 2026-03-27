const axios = require('axios');
const config = require('../config');

class OpenRouteServiceClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = config.ors.baseUrl;
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': apiKey,
      },
    });
  }

  // Get directions between two coordinates
  async getDirections(startLat, startLng, endLat, endLng, profile = 'driving-car') {
    try {
      const response = await this.client.get('/v2/directions/' + profile, {
        params: {
          start: `${startLng},${startLat}`,
          end: `${endLng},${endLat}`,
        },
      });

      const route = response.data.routes[0];

      return {
        distance: route.distance, // meters
        duration: route.duration, // seconds
        polyline: route.geometry,
        summary: route.summary,
      };
    } catch (error) {
      console.error('ORS Error:', error.message);
      throw new Error(`Failed to get directions: ${error.message}`);
    }
  }

  // Get isochrone (reachable areas within time/distance)
  async getIsochrone(lat, lng, maxDuration = 900) {
    // maxDuration in seconds
    try {
      const response = await this.client.get('/v2/isochrones', {
        params: {
          locations: `${lng},${lat}`,
          range: maxDuration,
        },
      });

      return response.data;
    } catch (error) {
      console.error('ORS Isochrone Error:', error.message);
      throw new Error(`Failed to get isochrone: ${error.message}`);
    }
  }

  // Get matrix distances (many-to-many routing)
  async getDistanceMatrix(locations, profile = 'driving-car') {
    try {
      const coordinatesString = locations.map(loc => `${loc.lng},${loc.lat}`).join('|');

      const response = await this.client.post('/v2/matrix/' + profile, {
        locations: coordinatesString.split('|').map(coord => coord.split(',').map(Number)),
      });

      return response.data;
    } catch (error) {
      console.error('ORS Matrix Error:', error.message);
      throw new Error(`Failed to get distance matrix: ${error.message}`);
    }
  }
}

module.exports = OpenRouteServiceClient;
