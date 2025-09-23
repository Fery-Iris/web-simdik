// Static data management for queue system
// In a real application, this would be replaced with a database

export interface QueueItem {
  id: string
  queueNumber: string
  service: string
  name: string
  phone: string
  nik?: string
  purpose: string
  date: string
  timeSlot: string
  status: "waiting" | "called" | "completed" | "cancelled"
  createdAt: string
  estimatedCallTime: string
}

export interface ServiceQueue {
  service: string
  serviceName: string
  currentNumber: string
  totalQueue: number
  estimatedWait: string
  status: "active" | "inactive"
  color: string
}

// Mock data storage (in production, use a database)
const queueItems: QueueItem[] = [
  {
    id: "1",
    queueNumber: "PTK-001234",
    service: "ptk",
    name: "Ahmad Rizki",
    phone: "081234567890",
    purpose: "Pengajuan sertifikat pendidik",
    date: "2025-01-16",
    timeSlot: "09:00",
    status: "called",
    createdAt: "2025-01-16T08:30:00Z",
    estimatedCallTime: "09:15",
  },
  {
    id: "2",
    queueNumber: "SD-001156",
    service: "sd",
    name: "Siti Nurhaliza",
    phone: "081234567891",
    purpose: "Pendaftaran sekolah baru",
    date: "2025-01-16",
    timeSlot: "10:00",
    status: "called",
    createdAt: "2025-01-16T09:00:00Z",
    estimatedCallTime: "10:30",
  },
]

const serviceQueues: ServiceQueue[] = [
  {
    service: "ptk",
    serviceName: "PTK (Pendidik dan Tenaga Kependidikan)",
    currentNumber: "PTK-001234",
    totalQueue: 15,
    estimatedWait: "45 menit",
    status: "active",
    color: "bg-blue-500",
  },
  {
    service: "sd",
    serviceName: "SD Umum",
    currentNumber: "SD-001156",
    totalQueue: 8,
    estimatedWait: "25 menit",
    status: "active",
    color: "bg-green-500",
  },
  {
    service: "smp",
    serviceName: "SMP Umum",
    currentNumber: "SMP-001089",
    totalQueue: 12,
    estimatedWait: "35 menit",
    status: "active",
    color: "bg-purple-500",
  },
  {
    service: "paud",
    serviceName: "PAUD",
    currentNumber: "PAUD-001067",
    totalQueue: 6,
    estimatedWait: "15 menit",
    status: "active",
    color: "bg-orange-500",
  },
]

// Helper functions
export function generateQueueNumber(service: string): string {
  const timestamp = Date.now().toString().slice(-6)
  const serviceCode = service.toUpperCase()
  return `${serviceCode}-${timestamp}`
}

export function calculateEstimatedTime(service: string): string {
  const serviceQueue = serviceQueues.find((q) => q.service === service)
  if (!serviceQueue) return "30 menit"

  const currentTime = new Date()
  const estimatedMinutes = serviceQueue.totalQueue * 3 // 3 minutes per person
  const estimatedTime = new Date(currentTime.getTime() + estimatedMinutes * 60000)

  return estimatedTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

// CRUD operations
export function createQueueItem(
  data: Omit<QueueItem, "id" | "queueNumber" | "createdAt" | "estimatedCallTime">,
): QueueItem {
  const queueNumber = generateQueueNumber(data.service)
  const estimatedCallTime = calculateEstimatedTime(data.service)

  const newItem: QueueItem = {
    ...data,
    id: Date.now().toString(),
    queueNumber,
    createdAt: new Date().toISOString(),
    estimatedCallTime,
  }

  queueItems.push(newItem)

  // Update service queue count
  const serviceQueue = serviceQueues.find((q) => q.service === data.service)
  if (serviceQueue) {
    serviceQueue.totalQueue += 1
    serviceQueue.estimatedWait = `${serviceQueue.totalQueue * 3} menit`
  }

  return newItem
}

export function getQueueItems(): QueueItem[] {
  return queueItems
}

export function getQueueItemById(id: string): QueueItem | undefined {
  return queueItems.find((item) => item.id === id)
}

export function getQueueItemByNumber(queueNumber: string): QueueItem | undefined {
  return queueItems.find((item) => item.queueNumber === queueNumber)
}

export function updateQueueItemStatus(id: string, status: QueueItem["status"]): QueueItem | null {
  const item = queueItems.find((item) => item.id === id)
  if (item) {
    item.status = status
    return item
  }
  return null
}

export function getServiceQueues(): ServiceQueue[] {
  return serviceQueues
}

export function getServiceQueue(service: string): ServiceQueue | undefined {
  return serviceQueues.find((q) => q.service === service)
}

export function getQueuesByService(service: string): QueueItem[] {
  return queueItems.filter((item) => item.service === service)
}

export function getRecentCompletedQueues(limit = 5): QueueItem[] {
  return queueItems
    .filter((item) => item.status === "completed")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

// Time slot management
export interface TimeSlot {
  id: string
  time: string
  capacity: number
  booked: number
}

export const timeSlots: TimeSlot[] = [
  { id: "08:00", time: "08:00 - 09:00", capacity: 10, booked: 3 },
  { id: "09:00", time: "09:00 - 10:00", capacity: 10, booked: 7 },
  { id: "10:00", time: "10:00 - 11:00", capacity: 10, booked: 2 },
  { id: "11:00", time: "11:00 - 12:00", capacity: 10, booked: 5 },
  { id: "13:00", time: "13:00 - 14:00", capacity: 10, booked: 1 },
  { id: "14:00", time: "14:00 - 15:00", capacity: 10, booked: 4 },
  { id: "15:00", time: "15:00 - 16:00", capacity: 10, booked: 8 },
]

export function getAvailableTimeSlots(date: string): TimeSlot[] {
  // In a real app, this would check actual bookings for the date
  return timeSlots.map((slot) => ({
    ...slot,
    booked: Math.floor(Math.random() * slot.capacity), // Random for demo
  }))
}

export function bookTimeSlot(timeSlotId: string, date: string): boolean {
  const slot = timeSlots.find((s) => s.id === timeSlotId)
  if (slot && slot.booked < slot.capacity) {
    slot.booked += 1
    return true
  }
  return false
}
