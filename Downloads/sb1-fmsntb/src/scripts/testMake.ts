import axios from 'axios';

const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/0xd6mgmuyiwrcmd8dgop4lv08ui1zjcc';

async function testWebhookTrigger() {
  console.log('\n=== Testing Make.com Webhook Trigger ===\n');

  const testCases = [
    {
      name: 'List Properties',
      payload: {
        action: 'list',
        source: 'airtable',
        table: 'Properties'
      }
    },
    {
      name: 'Create Property',
      payload: {
        action: 'create',
        source: 'airtable',
        table: 'Properties',
        data: {
          fields: {
            Name: "Test Villa",
            Address: "123 Test Street",
            "CheckIn Time": "15:00",
            "CheckOut Time": "11:00",
            "Max Guests": 4
          }
        }
      }
    }
  ];

  for (const test of testCases) {
    try {
      console.log(`\nTesting: ${test.name}...`);
      const response = await axios.post(MAKE_WEBHOOK_URL, test.payload, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`✓ ${test.name} successful!`);
      console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error: any) {
      console.error(`\n❌ ${test.name} failed:`, error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
    }
  }
}

testWebhookTrigger();