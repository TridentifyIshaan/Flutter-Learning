const express = require('express');
const OpenRouteServiceClient = require('../services/openRouteServiceClient');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');
const config = require('../config');

const router = express.Router();
const orsClient = new OpenRouteServiceClient(config.ors.apiKey);

// Get route between two locations
router.post('/directions', async (req, res, next) => {
  try {
    const { startLat, startLng, endLat, endLng, profile = 'driving-car' } = req.body;

    if (startLat === undefined || startLng === undefined || endLat === undefined || endLng === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['startLat', 'startLng', 'endLat', 'endLng'],
      });
    }

    if (!config.ors.apiKey) {
      return res.status(503).json({
        error: 'OpenRouteService not configured',
      });
    }

    const route = await orsClient.getDirections(startLat, startLng, endLat, endLng, profile);
    res.status(200).json(route);
  } catch (error) {
    next(error);
  }
});

// Get isochrone (reachable area)
router.post('/isochrone', async (req, res, next) => {
  try {
    const { latitude, longitude, maxDuration = 900 } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['latitude', 'longitude'],
      });
    }

    if (!config.ors.apiKey) {
      return res.status(503).json({
        error: 'OpenRouteService not configured',
      });
    }

    const isochrone = await orsClient.getIsochrone(latitude, longitude, maxDuration);
    res.status(200).json(isochrone);
  } catch (error) {
    next(error);
  }
});

// Save route to database (requires authentication)
router.post('/save', authMiddleware, async (req, res, next) => {
  try {
    const { 
      originFacilityId, 
      destinationFacilityId, 
      originLatitude, 
      originLongitude, 
      destinationLatitude, 
      destinationLongitude,
      distance,
      duration,
      polyline,
    } = req.body;

    const [route] = await db('routes')
      .insert({
        user_id: req.user.id,
        origin_facility_id: originFacilityId || null,
        destination_facility_id: destinationFacilityId || null,
        origin_latitude: originLatitude,
        origin_longitude: originLongitude,
        destination_latitude: destinationLatitude,
        destination_longitude: destinationLongitude,
        distance_meters: distance,
        duration_seconds: duration,
        route_polyline: polyline,
        route_data: {},
      })
      .returning('*');

    res.status(201).json(route);
  } catch (error) {
    next(error);
  }
});

// Get user's saved routes
router.get('/user/history', authMiddleware, async (req, res, next) => {
  try {
    const routes = await db('routes')
      .where('user_id', req.user.id)
      .orderBy('created_at', 'desc')
      .limit(50);

    res.status(200).json(routes);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
