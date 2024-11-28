import Airtable from 'airtable';

const base = new Airtable({
  apiKey: 'patWHbXxbcFkKGqP6.d6d71ef9ba74b567d7b19a5e66b151964edb0464db8a18e91846614f2f9e44bd'
}).base('app9QXNgVWVwSwipK');

async function testAirtableFields() {
  console.log('\n=== Testing Airtable Fields ===\n');

  try {
    // Fetch one record to examine its fields
    const records = await base('Properties').select({
      maxRecords: 1,
      view: "Grid view"
    }).firstPage();

    if (records.length > 0) {
      const record = records[0];
      console.log('Record fields:');
      console.log(JSON.stringify(record._rawJson, null, 2));
      
      // Check for system fields
      console.log('\nSystem Fields:');
      console.log('Created Time:', record._rawJson.createdTime);
      console.log('ID:', record.id);
    } else {
      console.log('No records found. Creating a test record...');
      
      const newRecord = await base('Properties').create({
        "Name": "Test Property",
        "Address": "123 Test St",
        "CheckIn Time": "15:00",
        "CheckOut Time": "11:00",
        "Max Guests": 2
      });

      console.log('\nNew record created:');
      console.log('Created Time:', newRecord._rawJson.createdTime);
      console.log('ID:', newRecord.id);
    }

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

testAirtableFields();