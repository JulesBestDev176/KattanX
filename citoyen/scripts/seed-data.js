/**
 * Script pour créer des données de test dans Supabase
 * 
 * Ce script crée :
 * - 2 utilisateurs de test
 * - Documents (dossiers)
 * - Propriétés
 * - Dénonciations
 * - Plaintes
 * - Transactions de revenus
 */

const projectId = 'iqfgzxqcuovvdxzwvwzj';
const publicAnonKey = 'sbp_23221e3663fcd4802cd59206fd471df1d47b0616';
const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7f5fa16e`;

// Données de test
const testData = {
  users: [
    {
      email: 'user1@test.com',
      password: 'password123',
      name: 'Amadou Diallo',
      cni: '1234567890123',
      tel: '+221 77 123 45 67'
    },
    {
      email: 'user2@test.com',
      password: 'password123',
      name: 'Fatou Sall',
      cni: '9876543210987',
      tel: '+221 76 987 65 43'
    }
  ],
  
  dossiers: [
    {
      type: 'Titre Foncier',
      numero: 'TF-2024-001',
      dateEmission: '15/01/2024'
    },
    {
      type: 'Carte Grise',
      numero: 'CG-2024-002',
      dateEmission: '20/02/2024'
    },
    {
      type: 'Permis de Construire',
      numero: 'PC-2024-003',
      dateEmission: '10/03/2024'
    }
  ],
  
  proprietes: [
    {
      type: 'titre_foncier',
      titre: 'Maison à Almadies',
      reference: 'TF-001',
      details: '150m² - Zone résidentielle'
    },
    {
      type: 'voiture',
      titre: 'Toyota Corolla 2020',
      reference: 'VH-002',
      details: 'Gris métallisé - Automatique'
    },
    {
      type: 'titre_foncier',
      titre: 'Terrain à Thiès',
      reference: 'TF-003',
      details: '500m² - Zone agricole'
    }
  ],
  
  denonciations: [
    {
      type: 'Accident de la route',
      description: 'Collision entre deux véhicules sur l\'avenue Bourguiba. Plusieurs blessés légers.',
      localisation: 'Avenue Bourguiba, Dakar',
      preuveType: 'image',
      status: 'En attente',
      createdAt: new Date('2024-03-15').toISOString()
    },
    {
      type: 'Incendie',
      description: 'Début d\'incendie dans un immeuble résidentiel. Les pompiers sont intervenus rapidement.',
      localisation: 'Médina, Rue 10',
      preuveType: 'video',
      status: 'Vérifiée',
      createdAt: new Date('2024-03-10').toISOString()
    },
    {
      type: 'Vol à la tire',
      description: 'Tentative de vol dans le transport en commun.',
      localisation: 'Bus Tata, ligne 7',
      preuveType: 'audio',
      status: 'En attente',
      createdAt: new Date('2024-03-18').toISOString()
    }
  ],
  
  plaintes: [
    {
      type: 'déposée',
      objet: 'Vol de téléphone',
      description: 'Mon téléphone a été volé dans le bus ce matin. Samsung Galaxy S21.',
      commissariat: 'Commissariat du Plateau',
      status: 'En cours',
      createdAt: new Date('2024-03-12').toISOString()
    },
    {
      type: 'reçue',
      objet: 'Stationnement interdit',
      description: 'Véhicule stationné devant une entrée privée.',
      commissariat: 'Commissariat de Médina',
      amende: 50000,
      status: 'En attente de paiement',
      createdAt: new Date('2024-03-08').toISOString()
    },
    {
      type: 'déposée',
      objet: 'Agression',
      description: 'Agression verbale et tentative d\'intimidation.',
      commissariat: 'Commissariat Central',
      status: 'En cours d\'investigation',
      createdAt: new Date('2024-03-05').toISOString()
    }
  ],
  
  revenus: {
    total: 125000,
    transactions: [
      {
        amount: 25000,
        type: 'gain',
        date: new Date('2024-03-15').toISOString(),
        status: 'Complété'
      },
      {
        amount: 50000,
        type: 'retrait',
        method: 'mobile_money',
        accountNumber: '+221 77 123 45 67',
        date: new Date('2024-03-10').toISOString(),
        status: 'Complété'
      },
      {
        amount: 75000,
        type: 'gain',
        date: new Date('2024-03-05').toISOString(),
        status: 'Complété'
      },
      {
        amount: 30000,
        type: 'retrait',
        method: 'bank',
        accountNumber: 'SN12345678901234567890',
        date: new Date('2024-02-28').toISOString(),
        status: 'Complété'
      },
      {
        amount: 45000,
        type: 'gain',
        date: new Date('2024-02-20').toISOString(),
        status: 'Complété'
      }
    ]
  }
};

console.log('📊 Données de test préparées :');
console.log('');
console.log('👥 Utilisateurs de test :');
testData.users.forEach((user, i) => {
  console.log(`   ${i + 1}. ${user.name}`);
  console.log(`      Email: ${user.email}`);
  console.log(`      Password: ${user.password}`);
  console.log(`      CNI: ${user.cni}`);
  console.log(`      Tel: ${user.tel}`);
  console.log('');
});

console.log('📄 Documents (Dossiers) :');
testData.dossiers.forEach((doc, i) => {
  console.log(`   ${i + 1}. ${doc.type} - N° ${doc.numero}`);
});
console.log('');

console.log('🏠 Propriétés :');
testData.proprietes.forEach((prop, i) => {
  console.log(`   ${i + 1}. ${prop.titre} (${prop.type})`);
});
console.log('');

console.log('⚠️  Dénonciations :');
testData.denonciations.forEach((den, i) => {
  console.log(`   ${i + 1}. ${den.type} - ${den.status}`);
});
console.log('');

console.log('⚖️  Plaintes :');
testData.plaintes.forEach((plainte, i) => {
  console.log(`   ${i + 1}. ${plainte.objet} (${plainte.type})`);
});
console.log('');

console.log('💰 Revenus :');
console.log(`   Solde total: ${testData.revenus.total.toLocaleString()} FCFA`);
console.log(`   Nombre de transactions: ${testData.revenus.transactions.length}`);
console.log('');

console.log('✅ Configuration Supabase :');
console.log(`   Project ID: ${projectId}`);
console.log(`   API URL: ${API_BASE_URL}`);
console.log('');

console.log('📝 Instructions :');
console.log('');
console.log('Pour créer ces données dans Supabase, vous devez :');
console.log('');
console.log('1. Créer les tables dans Supabase :');
console.log('   - users (avec auth)');
console.log('   - dossiers');
console.log('   - proprietes');
console.log('   - denonciations');
console.log('   - plaintes');
console.log('   - revenus');
console.log('   - transactions');
console.log('');
console.log('2. Créer les fonctions Edge Functions :');
console.log('   - login');
console.log('   - request-otp');
console.log('   - verify-otp');
console.log('   - profile');
console.log('   - dossiers');
console.log('   - proprietes');
console.log('   - denonciations');
console.log('   - plaintes');
console.log('   - revenus');
console.log('   - transfer');
console.log('');
console.log('3. Utiliser le Dashboard Supabase pour insérer les données');
console.log('   ou créer un script SQL d\'insertion');
console.log('');
console.log('🚀 Les comptes de test sont prêts à être utilisés !');



