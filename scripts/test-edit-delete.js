const BASE_URL = 'http://localhost:3000'

async function testEditAndDelete() {
  console.log('🧪 Testing Edit and Delete Functionality...\n')

  try {
    // 1. Get all reservations first
    console.log('1. 📋 Getting all reservations...')
    const getResponse = await fetch(`${BASE_URL}/api/reservations`)
    const getData = await getResponse.json()
    
    if (!getData.success || !getData.data.length) {
      console.log('❌ No reservations found to test with')
      return
    }

    const testReservation = getData.data[0]
    console.log(`✅ Found reservation: ${testReservation.queueNumber} - ${testReservation.name}`)

    // 2. Test GET single reservation
    console.log('\n2. 🔍 Testing GET single reservation...')
    const singleGetResponse = await fetch(`${BASE_URL}/api/reservations/${testReservation.id}`)
    const singleGetData = await singleGetResponse.json()
    
    if (singleGetData.success) {
      console.log(`✅ Successfully retrieved reservation: ${singleGetData.data.queueNumber}`)
    } else {
      console.log('❌ Failed to get single reservation')
    }

    // 3. Test PUT (Edit) reservation
    console.log('\n3. ✏️ Testing PUT (Edit) reservation...')
    const editData = {
      name: testReservation.name + ' (Edited)',
      phone: testReservation.phone,
      nik: testReservation.nik || '1234567890123456',
      purpose: testReservation.purpose + ' - Updated via API test',
      service: testReservation.service,
      date: testReservation.date,
      timeSlot: testReservation.timeSlot,
      status: 'CALLED' // Change status to CALLED
    }

    const putResponse = await fetch(`${BASE_URL}/api/reservations/${testReservation.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editData)
    })

    const putResult = await putResponse.json()
    
    if (putResult.success) {
      console.log(`✅ Successfully edited reservation: ${putResult.data.queueNumber}`)
      console.log(`   - Name: ${putResult.data.name}`)
      console.log(`   - Status: ${putResult.data.status}`)
      console.log(`   - Purpose: ${putResult.data.purpose}`)
    } else {
      console.log('❌ Failed to edit reservation:', putResult.error)
    }

    // 4. Verify the edit by getting the reservation again
    console.log('\n4. 🔍 Verifying edit by getting reservation again...')
    const verifyResponse = await fetch(`${BASE_URL}/api/reservations/${testReservation.id}`)
    const verifyData = await verifyResponse.json()
    
    if (verifyData.success) {
      console.log(`✅ Verification successful: ${verifyData.data.name}`)
      console.log(`   - Status: ${verifyData.data.status}`)
      console.log(`   - Purpose: ${verifyData.data.purpose}`)
    } else {
      console.log('❌ Failed to verify edit')
    }

    // 5. Test DELETE reservation
    console.log('\n5. 🗑️ Testing DELETE reservation...')
    const deleteResponse = await fetch(`${BASE_URL}/api/reservations/${testReservation.id}`, {
      method: 'DELETE'
    })

    const deleteResult = await deleteResponse.json()
    
    if (deleteResult.success) {
      console.log(`✅ Successfully deleted reservation: ${testReservation.queueNumber}`)
    } else {
      console.log('❌ Failed to delete reservation:', deleteResult.error)
    }

    // 6. Verify deletion by trying to get the reservation again
    console.log('\n6. 🔍 Verifying deletion...')
    const verifyDeleteResponse = await fetch(`${BASE_URL}/api/reservations/${testReservation.id}`)
    
    if (verifyDeleteResponse.status === 404) {
      console.log('✅ Deletion verified - reservation not found (404)')
    } else {
      console.log('❌ Deletion verification failed - reservation still exists')
    }

    console.log('\n🎉 Edit and Delete functionality test completed!')

  } catch (error) {
    console.error('❌ Test failed with error:', error.message)
  }
}

// Run the test
testEditAndDelete()
