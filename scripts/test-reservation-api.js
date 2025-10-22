// Test script for reservation API endpoints
const BASE_URL = 'http://localhost:3000'

async function testReservationAPI() {
  console.log('🧪 Testing Reservation API...\n')

  try {
    // Test 1: Create a new reservation
    console.log('1. Testing POST /api/reservations')
    const reservationData = {
      service: 'ptk',
      date: '2025-01-20',
      timeSlot: '09:00',
      name: 'Test User',
      phone: '081234567890',
      nik: '1234567890123456',
      purpose: 'Test reservation purpose'
    }

    const createResponse = await fetch(`${BASE_URL}/api/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData)
    })

    if (createResponse.ok) {
      const createResult = await createResponse.json()
      console.log('✅ Reservation created successfully')
      console.log('Queue Number:', createResult.data.queueNumber)
      console.log('Estimated Time:', createResult.data.estimatedCallTime)
    } else {
      console.log('❌ Failed to create reservation')
      const error = await createResponse.text()
      console.log('Error:', error)
    }

    // Test 2: Get all reservations
    console.log('\n2. Testing GET /api/reservations')
    const getResponse = await fetch(`${BASE_URL}/api/reservations`)
    
    if (getResponse.ok) {
      const getResult = await getResponse.json()
      console.log('✅ Retrieved reservations successfully')
      console.log('Total reservations:', getResult.data.length)
    } else {
      console.log('❌ Failed to get reservations')
    }

    // Test 3: Get time slots for a specific date
    console.log('\n3. Testing GET /api/time-slots')
    const timeSlotsResponse = await fetch(`${BASE_URL}/api/time-slots?date=2025-01-20`)
    
    if (timeSlotsResponse.ok) {
      const timeSlotsResult = await timeSlotsResponse.json()
      console.log('✅ Retrieved time slots successfully')
      console.log('Available slots:', timeSlotsResult.data.length)
    } else {
      console.log('❌ Failed to get time slots')
    }

    // Test 4: Get queue status
    console.log('\n4. Testing GET /api/queue/status')
    const queueResponse = await fetch(`${BASE_URL}/api/queue/status`)
    
    if (queueResponse.ok) {
      const queueResult = await queueResponse.json()
      console.log('✅ Retrieved queue status successfully')
      console.log('Service queues:', queueResult.data.serviceQueues.length)
    } else {
      console.log('❌ Failed to get queue status')
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message)
  }
}

// Run the test
testReservationAPI()
