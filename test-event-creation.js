const fetch = require('node-fetch');

async function testEventCreation() {
  try {
    // First, login to get a token
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'password123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (!loginData.success) {
      console.error('Login failed:', loginData.message);
      return;
    }

    const token = loginData.data.token;

    // Test event creation
    const eventData = {
      title: 'Test Event',
      description: 'This is a test event description that is long enough',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      endTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(), // Tomorrow + 1 hour
      location: 'Test Location',
      capacity: 10,
      organizerId: '507f1f77bcf86cd799439011' // This might be the issue - need a real organizer ID
    };

    console.log('Sending event data:', eventData);

    const createResponse = await fetch('http://localhost:5000/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });

    const createData = await createResponse.json();
    console.log('Create event response:', createData);

    if (!createData.success) {
      console.error('Event creation failed:', createData.message);
      if (createData.errors) {
        console.error('Validation errors:', createData.errors);
      }
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testEventCreation(); 