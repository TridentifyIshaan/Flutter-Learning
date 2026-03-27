const express = require('express');
const waitTimesService = require('../services/waitTimesService');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get latest wait time for a facility
router.get('/facility/:facilityId', async (req, res, next) => {
  try {
    const waitTime = await waitTimesService.getLatest(parseInt(req.params.facilityId, 10));

    if (!waitTime) {
      return res.status(404).json({ error: 'No wait time data found' });
    }

    res.status(200).json(waitTime);
  } catch (error) {
    next(error);
  }
});

// Get wait time history for a facility
router.get('/facility/:facilityId/history', async (req, res, next) => {
  try {
    const { limit } = req.query;
    const history = await waitTimesService.getHistory(
      parseInt(req.params.facilityId, 10),
      parseInt(limit || '100', 10)
    );

    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
});

// Get all latest wait times
router.get('/', async (req, res, next) => {
  try {
    const waitTimes = await waitTimesService.getAllLatest();
    res.status(200).json(waitTimes);
  } catch (error) {
    next(error);
  }
});

// Create/update wait time (requires authentication)
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { facilityId, waitTimeMinutes, patientsWaiting } = req.body;

    if (!facilityId || waitTimeMinutes === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['facilityId', 'waitTimeMinutes'],
      });
    }

    const [waitTime] = await waitTimesService.createOrUpdate(
      facilityId,
      waitTimeMinutes,
      patientsWaiting || 0
    );

    res.status(201).json(waitTime);
  } catch (error) {
    next(error);
  }
});

// Get average wait time
router.get('/facility/:facilityId/average', async (req, res, next) => {
  try {
    const { hoursLookback } = req.query;
    const average = await waitTimesService.getAverage(
      parseInt(req.params.facilityId, 10),
      parseInt(hoursLookback || '24', 10)
    );

    res.status(200).json({ average_wait: average });
  } catch (error) {
    next(error);
  }
});

// Get high wait time facilities
router.get('/high-wait/list', async (req, res, next) => {
  try {
    const { limit } = req.query;
    const facilities = await waitTimesService.getHighWaitFacilities(parseInt(limit || '10', 10));
    res.status(200).json(facilities);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
