import axios from 'axios';

const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/4877616/2iuc8qv/';

async function testZapierWebhook() {
  console.log('\n=== Testing Zapier Webhook ===\n');

  // Simplified test payload
  const testData = {
    name: "Test Property",
    address: "123 Test Street",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    maxGuests: 2,
    wifiName: "TEST_WIFI",
    wifiPassword: "test123",
    doorCode: "1234"
  };

  try {
    console.log('Sending test data...');
    const response = await axios.post(ZAPIER_WEBHOOK_URL, testData, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n✓ Test successful!');
    console.log('Response:', response.data);
  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    process.exit(1);
  }
}

testZapierWebhook();