import axios from 'axios';

const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/0xd6mgmuyiwrcmd8dgop4lv08ui1zjcc';

async function testHttpModule() {
  console.log('\n=== Testing Make.com HTTP Module ===\n');

  const testData = {
    action: "fetch",
    source: "airtable",
    data: {
      records: [{
        Name: "Test Property",
        Address: "123 Test Street",
        "CheckIn Time": "15:00",
        "CheckOut Time": "11:00",
        "Max Guests": 4
      }]
    }
  };

  try {
    console.log('Sending test request...');
    console.log('Payload:', JSON.stringify(testData, null, 2));

    const response = await axios.post(MAKE_WEBHOOK_URL, testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('\n✓ Request successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.error('\n❌ Request failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testHttpModule();