exports.up = async (knex) => {
  // Create users table
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.string('full_name').notNullable();
    table.string('user_type').notNullable().defaultTo('patient'); // 'patient', 'operator', 'admin'
    table.string('phone').nullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    table.index('email');
  });

  // Create facilities table with PostGIS geometry
  await knex.schema.createTable('facilities', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('type').notNullable(); // 'hospital', 'clinic', 'pharma', 'mobile'
    table.string('address').notNullable();
    table.decimal('latitude', 10, 8).notNullable();
    table.decimal('longitude', 11, 8).notNullable();
    table.specificType('geometry', 'GEOGRAPHY(POINT, 4326)').notNullable();
    table.string('phone').notNullable();
    table.text('description').notNullable();
    table.json('specialties').defaultTo('[]'); // Array of specialties
    table.integer('beds').nullable();
    table.decimal('rating', 3, 1).defaultTo(4.0);
    table.boolean('is_open').defaultTo(true);
    table.boolean('active').defaultTo(true);
    table.timestamps(true, true);
    table.index('type');
    table.index('is_open');
  });

  // Add spatial index on geometry
  await knex.raw('CREATE INDEX idx_facilities_geometry ON facilities USING GIST (geometry)');

  // Create wait_times table
  await knex.schema.createTable('wait_times', (table) => {
    table.increments('id').primary();
    table.integer('facility_id').unsigned().notNullable().references('id').inTable('facilities').onDelete('CASCADE');
    table.integer('wait_time_minutes').notNullable();
    table.string('status').defaultTo('normal'); // 'normal', 'high', 'critical'
    table.integer('patients_waiting').defaultTo(0);
    table.timestamps(true, true);
    table.index('facility_id');
    table.index('created_at');
  });

  // Create mobile_units table
  await knex.schema.createTable('mobile_units', (table) => {
    table.increments('id').primary();
    table.integer('facility_id').unsigned().notNullable().references('id').inTable('facilities').onDelete('CASCADE');
    table.string('operator_id').nullable();
    table.decimal('latitude', 10, 8).notNullable();
    table.decimal('longitude', 11, 8).notNullable();
    table.specificType('location', 'GEOGRAPHY(POINT, 4326)').notNullable();
    table.integer('heading').defaultTo(0);
    table.decimal('speed', 5, 2).defaultTo(0);
    table.string('status').defaultTo('active'); // 'active', 'idle', 'maintenance'
    table.timestamps(true, true);
    table.index('facility_id');
    table.index('status');
  });

  // Add spatial index on mobile_units
  await knex.raw('CREATE INDEX idx_mobile_units_location ON mobile_units USING GIST (location)');

  // Create routes table
  await knex.schema.createTable('routes', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('origin_facility_id').unsigned().nullable().references('id').inTable('facilities').onDelete('SET NULL');
    table.integer('destination_facility_id').unsigned().nullable().references('id').inTable('facilities').onDelete('SET NULL');
    table.decimal('origin_latitude', 10, 8).notNullable();
    table.decimal('origin_longitude', 11, 8).notNullable();
    table.decimal('destination_latitude', 10, 8).notNullable();
    table.decimal('destination_longitude', 11, 8).notNullable();
    table.text('route_polyline').nullable();
    table.integer('distance_meters').nullable();
    table.integer('duration_seconds').nullable();
    table.json('route_data').defaultTo('{}');
    table.timestamps(true, true);
    table.index('user_id');
    table.index('origin_facility_id');
    table.index('destination_facility_id');
  });

  // Create facility_archives table (for IPFS pinning)
  await knex.schema.createTable('facility_archives', (table) => {
    table.increments('id').primary();
    table.integer('facility_id').unsigned().notNullable().references('id').inTable('facilities').onDelete('CASCADE');
    table.string('ipfs_hash').notNullable().unique();
    table.json('archived_data').notNullable();
    table.string('archived_by_user_id').nullable();
    table.timestamps(true, true);
    table.index('facility_id');
    table.index('ipfs_hash');
  });

  console.log('✅ All tables created successfully');
};

exports.down = async (knex) => {
  // Drop tables in reverse order of dependencies
  await knex.schema.dropTableIfExists('facility_archives');
  await knex.schema.dropTableIfExists('routes');
  await knex.schema.dropTableIfExists('mobile_units');
  await knex.schema.dropTableIfExists('wait_times');
  await knex.schema.dropTableIfExists('facilities');
  await knex.schema.dropTableIfExists('users');
  
  console.log('✅ All tables dropped successfully');
};
