import Airtable from 'airtable';

const base = new Airtable({
  apiKey: 'patWHbXxbcFkKGqP6.d6d71ef9ba74b567d7b19a5e66b151964edb0464db8a18e91846614f2f9e44bd'
}).base('app9QXNgVWVwSwipK');

async function testMakeScenario() {
  console.log('\n=== Testing Make.com Scenario with Airtable Trigger ===\n');

  try {
    console.log('Creating new property record in Airtable...');
    const record = await base('Properties').create({
      "Name": "Test Property",
      "Address": "123 Test Street",
      "CheckIn Time": "15:00",
      "CheckOut Time": "11:00",
      "Max Guests": 4
    });

    console.log('\n✓ Test record created successfully!');
    console.log('Record ID:', record.id);
    console.log('\nThis should trigger your Make.com scenario.');
    console.log('Check your Make.com scenario execution history to verify.');

  } catch (error) {
    console.error('\n❌ Error creating test record:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    process.exit(1);
  }
}

testMakeScenario();