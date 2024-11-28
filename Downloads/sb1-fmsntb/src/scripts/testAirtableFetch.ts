import axios from 'axios';

const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/0xd6mgmuyiwrcmd8dgop4lv08ui1zjcc';

async function testAirtableFetch() {
  console.log('\n=== Testing Airtable Fetch via Make.com ===\n');

  try {
    // Test fetching all properties
    console.log('Fetching properties from Airtable...');
    const response = await axios.post(MAKE_WEBHOOK_URL, {
      action: 'fetch',
      source: 'airtable',
      table: 'Properties'
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('\n✓ Properties fetched successfully!');
    console.log('\nProperties:');
    console.log(JSON.stringify(response.data, null, 2));

    // Test webhook response format
    if (response.data.success) {
      console.log('\n✓ Response format is correct');
      console.log(`Found ${response.data.properties.length} properties`);
      
      response.data.properties.forEach((property: any) => {
        console.log(`\nProperty: ${property.Name}`);
        console.log(`Address: ${property.Address}`);
        console.log(`Check-in: ${property['CheckIn Time']}`);
        console.log(`Check-out: ${property['CheckOut Time']}`);
        console.log(`Max Guests: ${property['Max Guests']}`);
        console.log('---');
      });
    } else {
      console.error('\n❌ Invalid response format');
      console.error('Expected "success" field in response');
    }

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    process.exit(1);
  }
}

testAirtableFetch();