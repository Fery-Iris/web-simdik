const baseUrl = 'http://localhost:3000/api'

async function testAgendaAPI() {
  console.log('🧪 Testing Agenda API...\n')

  try {
    // Test 1: Get all agendas
    console.log('1️⃣ Testing GET /api/agendas')
    const getAllResponse = await fetch(`${baseUrl}/agendas`)
    const allAgendas = await getAllResponse.json()
    
    if (getAllResponse.ok && allAgendas.success) {
      console.log(`✅ Successfully fetched ${allAgendas.data.length} agendas`)
      console.log(`📊 Statistics:`, {
        total: allAgendas.data.length,
        scheduled: allAgendas.data.filter(a => a.status === 'SCHEDULED').length,
        ongoing: allAgendas.data.filter(a => a.status === 'ONGOING').length,
        completed: allAgendas.data.filter(a => a.status === 'COMPLETED').length
      })
    } else {
      console.log('❌ Failed to fetch agendas:', allAgendas.message)
    }

    console.log('\n' + '='.repeat(50) + '\n')

    // Test 2: Create new agenda
    console.log('2️⃣ Testing POST /api/agendas')
    const newAgenda = {
      title: 'Test Agenda API',
      date: '2024-02-01',
      time: '15:30',
      location: 'Test Location',
      status: 'SCHEDULED'
    }

    const createResponse = await fetch(`${baseUrl}/agendas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAgenda)
    })
    const createdAgenda = await createResponse.json()

    if (createResponse.ok && createdAgenda.success) {
      console.log('✅ Successfully created new agenda')
      console.log('📝 Created agenda:', {
        id: createdAgenda.data.id,
        title: createdAgenda.data.title,
        status: createdAgenda.data.status
      })
      
      const agendaId = createdAgenda.data.id

      console.log('\n' + '='.repeat(50) + '\n')

      // Test 3: Get single agenda
      console.log('3️⃣ Testing GET /api/agendas/[id]')
      const getSingleResponse = await fetch(`${baseUrl}/agendas/${agendaId}`)
      const singleAgenda = await getSingleResponse.json()

      if (getSingleResponse.ok && singleAgenda.success) {
        console.log('✅ Successfully fetched single agenda')
        console.log('📄 Agenda details:', {
          id: singleAgenda.data.id,
          title: singleAgenda.data.title,
          date: singleAgenda.data.date,
          time: singleAgenda.data.time,
          location: singleAgenda.data.location,
          status: singleAgenda.data.status
        })
      } else {
        console.log('❌ Failed to fetch single agenda:', singleAgenda.message)
      }

      console.log('\n' + '='.repeat(50) + '\n')

      // Test 4: Update agenda
      console.log('4️⃣ Testing PUT /api/agendas/[id]')
      const updateData = {
        title: 'Updated Test Agenda API',
        date: '2024-02-02',
        time: '16:00',
        location: 'Updated Test Location',
        status: 'ONGOING'
      }

      const updateResponse = await fetch(`${baseUrl}/agendas/${agendaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })
      const updatedAgenda = await updateResponse.json()

      if (updateResponse.ok && updatedAgenda.success) {
        console.log('✅ Successfully updated agenda')
        console.log('🔄 Updated agenda:', {
          id: updatedAgenda.data.id,
          title: updatedAgenda.data.title,
          status: updatedAgenda.data.status
        })
      } else {
        console.log('❌ Failed to update agenda:', updatedAgenda.message)
      }

      console.log('\n' + '='.repeat(50) + '\n')

      // Test 5: Delete agenda
      console.log('5️⃣ Testing DELETE /api/agendas/[id]')
      const deleteResponse = await fetch(`${baseUrl}/agendas/${agendaId}`, {
        method: 'DELETE'
      })
      const deleteResult = await deleteResponse.json()

      if (deleteResponse.ok && deleteResult.success) {
        console.log('✅ Successfully deleted agenda')
        console.log('🗑️  Deleted agenda ID:', agendaId)
      } else {
        console.log('❌ Failed to delete agenda:', deleteResult.message)
      }

      console.log('\n' + '='.repeat(50) + '\n')

    } else {
      console.log('❌ Failed to create agenda:', createdAgenda.message)
    }

    // Test 6: Filter by status
    console.log('6️⃣ Testing GET /api/agendas?status=SCHEDULED')
    const filterResponse = await fetch(`${baseUrl}/agendas?status=SCHEDULED`)
    const filteredAgendas = await filterResponse.json()

    if (filterResponse.ok && filteredAgendas.success) {
      console.log('✅ Successfully filtered agendas by status')
      console.log(`📊 Found ${filteredAgendas.data.length} scheduled agendas`)
    } else {
      console.log('❌ Failed to filter agendas:', filteredAgendas.message)
    }

    console.log('\n' + '='.repeat(50) + '\n')

    // Test 7: Validation errors
    console.log('7️⃣ Testing validation errors')
    const invalidAgenda = {
      title: '', // Empty title should fail
      date: 'invalid-date',
      time: '25:99', // Invalid time
      location: '', // Empty location should fail
    }

    const validationResponse = await fetch(`${baseUrl}/agendas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidAgenda)
    })
    const validationResult = await validationResponse.json()

    if (!validationResponse.ok && !validationResult.success) {
      console.log('✅ Validation correctly rejected invalid data')
      console.log('🚫 Validation errors:', validationResult.errors)
    } else {
      console.log('❌ Validation should have failed but passed')
    }

    console.log('\n🎉 All API tests completed!')

  } catch (error) {
    console.error('❌ Test failed with error:', error.message)
  }
}

// Run the tests
testAgendaAPI()
