const BASE_URL = 'http://localhost:3000'

async function testTimeSlots() {
  console.log('🧪 Testing Time Slots API with Different Days...\n')

  const testDates = [
    { date: '2025-01-27', day: 'Monday' },
    { date: '2025-01-28', day: 'Tuesday' },
    { date: '2025-01-29', day: 'Wednesday' },
    { date: '2025-01-30', day: 'Thursday' },
    { date: '2025-01-31', day: 'Friday' },
    { date: '2025-02-01', day: 'Saturday' },
    { date: '2025-02-02', day: 'Sunday' },
  ]

  for (const testDate of testDates) {
    try {
      console.log(`📅 Testing ${testDate.day} (${testDate.date}):`)
      
      const response = await fetch(`${BASE_URL}/api/time-slots?date=${testDate.date}`)
      const result = await response.json()
      
      if (result.success) {
        if (result.data.length === 0) {
          console.log(`   ✅ No service (${result.message || 'Weekend'})`)
        } else {
          console.log(`   ✅ Available slots:`)
          result.data.forEach(slot => {
            console.log(`      - ${slot.time} (${slot.booked}/${slot.capacity} booked)`)
          })
        }
      } else {
        console.log(`   ❌ Error: ${result.error}`)
      }
    } catch (error) {
      console.log(`   ❌ Request failed: ${error.message}`)
    }
    console.log('')
  }

  console.log('🎉 Time slots test completed!')
}

// Run the test
testTimeSlots()
