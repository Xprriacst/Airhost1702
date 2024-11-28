import Airtable from 'airtable';

const AIRTABLE_API_KEY = 'patFZaDQauFzjdNpZ.5c8bcedd441cc509a7fe094ad0569bb11ebd0345d34310540441429b7e20ea01';
const AIRTABLE_BASE_ID = 'appOuR5fZOnAGiS3b';

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

async function createTable(tableName: string, records: any[]) {
  console.log(`Creating records in ${tableName}...`);
  try {
    const createdRecords = await base(tableName).create(records);
    console.log(`✓ Created ${createdRecords.length} records in ${tableName}`);
    return createdRecords;
  } catch (error) {
    console.error(`Error creating records in ${tableName}:`, error);
    throw error;
  }
}

async function populateAirtable() {
  try {
    console.log('Starting database population...');

    // Properties
    const properties = await createTable('Properties', [
      {
        fields: {
          "Name": "Studio Blois",
          "Address": "13 rue des Papegaults, Blois",
          "WiFi Name": "FREEBOX-AE4AC6",
          "WiFi Password": "barbani@%-solvi38-irrogatura-cannetum?&",
          "Door Code": "210",
          "House Rules": ["Max 4 people", "No extra visitors", "Respect noise levels"],
          "Amenities": ["TV", "Kitchen", "Heating"],
          "Check-in Time": "15:00",
          "Check-out Time": "11:00",
          "Max Guests": 4,
          "Description": "Bienvenue dans notre charmant studio en plein cœur de Blois...",
          "Parking Info": "Parking gratuit : Parking du Mail (5 minutes à pied)...",
          "Restaurants": ["Brute Maison de Cuisine", "Le Diffa", "Bro's Restaurant"],
          "Fast Food": ["Frenchy's", "Le Berliner", "Osaka"],
          "Emergency Contacts": ["+33 6 17 37 04 84", "+33 6 20 16 93 17"]
        }
      }
    ]);

    // AI Configuration
    await createTable('AI Configuration', [
      {
        fields: {
          "Name": "Ton amical",
          "Type": "Style",
          "Content": "Soyez toujours chaleureux et accueillant. Utilisez un langage simple et direct. Évitez le jargon technique.",
          "Category": "Global",
          "Language": "French",
          "Active": true,
          "Priority": 1
        }
      },
      {
        fields: {
          "Name": "Réponse WiFi",
          "Type": "Template",
          "Content": "Voici les informations WiFi :\nRéseau : {wifi_name}\nMot de passe : {wifi_password}\n\nN'hésitez pas si vous avez besoin d'aide !",
          "Category": "Technical",
          "Language": "French",
          "Active": true,
          "Priority": 2
        }
      }
    ]);

    // Response Templates
    await createTable('Response Templates', [
      {
        fields: {
          "Name": "Check-in Instructions",
          "Property": [properties[0].id],
          "Trigger": "comment accéder au logement",
          "Response": "Voici les instructions d'accès :\n1. La boîte à clés est située à droite de l'entrée\n2. Utilisez le code {door_code}\n3. Appuyez sur le bouton noir pour déverrouiller\n4. Utilisez la clé ronde pour la porte principale\n5. Montez l'escalier, première porte à droite\n\nN'hésitez pas si vous avez besoin d'aide !",
          "Category": "Check-in",
          "Variables": ["door_code"]
        }
      }
    ]);

    console.log('✓ Database populated successfully!');
  } catch (error) {
    console.error('Error during population:', error);
    process.exit(1);
  }
}

populateAirtable();