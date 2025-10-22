// Test script to verify API endpoints work correctly
const BASE_URL = 'http://localhost:3000'

async function testAPI() {
  console.log('🧪 Testing API Endpoints...\n')

  try {
    // Test 1: Create reservation with exact data from frontend
    console.log('1. Testing POST /api/reservations with frontend data')
    const reservationData = {
      service: 'ptk',
      date: '2025-01-23',
      timeSlot: '09:00',
      name: 'Defiant Shark',
      phone: '081234567890',
      nik: '7649823932911',
      purpose: 'Kenaikan Gajih'
    }

    console.log('Sending data:', reservationData)

    const createResponse = await fetch(`${BASE_URL}/api/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData)
    })

    console.log('Response status:', createResponse.status)
    console.log('Response ok:', createResponse.ok)

    if (createResponse.ok) {
      const createResult = await createResponse.json()
      console.log('✅ Reservation created successfully')
      console.log('Response:', JSON.stringify(createResult, null, 2))
    } else {
      const errorText = await createResponse.text()
      console.log('❌ Failed to create reservation')
      console.log('Error response:', errorText)
    }

    // Test 2: Get time slots for the same date
    console.log('\n2. Testing GET /api/time-slots')
    const timeSlotsResponse = await fetch(`${BASE_URL}/api/time-slots?date=2025-01-23`)
    
    if (timeSlotsResponse.ok) {
      const timeSlotsResult = await timeSlotsResponse.json()
      console.log('✅ Retrieved time slots successfully')
      console.log('Time slots:', JSON.stringify(timeSlotsResult, null, 2))
    } else {
      console.log('❌ Failed to get time slots')
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message)
  }
}

// Run the test
testAPI()
