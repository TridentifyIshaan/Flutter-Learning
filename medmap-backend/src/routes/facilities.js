const express = require('express');
const facilitiesService = require('../services/facilitiesService');
const waitTimesService = require('../services/waitTimesService');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all facilities
router.get('/', async (req, res, next) => {
  try {
    const { type, specialty, isOpen } = req.query;
    const filters = {};

    if (type) filters.type = type;
    if (specialty) filters.specialty = specialty;
    if (isOpen !== undefined) filters.isOpen = isOpen === 'true';

    const facilities = await facilitiesService.getAll(filters);
    res.status(200).json(facilities);
  } catch (error) {
    next(error);
  }
});

// Get facility by ID
router.get('/:id', async (req, res, next) => {
  try {
    const facility = await facilitiesService.getById(parseInt(req.params.id, 10));

    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }

    res.status(200).json(facility);
  } catch (error) {
    next(error);
  }
});

// Search facilities
router.get('/search/query', async (req, res, next) => {
  try {
    const { q, limit } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query (q) is required' });
    }

    const results = await facilitiesService.search(q, parseInt(limit || '10', 10));
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
});

// Find nearby facilities
router.post('/nearby', async (req, res, next) => {
  try {
    const { latitude, longitude, radiusKm = 10, limit = 20 } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['latitude', 'longitude'],
      });
    }

    const facilities = await facilitiesService.findNearby(
      latitude,
      longitude,
      radiusKm,
      limit
    );

    res.status(200).json(facilities);
  } catch (error) {
    next(error);
  }
});

// Find nearest facility
router.post('/nearest', async (req, res, next) => {
  try {
    const { latitude, longitude, type } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['latitude', 'longitude'],
      });
    }

    const facility = await facilitiesService.findNearest(latitude, longitude, type);

    if (!facility) {
      return res.status(404).json({ error: 'No facilities found' });
    }

    res.status(200).json(facility);
  } catch (error) {
    next(error);
  }
});

// Get facilities by type
router.get('/type/:type', async (req, res, next) => {
  try {
    const facilities = await facilitiesService.getByType(req.params.type);
    res.status(200).json(facilities);
  } catch (error) {
    next(error);
  }
});

// Get facility statistics
router.get('/stats/all', async (req, res, next) => {
  try {
    const stats = await facilitiesService.getStats();
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
