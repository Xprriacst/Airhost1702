import Airtable from 'airtable';

// Configuration avec vos identifiants spécifiques
const base = new Airtable({
  apiKey: 'patWHbXxbcFkKGqP6.d6d71ef9ba74b567d7b19a5e66b151964edb0464db8a18e91846614f2f9e44bd'
}).base('app9QXNgVWVwSwipK');

async function testAirtableConnection() {
  console.log('\n=== Test de connexion Airtable ===\n');

  try {
    console.log('Tentative de lecture de la table Properties...');
    
    const records = await base('Properties').select({
      view: 'Grid view'
    }).all();

    console.log(`\n✓ Connexion réussie! ${records.length} propriétés trouvées.\n`);
    
    records.forEach((record, index) => {
      console.log(`Propriété ${index + 1}:`);
      console.log('-----------------');
      console.log('ID:', record.id);
      console.log('Nom:', record.get('Name'));
      console.log('Adresse:', record.get('Address'));
      console.log('Check-in:', record.get('CheckIn Time'));
      console.log('Check-out:', record.get('CheckOut Time'));
      console.log('Max Guests:', record.get('Max Guests'));
      console.log('-----------------\n');
    });

  } catch (error) {
    console.error('\n❌ Erreur de connexion:', error);
    process.exit(1);
  }
}

testAirtableConnection();