const fetch = require('node-fetch');

async function testBackend() {
  try {
    console.log('Testing backend connection...');
    
    // Test 1: Check if server is running
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'password123'
        })
      });
      
      if (response.ok) {
        console.log('✅ Backend server is running');
      } else {
        console.log('❌ Backend server responded with error:', response.status);
      }
    } catch (error) {
      console.log('❌ Backend server is not running:', error.message);
      return;
    }
    
    // Test 2: Login and get token
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
      console.error('❌ Login failed:', loginData.message);
      return;
    }

    const token = loginData.data.token;
    console.log('✅ Login successful, token received');

    // Test 3: Get organizers
    const organizersResponse = await fetch('http://localhost:5000/api/auth/organizers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const organizersData = await organizersResponse.json();
    console.log('Organizers response:', organizersData);

    if (organizersData.success) {
      console.log('✅ Organizers loaded successfully');
      console.log('Number of organizers:', organizersData.data.organizers.length);
      organizersData.data.organizers.forEach((org, index) => {
        console.log(`Organizer ${index + 1}:`, org.name, `(${org.email}) - ID: ${org._id}`);
      });
    } else {
      console.error('❌ Failed to load organizers:', organizersData.message);
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testBackend(); 