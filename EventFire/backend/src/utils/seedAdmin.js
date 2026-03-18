const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Event = require('../models/Event');

const sampleEvents = [
  {
    titre: 'Symphonie No. 9 de Beethoven',
    description: "L'Orchestre Philharmonique de Paris vous invite à vivre une soirée hors du commun autour du chef-d'œuvre de Beethoven. La Symphonie No. 9 en ré mineur, opus 125, est l'une des œuvres les plus célébrées de l'histoire de la musique classique. Ce concert exceptionnel réunit l'orchestre au grand complet avec un chœur de 120 voix et quatre solistes de renommée internationale pour interpréter l'immortelle Ode à la Joie. Une expérience musicale unique qui résonne bien au-delà de la salle de concert.",
    categorie: 'Musical',
    type: 'Symphonie',
    date: '2026-04-15',
    heure: '20:00',
    ville: 'Paris',
    lieu: 'Salle Pleyel',
    organisateur: 'Orchestre Philharmonique de Paris',
    prix: 85,
    capacite: 1200,
    billetsVendus: 950,
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=800&q=80'
  },
  {
    titre: 'Rock en Seine Festival',
    description: "Le festival de rock incontournable de l'été parisien revient pour une nouvelle édition explosive au Domaine National de Saint-Cloud. Trois jours et trois nuits de concerts avec des têtes d'affiche internationales, des artistes émergents de la scène française et des performances live mémorables. Plus de 80 artistes se succèdent sur 5 scènes. Restauration, animations et camping sur place pour une expérience festival totale dans un cadre naturel exceptionnel.",
    categorie: 'Musical',
    type: 'Festival',
    date: '2026-08-20',
    heure: '14:00',
    ville: 'Saint-Cloud',
    lieu: 'Domaine National de Saint-Cloud',
    organisateur: 'Rock en Seine Productions',
    prix: 89,
    capacite: 15000,
    billetsVendus: 12500,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80'
  },
  {
    titre: 'La Traviata — Opéra de Verdi',
    description: "L'Opéra National de Paris présente une mise en scène moderne et saisissante de La Traviata de Giuseppe Verdi. La soprano internationale Sofia Marchetti incarne une Violetta bouleversante dans ce drame lyrique sur fond d'amour impossible et de sacrifice. Le ténor Lorenzo Conti lui donne la réplique dans le rôle d'Alfredo. Décors somptueux, costumes d'époque et direction musicale de l'Orchestre de l'Opéra assurent une production de niveau mondial. Un des opéras les plus populaires du répertoire dans une version à couper le souffle.",
    categorie: 'Musical',
    type: 'Opéra',
    date: '2026-05-22',
    heure: '19:30',
    ville: 'Paris',
    lieu: 'Opéra Bastille',
    organisateur: 'Opéra National de Paris',
    prix: 75,
    capacite: 2700,
    billetsVendus: 2100,
    image: 'https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&w=800&q=80'
  },
  {
    titre: 'Hamlet de Shakespeare',
    description: "La Comédie-Française propose une interprétation audacieuse et contemporaine du chef-d'œuvre absolu de William Shakespeare. Hamlet, prince du Danemark, découvre que son père a été assassiné par son propre oncle, désormais roi. Rongé par le doute, la vengeance et la folie simulée, il va plonger dans un tourbillon de trahisons et de morts tragiques. La mise en scène de Stéphane Braunschweig confronte la tradition classique et la modernité théâtrale dans une production visuellement époustouflante avec l'ensemble de la troupe de la Comédie-Française.",
    categorie: 'Culturel',
    type: 'Théâtre',
    date: '2026-04-10',
    heure: '20:30',
    ville: 'Paris',
    lieu: 'Comédie-Française',
    organisateur: 'Comédie-Française',
    prix: 38,
    capacite: 862,
    billetsVendus: 720,
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=800&q=80'
  },
  {
    titre: 'Soirée Jazz — Quartet Julien Morel',
    description: "Une nuit de jazz intimiste et chaleureuse avec le quartet du pianiste Julien Morel au légendaire New Morning. Au programme : standards du jazz manouche dans l'esprit de Django Reinhardt, bebop inspiré de Miles Davis et compositions originales inédites. Julien Morel est accompagné de Léa Fontaine au violon, Thomas Renard à la contrebasse et Marc Deschamps à la batterie. Chaque concert est une improvisation unique, une conversation musicale spontanée qui ne se reproduira jamais à l'identique. Venez vivre la magie du jazz vivant.",
    categorie: 'Musical',
    type: 'Concert',
    date: '2026-03-28',
    heure: '21:00',
    ville: 'Paris',
    lieu: 'New Morning',
    organisateur: 'Jazz Productions Paris',
    prix: 25,
    capacite: 150,
    billetsVendus: 145,
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=800&q=80'
  },
  {
    titre: 'Ballet Casse-Noisette',
    description: "Le Ballet de l'Opéra de Bordeaux vous invite à redécouvrir le conte féerique de Tchaïkovski dans une version entièrement réinventée par la chorégraphe Marie Leconte. Le soir de Noël, la petite Clara reçoit en cadeau un Casse-Noisette qui prend vie durant la nuit et l'emmène dans un voyage magique au Pays des Sucreries. Les décors somptueux signés par le scénographe Jean-Pierre Caillat, les costumes éblouissants et la musique envoûtante de Tchaïkovski transportent le public de tous âges dans un univers de magie, de grâce et de merveilles.",
    categorie: 'Musical',
    type: 'Ballet',
    date: '2026-06-14',
    heure: '19:00',
    ville: 'Bordeaux',
    lieu: 'Grand Théâtre de Bordeaux',
    organisateur: "Ballet de l'Opéra de Bordeaux",
    prix: 70,
    capacite: 1100,
    billetsVendus: 935,
    image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=800&q=80'
  },
  {
    titre: 'Impressionnistes : Lumières de France',
    description: "Le Musée d'Orsay présente une rétrospective exceptionnelle et inédite consacrée aux maîtres de l'impressionnisme français. Plus de 180 œuvres de Claude Monet, Pierre-Auguste Renoir, Edgar Degas, Camille Pissarro et Alfred Sisley sont rassemblées pour la première fois sous un même toit. L'exposition retrace l'évolution de ce mouvement révolutionnaire né en 1874 qui a bouleversé les codes de la peinture occidentale. Audioguide inclus. Visites guidées thématiques disponibles le week-end. Exposition accessible aux personnes à mobilité réduite.",
    categorie: 'Culturel',
    type: 'Exposition',
    date: '2026-04-01',
    heure: '10:00',
    ville: 'Paris',
    lieu: "Musée d'Orsay",
    organisateur: "Musée d'Orsay",
    prix: 22,
    capacite: 800,
    billetsVendus: 760,
    image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80'
  },
  {
    titre: 'Festival Baroque de Versailles',
    description: "Les jardins et les salons dorés du Château de Versailles accueillent le Festival International de Musique Baroque, mettant à l'honneur les compositeurs de la cour du Roi-Soleil. Haendel, Lully, Rameau et Couperin résonnent à nouveau dans les mêmes lieux où leurs œuvres furent créées il y a plus de trois siècles. Concerts dans la Galerie des Glaces, la Chapelle Royale et les jardins illuminés. Chaque soirée se conclut par un feu d'artifice musical sur le Grand Canal. Une plongée unique dans le faste de la cour de Louis XIV.",
    categorie: 'Musical',
    type: 'Festival',
    date: '2026-07-04',
    heure: '18:00',
    ville: 'Versailles',
    lieu: 'Château de Versailles',
    organisateur: 'Centre de Musique Baroque de Versailles',
    prix: 120,
    capacite: 2000,
    billetsVendus: 1820,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80'
  },
  {
    titre: 'Cyrano de Bergerac',
    description: "La pièce culte d'Edmond Rostand reprend vie sur la grande scène du Théâtre du Châtelet dans une production spectaculaire saluée par la critique. Le comédien Antoine Dupuis incarne un Cyrano époustouflant — poète flamboyant, duelliste invincible et amoureux transi de sa cousine Roxane. Des duels d'escrime en direct, des décors monumentaux sur trois niveaux, des costumes d'époque et plus de 40 comédiens sur scène composent un spectacle total d'une intensité rare. Ce monument du théâtre classique français vous donnera des frissons à chaque réplique.",
    categorie: 'Culturel',
    type: 'Théâtre',
    date: '2026-06-20',
    heure: '20:00',
    ville: 'Paris',
    lieu: 'Théâtre du Châtelet',
    organisateur: 'Théâtre du Châtelet Productions',
    prix: 55,
    capacite: 2500,
    billetsVendus: 2050,
    image: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?auto=format&fit=crop&w=800&q=80'
  },
  {
    titre: 'Nuit Électronique — Sons du Futur',
    description: "Le Stade de France se transforme pour une nuit en la plus grande scène électronique jamais vue en France. Cinq des plus grands DJ de la planète se succèdent dans une nuit qui repousse toutes les limites de l'expérience musicale live. Scène principale de 60 mètres de large, écrans LED 4K sur 360°, lasers et effets pyrotechniques de dernière génération, système son d-b audiotechnik de 400 000 watts. Line-up dévoilé progressivement sur les réseaux sociaux. Navettes gratuites depuis Saint-Denis–Porte de Paris. Vestiaire et consignes sur place.",
    categorie: 'Musical',
    type: 'Concert',
    date: '2026-08-01',
    heure: '22:00',
    ville: 'Saint-Denis',
    lieu: 'Stade de France',
    organisateur: 'ElectroFrance Events',
    prix: 95,
    capacite: 12000,
    billetsVendus: 10560,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'
  }
];

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@eventfire.fr';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Recréer l'admin avec bcrypt direct (bypass mongoose hook pour éviter tout problème)
    await User.deleteOne({ email: adminEmail });
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await User.collection.insertOne({
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`✅ Admin créé : ${adminEmail} / ${adminPassword}`);

    // Toujours re-seeder les événements pour avoir des photos à jour
    await Event.deleteMany({});
    await Event.insertMany(sampleEvents);
    console.log(`✅ ${sampleEvents.length} événements insérés avec photos.`);

  } catch (error) {
    console.error('Erreur lors du seeding :', error.message);
  }
};

module.exports = seedAdmin;
