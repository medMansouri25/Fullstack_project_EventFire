/**
 * Seed des événements — script standalone
 *
 * Usage :
 *   node src/utils/seedEvents.js          → insère si collection vide
 *   node src/utils/seedEvents.js --reset  → supprime tout et réinsère
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Event = require('../models/Event');
const { sampleEvents } = require('./seedAdmin');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connecté');

  if (process.argv.includes('--reset')) {
    await Event.deleteMany({});
    console.log('🗑️  Tous les événements supprimés.');
  }

  const count = await Event.countDocuments();
  if (count === 0) {
    await Event.insertMany(sampleEvents);
    console.log(`✅ ${sampleEvents.length} événements insérés.`);
  } else {
    console.log(`ℹ️  ${count} événements déjà présents. Lance avec --reset pour forcer.`);
  }

  await mongoose.disconnect();
}

run().catch(err => { console.error('❌', err.message); process.exit(1); });
