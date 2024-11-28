import Airtable from 'airtable';

const base = new Airtable({
  apiKey: 'patWHbXxbcFkKGqP6.d6d71ef9ba74b567d7b19a5e66b151964edb0464db8a18e91846614f2f9e44bd'
}).base('app9QXNgVWVwSwipK');

async function createTriggerTest() {
  console.log('\n=== Creating Test Record to Trigger Make.com Scenario ===\n');

  try {
    console.log('Creating new property record...');
    const record = await base('Properties').create({
      "Name": "Trigger Test Property",
      "Address": "456 Trigger Street",
      "CheckIn Time": "14:00",
      "CheckOut Time": "12:00",
      "Max Guests": 3
    });

    console.log('\n✓ Test record created successfully!');
    console.log('Record ID:', record.id);
    console.log('This should trigger your Make.com scenario.');
    console.log('\nCheck your Make.com scenario execution history to see the result.');

  } catch (error) {
    console.error('\n❌ Error creating trigger test record:', error);
    process.exit(1);
  }
}

createTriggerTest();