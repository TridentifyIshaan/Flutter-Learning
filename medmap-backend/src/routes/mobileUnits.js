const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all active mobile units
router.get('/', async (req, res, next) => {
  try {
    const units = await db('mobile_units')
      .join('facilities', 'mobile_units.facility_id', 'facilities.id')
      .select(
        'mobile_units.*',
        'facilities.name as facility_name',
        'facilities.type',
        db.raw('ST_X(mobile_units.location::geometry) as longitude'),
        db.raw('ST_Y(mobile_units.location::geometry) as latitude')
      );

    res.status(200).json(units);
  } catch (error) {
    next(error);
  }
});

// Get mobile unit by ID
router.get('/:id', async (req, res, next) => {
  try {
    const unit = await db('mobile_units')
      .join('facilities', 'mobile_units.facility_id', 'facilities.id')
      .where('mobile_units.id', parseInt(req.params.id, 10))
      .select(
        'mobile_units.*',
        'facilities.name as facility_name',
        'facilities.type',
        db.raw('ST_X(mobile_units.location::geometry) as longitude'),
        db.raw('ST_Y(mobile_units.location::geometry) as latitude')
      )
      .first();

    if (!unit) {
      return res.status(404).json({ error: 'Mobile unit not found' });
    }

    res.status(200).json(unit);
  } catch (error) {
    next(error);
  }
});

// Update mobile unit location (requires authentication)
router.put('/:id/location', authMiddleware, async (req, res, next) => {
  try {
    const { latitude, longitude, heading = 0, speed = 0 } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['latitude', 'longitude'],
      });
    }

    const [unit] = await db('mobile_units')
      .where('id', parseInt(req.params.id, 10))
      .update({
        latitude,
        longitude,
        location: db.raw(`ST_GeogFromText('SRID=4326;POINT(${longitude} ${latitude})')`),
        heading,
        speed,
      }, '*')
      .returning('*');

    if (!unit) {
      return res.status(404).json({ error: 'Mobile unit not found' });
    }

    res.status(200).json(unit);
  } catch (error) {
    next(error);
  }
});

// Update mobile unit status
router.put('/:id/status', authMiddleware, async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['status'],
      });
    }

    const [unit] = await db('mobile_units')
      .where('id', parseInt(req.params.id, 10))
      .update({ status }, '*')
      .returning('*');

    if (!unit) {
      return res.status(404).json({ error: 'Mobile unit not found' });
    }

    res.status(200).json(unit);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
