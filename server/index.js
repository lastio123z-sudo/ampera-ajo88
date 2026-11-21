import { createServer } from 'node:http'
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'

const serverDirectory = dirname(fileURLToPath(import.meta.url))
const dataDirectory = join(serverDirectory, 'data')
const dataFile = join(dataDirectory, 'orders.json')
const port = Number(process.env.API_PORT || 3001)

mkdirSync(dataDirectory, { recursive: true })
if (!existsSync(dataFile)) writeFileSync(dataFile, '[]\n', 'utf8')

function readOrders() {
  const orders = JSON.parse(readFileSync(dataFile, 'utf8'))
  if (!Array.isArray(orders)) throw new Error('Data pesanan harus berupa array')
  return orders
}

function saveOrders(orders) {
  writeFileSync(dataFile, `${JSON.stringify(orders, null, 2)}\n`, 'utf8')
}

function respond(response, status, data) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  })
  response.end(JSON.stringify(data))
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''
    request.setEncoding('utf8')
    request.on('data', chunk => {
      body += chunk
      if (body.length > 1024 * 1024) {
        reject(Object.assign(new Error('Permintaan terlalu besar'), { status: 413 }))
        request.destroy()
      }
    })
    request.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'))
      } catch {
        reject(Object.assign(new Error('Format JSON tidak valid'), { status: 400 }))
      }
    })
    request.on('error', reject)
  })
}

function normalizeItems(items) {
  if (!Array.isArray(items) || items.length === 0 || items.length > 30) {
    throw Object.assign(new Error('Keranjang pesanan tidak valid'), { status: 400 })
  }

  return items.map(item => {
    const jumlah = Number(item.jumlah)
    const harga = Number(item.harga)
    const nama = String(item.nama || '').trim()
    const produkId = String(item.produkId || '').trim()
    if (!produkId || !nama || nama.length > 120 || !Number.isSafeInteger(jumlah) || jumlah < 1 || jumlah > 100 || !Number.isFinite(harga) || harga <= 0) {
      throw Object.assign(new Error('Detail menu pada pesanan tidak valid'), { status: 400 })
    }
    return { produkId, nama, harga, jumlah, subtotal: harga * jumlah }
  })
}

function orderNumber(orders) {
  const date = new Date()
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, '')
  const count = orders.filter(order => order.nomorNota.includes(datePart)).length + 1
  return `AA-${datePart}-${String(count).padStart(3, '0')}`
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost')

  try {
    if (request.method === 'GET' && url.pathname === '/api/v1/orders') {
      const orders = readOrders()
      if (url.searchParams.has('nota')) {
        const order = orders.find(item => item.nomorNota === url.searchParams.get('nota')) || null
        return respond(response, 200, { order })
      }
      return respond(response, 200, { orders })
    }

    if (request.method === 'POST' && url.pathname === '/api/v1/orders') {
      const body = await readJsonBody(request)
      const customerName = String(body.customerName || '').trim()
      if (!customerName || customerName.length > 100) {
        return respond(response, 400, { message: 'Nama pelanggan wajib diisi (maksimal 100 karakter)' })
      }
      const items = normalizeItems(body.items)
      const orders = readOrders()
      const order = {
        id: randomUUID(),
        nomorNota: orderNumber(orders),
        customerName,
        items,
        total: items.reduce((total, item) => total + item.subtotal, 0),
        bayar: null,
        kembalian: null,
        status: 'menunggu_pembayaran',
        tanggal: new Date().toISOString()
      }
      orders.unshift(order)
      saveOrders(orders)
      return respond(response, 201, { order })
    }

    const paymentMatch = url.pathname.match(/^\/api\/v1\/orders\/([^/]+)\/payment$/)
    if (request.method === 'PATCH' && paymentMatch) {
      const body = await readJsonBody(request)
      const orders = readOrders()
      const order = orders.find(item => item.id === decodeURIComponent(paymentMatch[1]))
      if (!order) return respond(response, 404, { message: 'Pesanan tidak ditemukan' })
      if (order.status !== 'menunggu_pembayaran') {
        return respond(response, 409, { message: 'Pesanan ini sudah diproses' })
      }
      const bayar = Number(body.bayar)
      if (!Number.isFinite(bayar) || bayar < order.total) {
        return respond(response, 400, { message: 'Jumlah pembayaran harus minimal sebesar total pesanan' })
      }
      order.bayar = bayar
      order.kembalian = bayar - order.total
      order.status = 'selesai'
      order.paidAt = new Date().toISOString()
      saveOrders(orders)
      return respond(response, 200, { order })
    }

    return respond(response, 404, { message: 'Endpoint tidak ditemukan' })
  } catch (error) {
    const status = error.status || 500
    if (status >= 500) console.error('API pesanan gagal:', error)
    return respond(response, status, { message: status >= 500 ? 'Terjadi kesalahan pada server pesanan' : error.message })
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`API pesanan berjalan di http://127.0.0.1:${port}`)
})
