/**
 * Script de reset admin — exécuter une seule fois :
 * node resetAdmin.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function reset() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connecté');

  const email = process.env.ADMIN_EMAIL || 'admin@eventfire.fr';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  // Supprimer l'ancien admin
  const del = await mongoose.connection.db.collection('users').deleteOne({ email });
  console.log(`Ancien admin supprimé : ${del.deletedCount} document(s)`);

  // Créer directement avec le hash (sans passer par Mongoose model)
  const hash = await bcrypt.hash(password, 12);
  await mongoose.connection.db.collection('users').insertOne({
    email,
    password: hash,
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  console.log(`Nouvel admin créé : ${email} / ${password}`);
  console.log(`Hash généré : ${hash.substring(0, 20)}...`);

  // Vérification
  const user = await mongoose.connection.db.collection('users').findOne({ email });
  const ok = await bcrypt.compare(password, user.password);
  console.log(`Vérification bcrypt : ${ok ? '✅ OK' : '❌ ECHEC'}`);

  await mongoose.disconnect();
  console.log('Terminé.');
}

reset().catch(console.error);
