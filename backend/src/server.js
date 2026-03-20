require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const app = require('./app');
const connectDB = require('./config/db');
const seedAdmin = require('./utils/seedAdmin');

const PORT = process.env.PORT || 2004;

connectDB().then(() => {
  seedAdmin(); // seed admin + events after DB connect
  app.listen(PORT, () => {
    console.log(`Serveur lance sur http://localhost:${PORT}`);
  });
});
