require('dotenv').config();
const WebSocket = require('ws');
const db = require('./config/database');
const config = require('./config');

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ port: config.wsPort });

console.log(`\n✅ WebSocket Server running on port ${config.wsPort}`);
console.log(`🔄 Broadcasting real-time updates (wait-times, mobile unit GPS)\n`);

// Store connected clients by subscription type
const subscribers = {
  waitTimes: new Set(),
  mobileUnits: new Set(),
  facilities: new Map(), // facility_id -> Set of clients
};

// Connection handler
wss.on('connection', (ws) => {
  console.log(`📡 Client connected. Total clients: ${wss.clients.size}`);

  ws.isAlive = true;
  ws.subscriptions = new Set();

  // Heartbeat ping/pong
  ws.on('pong', () => {
    ws.isAlive = true;
  });

  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      handleWebSocketMessage(ws, data);
    } catch (error) {
      console.error('WebSocket message error:', error.message);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format',
      }));
    }
  });

  // Disconnection handler
  ws.on('close', () => {
    // Remove from all subscriptions
    subscribers.waitTimes.delete(ws);
    subscribers.mobileUnits.delete(ws);
    subscribers.facilities.forEach(clients => clients.delete(ws));
    
    console.log(`❌ Client disconnected. Total clients: ${wss.clients.size}`);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error.message);
  });
});

// Handle WebSocket messages
function handleWebSocketMessage(ws, data) {
  const { type, action, facilityId } = data;

  if (action === 'subscribe') {
    if (type === 'wait-times') {
      subscribers.waitTimes.add(ws);
      ws.subscriptions.add('wait-times');
      console.log(`📍 Client subscribed to wait-times`);
      ws.send(JSON.stringify({
        type: 'subscribed',
        channel: 'wait-times',
      }));
    } else if (type === 'mobile-units') {
      subscribers.mobileUnits.add(ws);
      ws.subscriptions.add('mobile-units');
      console.log(`📍 Client subscribed to mobile-units`);
      ws.send(JSON.stringify({
        type: 'subscribed',
        channel: 'mobile-units',
      }));
    } else if (type === 'facility' && facilityId) {
      if (!subscribers.facilities.has(facilityId)) {
        subscribers.facilities.set(facilityId, new Set());
      }
      subscribers.facilities.get(facilityId).add(ws);
      ws.subscriptions.add(`facility-${facilityId}`);
      console.log(`📍 Client subscribed to facility ${facilityId}`);
      ws.send(JSON.stringify({
        type: 'subscribed',
        channel: `facility-${facilityId}`,
      }));
    }
  } else if (action === 'unsubscribe') {
    if (type === 'wait-times') {
      subscribers.waitTimes.delete(ws);
      ws.subscriptions.delete('wait-times');
    } else if (type === 'mobile-units') {
      subscribers.mobileUnits.delete(ws);
      ws.subscriptions.delete('mobile-units');
    } else if (type === 'facility' && facilityId) {
      subscribers.facilities.get(facilityId)?.delete(ws);
      ws.subscriptions.delete(`facility-${facilityId}`);
    }
  }
}

// Broadcast schedule functions
async function broadcastWaitTimes() {
  if (subscribers.waitTimes.size === 0) return;

  try {
    const waitTimes = await db('wait_times')
      .join('facilities', 'wait_times.facility_id', 'facilities.id')
      .whereRaw(`wait_times.created_at = (
        SELECT MAX(created_at) FROM wait_times AS wt2 
        WHERE wt2.facility_id = wait_times.facility_id
      )`)
      .select('wait_times.*', 'facilities.name', 'facilities.type');

    const message = JSON.stringify({
      type: 'wait-times-update',
      timestamp: new Date().toISOString(),
      data: waitTimes,
    });

    subscribers.waitTimes.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    console.log(`📤 Broadcast wait-times to ${subscribers.waitTimes.size} clients`);
  } catch (error) {
    console.error('Error broadcasting wait times:', error.message);
  }
}

async function broadcastMobileUnitLocations() {
  if (subscribers.mobileUnits.size === 0) return;

  try {
    const mobileUnits = await db('mobile_units')
      .join('facilities', 'mobile_units.facility_id', 'facilities.id')
      .select(
        'mobile_units.id',
        'mobile_units.facility_id',
        'mobile_units.latitude',
        'mobile_units.longitude',
        'mobile_units.heading',
        'mobile_units.speed',
        'mobile_units.status',
        'facilities.name',
        'facilities.type'
      );

    const message = JSON.stringify({
      type: 'mobile-units-update',
      timestamp: new Date().toISOString(),
      data: mobileUnits,
    });

    subscribers.mobileUnits.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    console.log(`📤 Broadcast mobile unit locations to ${subscribers.mobileUnits.size} clients`);
  } catch (error) {
    console.error('Error broadcasting mobile units:', error.message);
  }
}

// Broadcast wait-times every 30 seconds
setInterval(broadcastWaitTimes, 30000);

// Broadcast mobile unit locations every 5 seconds
setInterval(broadcastMobileUnitLocations, 5000);

// Heartbeat: ping all clients every 30 seconds
setInterval(() => {
  wss.clients.forEach(ws => {
    if (!ws.isAlive) {
      ws.terminate();
      return;
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  wss.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});
