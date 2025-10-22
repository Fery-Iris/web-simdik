const BASE_URL = 'http://localhost:3000'

async function testFridayReservation() {
  console.log('🧪 Testing Friday Reservation...\n')

  try {
    // Test Friday time slots
    console.log('1. 📅 Testing Friday time slots (2025-01-31):')
    const timeSlotsResponse = await fetch(`${BASE_URL}/api/time-slots?date=2025-01-31`)
    const timeSlotsResult = await timeSlotsResponse.json()
    
    if (timeSlotsResult.success) {
      console.log(`   ✅ Found ${timeSlotsResult.data.length} slots:`)
      timeSlotsResult.data.forEach(slot => {
        console.log(`      - ${slot.time} (${slot.booked}/${slot.capacity} booked)`)
      })
    } else {
      console.log(`   ❌ Error: ${timeSlotsResult.error}`)
    }

    // Test Friday reservation
    console.log('\n2. 📝 Testing Friday reservation:')
    const reservationData = {
      service: 'ptk',
      date: '2025-01-31',
      timeSlot: '09:00',
      name: 'Test Friday User',
      phone: '081234567890',
      nik: '1234567890123456',
      purpose: 'Test Friday reservation'
    }

    const reservationResponse = await fetch(`${BASE_URL}/api/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData)
    })

    const reservationResult = await reservationResponse.json()
    
    if (reservationResult.success) {
      console.log(`   ✅ Reservation created successfully:`)
      console.log(`      - Queue: ${reservationResult.data.queueNumber}`)
      console.log(`      - Service: ${reservationResult.data.service}`)
      console.log(`      - Date: ${reservationResult.data.date}`)
      console.log(`      - Time: ${reservationResult.data.timeSlot}`)
      console.log(`      - Name: ${reservationResult.data.name}`)
    } else {
      console.log(`   ❌ Error: ${reservationResult.error}`)
    }

    // Test weekend (Saturday)
    console.log('\n3. 📅 Testing Saturday (should be no service):')
    const saturdayResponse = await fetch(`${BASE_URL}/api/time-slots?date=2025-02-01`)
    const saturdayResult = await saturdayResponse.json()
    
    if (saturdayResult.success) {
      if (saturdayResult.data.length === 0) {
        console.log(`   ✅ No service on Saturday: ${saturdayResult.message}`)
      } else {
        console.log(`   ❌ Unexpected slots found: ${saturdayResult.data.length}`)
      }
    } else {
      console.log(`   ❌ Error: ${saturdayResult.error}`)
    }

    console.log('\n🎉 Friday reservation test completed!')

  } catch (error) {
    console.error('❌ Test failed with error:', error.message)
  }
}

// Run the test
testFridayReservation()
