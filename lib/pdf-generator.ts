// PDF Generator utility for reservation tickets
export interface ReservationTicketData {
  queueNumber: string
  serviceName: string
  name: string
  date: string
  time: string
  estimatedTime: string
  phone: string
  purpose: string
}

export async function generateTicketPDF(data: ReservationTicketData): Promise<void> {
  try {
    // Create HTML content for the ticket
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tiket Reservasi - ${data.queueNumber}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Arial', sans-serif;
              background: white;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            
            .ticket {
              width: 400px;
              background: white;
              border: 2px dashed #333;
              border-radius: 8px;
              padding: 32px;
              box-shadow: inset 0 0 0 1px #333;
            }
            
            .header {
              text-align: center;
              margin-bottom: 24px;
            }
            
            .department {
              font-size: 12px;
              font-weight: 600;
              color: #666;
              margin-bottom: 8px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .title {
              font-size: 18px;
              font-weight: 700;
              color: #2563eb;
              margin-bottom: 24px;
            }
            
            .ticket-id-section {
              border-top: 1px solid #e5e7eb;
              border-bottom: 1px solid #e5e7eb;
              padding: 24px 0;
              margin-bottom: 24px;
              text-align: center;
            }
            
            .ticket-id {
              font-size: 48px;
              font-weight: 900;
              color: #2563eb;
              margin-bottom: 8px;
              word-break: break-all;
            }
            
            .service-name {
              font-size: 20px;
              font-weight: 600;
              color: #1e40af;
            }
            
            .details {
              margin-bottom: 24px;
            }
            
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #f3f4f6;
            }
            
            .detail-row:last-child {
              border-bottom: none;
            }
            
            .detail-label {
              font-weight: 600;
              color: #374151;
            }
            
            .detail-value {
              color: #111827;
              text-align: right;
              max-width: 60%;
              word-break: break-word;
            }
            
            .estimated-call {
              font-weight: 900;
              color: #2563eb;
            }
            
            .important-note {
              font-size: 12px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 16px;
              margin-top: 16px;
            }
            
            .important-note strong {
              color: #1e40af;
            }
            
            @media print {
              body {
                padding: 0;
                margin: 0;
              }
              
              .ticket {
                width: 100%;
                max-width: 400px;
                margin: 0 auto;
                box-shadow: none;
                border: 2px solid #000;
              }
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <div class="department">DINAS PENDIDIKAN KOTA BANJARMASIN</div>
              <div class="title">TIKET RESERVASI ONLINE</div>
            </div>
            
            <div class="ticket-id-section">
              <div class="ticket-id">${data.queueNumber}</div>
              <div class="service-name">${data.serviceName}</div>
            </div>
            
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Nama:</span>
                <span class="detail-value">${data.name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Tanggal:</span>
                <span class="detail-value">${data.date}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Waktu:</span>
                <span class="detail-value">${data.time}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Est. Panggilan:</span>
                <span class="detail-value estimated-call">${data.estimatedTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">No. HP:</span>
                <span class="detail-value">${data.phone}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Tujuan:</span>
                <span class="detail-value">${data.purpose}</span>
              </div>
            </div>
            
            <div class="important-note">
              <p><strong>Penting:</strong> Simpan atau cetak tiket ini sebagai bukti reservasi Anda.</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Create blob and download directly
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    
    // Create download link
    const link = document.createElement('a')
    link.href = url
    link.download = `Tiket-Reservasi-${data.queueNumber}.html`
    
    // Trigger download
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}

