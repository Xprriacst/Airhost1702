import Airtable from 'airtable';

const base = new Airtable({
  apiKey: 'patWHbXxbcFkKGqP6.d6d71ef9ba74b567d7b19a5e66b151964edb0464db8a18e91846614f2f9e44bd'
}).base('app9QXNgVWVwSwipK');

async function populateAirtable() {
  console.log('\n=== Starting Airtable Population ===\n');
  
  try {
    console.log('Creating Properties...');
    
    const properties = [
      {
        "Name": "Sunset Villa",
        "Address": "123 Ocean Drive, Miami Beach, FL",
        "CheckIn Time": "15:00",
        "CheckOut Time": "11:00",
        "Max Guests": 6
      },
      {
        "Name": "Mountain Lodge",
        "Address": "456 Pine Road, Aspen, CO",
        "CheckIn Time": "16:00",
        "CheckOut Time": "10:00",
        "Max Guests": 4
      }
    ];

    for (const property of properties) {
      const record = await base('Properties').create(property);
      console.log(`✓ Created property: ${property.Name}`);
    }

    console.log('\n✓ All properties created successfully!');

  } catch (error) {
    console.error('\n❌ Error during population:', error);
    process.exit(1);
  }
}

populateAirtable();