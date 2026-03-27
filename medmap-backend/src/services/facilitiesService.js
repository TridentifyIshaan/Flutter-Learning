const db = require('../config/database');

const facilitiesService = {
  // Get all facilities with optional filters
  getAll: async (filters = {}) => {
    let query = db('facilities').where('active', true);

    if (filters.type) {
      query = query.where('type', filters.type);
    }

    if (filters.specialty) {
      query = query.whereRaw("specialties::text LIKE ?", [`%${filters.specialty}%`]);
    }

    if (filters.isOpen !== undefined) {
      query = query.where('is_open', filters.isOpen);
    }

    return query.select('*').orderBy('name');
  },

  // Get facility by ID with wait time
  getById: async (id) => {
    const facility = await db('facilities').where('id', id).where('active', true).first();

    if (!facility) return null;

    const latestWaitTime = await db('wait_times')
      .where('facility_id', id)
      .orderBy('created_at', 'desc')
      .first();

    return {
      ...facility,
      currentWaitTime: latestWaitTime?.wait_time_minutes || 0,
      specialties: Array.isArray(facility.specialties) ? facility.specialties : JSON.parse(facility.specialties || '[]'),
    };
  },

  // Search facilities by name or address
  search: async (query, limit = 10) => {
    return db('facilities')
      .where('active', true)
      .andWhere((builder) => {
        builder
          .whereRaw('name ILIKE ?', [`%${query}%`])
          .orWhereRaw('address ILIKE ?', [`%${query}%`]);
      })
      .limit(limit)
      .select('*');
  },

  // Find facilities nearby using PostGIS ST_DWithin
  findNearby: async (latitude, longitude, radiusKm = 10, limit = 20) => {
    return db('facilities')
      .where('active', true)
      .whereRaw('ST_DWithin(geometry, ST_GeogFromText(?), ?) = true', [
        `SRID=4326;POINT(${longitude} ${latitude})`,
        radiusKm * 1000, // Convert km to meters
      ])
      .select('*', 
        db.raw('ST_DistanceSphere(geometry, ST_GeogFromText(?))::int as distance_meters', [
          `SRID=4326;POINT(${longitude} ${latitude})`,
        ])
      )
      .orderBy('distance_meters')
      .limit(limit);
  },

  // Find nearest facility of specific type
  findNearest: async (latitude, longitude, facilitiesType = null) => {
    let query = db('facilities').where('active', true).where('is_open', true);

    if (facilitiesType) {
      query = query.where('type', facilitiesType);
    }

    return query
      .select('*', 
        db.raw('ST_DistanceSphere(geometry, ST_GeogFromText(?))::int as distance_meters', [
          `SRID=4326;POINT(${longitude} ${latitude})`,
        ])
      )
      .orderBy('distance_meters')
      .first();
  },

  // Get facilities by type
  getByType: async (type) => {
    return db('facilities')
      .where('active', true)
      .where('type', type)
      .select('*')
      .orderBy('rating', 'desc');
  },

  // Get facility statistics
  getStats: async () => {
    return db('facilities')
      .where('active', true)
      .select(
        db.raw('type'),
        db.raw('COUNT(*) as count'),
        db.raw('AVG(CAST(rating as NUMERIC)) as avg_rating'),
        db.raw('COUNT(CASE WHEN is_open = true THEN 1 END) as open_count')
      )
      .groupBy('type');
  },
};

module.exports = facilitiesService;
