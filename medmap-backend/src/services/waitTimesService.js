const db = require('../config/database');

const waitTimesService = {
  // Get latest wait time for a facility
  getLatest: async (facilityId) => {
    return db('wait_times')
      .where('facility_id', facilityId)
      .orderBy('created_at', 'desc')
      .first();
  },

  // Get wait time history for a facility
  getHistory: async (facilityId, limit = 100) => {
    return db('wait_times')
      .where('facility_id', facilityId)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .select('*');
  },

  // Get all latest wait times
  getAllLatest: async () => {
    return db('wait_times')
      .joinRaw('INNER JOIN facilities ON wait_times.facility_id = facilities.id')
      .whereRaw(`wait_times.created_at = (
        SELECT MAX(created_at) FROM wait_times AS wt2 
        WHERE wt2.facility_id = wait_times.facility_id
      )`)
      .select('wait_times.*', 'facilities.name', 'facilities.type', 'facilities.address');
  },

  // Create or update wait time
  createOrUpdate: async (facilityId, waitTimeMinutes, patientsWaiting = 0) => {
    const status = 
      waitTimeMinutes < 20 ? 'normal' : 
      waitTimeMinutes < 45 ? 'high' : 'critical';

    return db('wait_times').insert({
      facility_id: facilityId,
      wait_time_minutes: waitTimeMinutes,
      status,
      patients_waiting: patientsWaiting,
    }).returning('*');
  },

  // Get average wait time for a facility
  getAverage: async (facilityId, hoursLookback = 24) => {
    const cutoffTime = new Date(Date.now() - hoursLookback * 60 * 60 * 1000);
    
    const result = await db('wait_times')
      .where('facility_id', facilityId)
      .where('created_at', '>=', cutoffTime)
      .avg('wait_time_minutes as average_wait')
      .first();

    return result?.average_wait || 0;
  },

  // Get high wait time facilities
  getHighWaitFacilities: async (limit = 10) => {
    return db('wait_times')
      .joinRaw('INNER JOIN facilities ON wait_times.facility_id = facilities.id')
      .where('wait_times.status', 'high')
      .orWhere('wait_times.status', 'critical')
      .orderBy('wait_times.wait_time_minutes', 'desc')
      .limit(limit)
      .select('wait_times.*', 'facilities.name', 'facilities.type', 'facilities.address');
  },
};

module.exports = waitTimesService;
