import Airtable from 'airtable';

const base = new Airtable({
  apiKey: 'patWHbXxbcFkKGqP6.d6d71ef9ba74b567d7b19a5e66b151964edb0464db8a18e91846614f2f9e44bd'
}).base('app9QXNgVWVwSwipK');

async function testConnection() {
  console.log('\n=== Testing Airtable Connection ===\n');
  
  try {
    console.log('Creating test record...');
    const newRecord = await base('Properties').create({
      "Name": "Test Property",
      "Address": "123 Test Street",
      "CheckIn Time": "15:00",
      "CheckOut Time": "11:00",
      "Max Guests": 2
    });
    
    console.log('✓ Test record created with ID:', newRecord.id);
    console.log('\n✓ Connection test successful!');
  } catch (error) {
    console.error('\n❌ Connection test failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

testConnection();