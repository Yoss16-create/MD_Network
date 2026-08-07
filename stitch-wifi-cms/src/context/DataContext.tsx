
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import * as api from '../services/api'
import type { BackendData, BackendTagihan } from '../services/api'

export interface CustomerRecord {
  id: string
  name: string
  initials: string
  wa: string
  email: string
  pkg: string
  area: string
  status: string
  tagihan: string
  amount: number
  address: string
  joinDate: string
  lastPayment: string
  invoices: { no: string; period: string; amount: number; status: string; date: string }[]
  history: { time: string; action: string }[]
}

export interface InvoiceRecord {
  no: string
  customerId: string
  name: string
  initials: string
  wa: string
  pkg: string
  period: string
  amount: number
  due: string
  status: string
  statusClass: string
  dotClass: string
  officer: string
  paymentMethod: string
  paidDate: string
  history: { time: string; action: string; user: string }[]
}

export interface PaymentRecord {
  no: string
  customerId: string
  name: string
  initials: string
  wa: string
  method: string
  bank: string
  amount: number
  date: string
  time: string
  status: string
  statusClass: string
  invoiceNo: string
  officer: string
  history: { time: string; action: string; user: string }[]
}

interface DataContextType {
  customers: CustomerRecord[]
  setCustomers: (customers: CustomerRecord[]) => void
  addCustomer: (c: CustomerRecord) => void
  invoices: InvoiceRecord[]
  setInvoices: (invoices: InvoiceRecord[]) => void
  addInvoice: (inv: InvoiceRecord) => void
  updateInvoice: (no: string, fields: Partial<InvoiceRecord>) => void
  payments: PaymentRecord[]
  setPayments: (payments: PaymentRecord[]) => void
  addPayment: (p: PaymentRecord) => void
  loading: boolean
  apiOnline: boolean
}

const DataContext = createContext<DataContextType | null>(null)

const statusMap = (s: string) => {
  if (s === 'Lunas') return { statusClass: 'bg-green-500/10 text-green-600', dotClass: 'bg-green-500' }
  if (s === 'Jatuh Tempo') return { statusClass: 'bg-tertiary-container/20 text-tertiary-container', dotClass: 'bg-tertiary-container' }
  if (s === 'Nunggak') return { statusClass: 'bg-red-200 text-red-800', dotClass: 'bg-red-600' }
  return { statusClass: 'bg-error-container text-on-error-container', dotClass: 'bg-error' }
}

const initialsOf = (name: string) =>
  (name || '')
    .trim()
    .split(/\s+/)
    .map(x => x[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '-'

const isLunas = (s?: string) => /lunas/i.test(s ?? '')

function mapCustomers(data: BackendData): CustomerRecord[] {
  const invsByCust = new Map<string, BackendTagihan[]>()
  for (const t of data.tagihan) {
    const list = invsByCust.get(t.id_pelanggan) ?? []
    list.push(t)
    invsByCust.set(t.id_pelanggan, list)
  }
  return data.pelanggan.map(p => {
    const invs = (invsByCust.get(p.id) ?? []).sort((a, b) => (b.periode || '').localeCompare(a.periode || ''))
    const paid = invs.filter(i => isLunas(i.status))
    const latest = invs[0]
    const amount = Number(latest?.nominal ?? 0)
    const hasUnpaid = invs.some(i => !isLunas(i.status))
    return {
      id: p.id,
      name: p.nama,
      initials: initialsOf(p.nama),
      wa: p.whatsapp || '-',
      email: '',
      pkg: p.paket || '-',
      area: p.area || '-',
      status: p.status || (hasUnpaid ? 'Belum Bayar' : 'Aktif'),
      tagihan: paid.length > 0 && invs.length === paid.length ? 'Lunas' : amount > 0 ? 'Rp ' + amount.toLocaleString('id-ID') : '-',
      amount,
      address: p.alamat || '-',
      joinDate: p.tgl_register || '-',
      lastPayment: paid[0] ? paid[0].tgl_dibuat || '-' : '-',
      invoices: invs.map(inv => ({
        no: inv.no_invoice || inv.id,
        period: inv.periode || '-',
        amount: Number(inv.nominal ?? 0),
        status: inv.status || 'Belum Dibayar',
        date: isLunas(inv.status) ? inv.tgl_dibuat || inv.jatuh_tempo || '-' : '-',
      })),
      history: invs.map(inv => ({
        time: inv.tgl_dibuat || inv.periode || '-',
        action: isLunas(inv.status) ? `Pembayaran tagihan ${inv.periode} diterima` : `Tagihan ${inv.periode} dibuat`,
      })),
    }
  })
}

function mapInvoices(data: BackendData): InvoiceRecord[] {
  const cust = new Map(data.pelanggan.map(p => [p.id, p]))
  return data.tagihan.map(t => {
    const p = cust.get(t.id_pelanggan)
    const lunas = isLunas(t.status)
    const status = t.status || 'Belum Dibayar'
    return {
      no: t.no_invoice || t.id,
      customerId: t.id_pelanggan,
      name: p?.nama || '-',
      initials: p ? initialsOf(p.nama) : '-',
      wa: p?.whatsapp || '-',
      pkg: p?.paket || '-',
      period: t.periode || '-',
      amount: Number(t.nominal ?? 0),
      due: t.jatuh_tempo || '10 ' + (t.periode || ''),
      status,
      ...statusMap(status),
      officer: 'Admin',
      paymentMethod: lunas ? 'Transfer Bank' : '-',
      paidDate: lunas ? t.tgl_dibuat || '-' : '-',
      history: [{ time: t.tgl_dibuat || t.periode || '-', action: lunas ? 'Pembayaran diterima' : 'Tagihan dibuat', user: 'Sistem' }],
    }
  })
}

function mapPayments(data: BackendData): PaymentRecord[] {
  const cust = new Map(data.pelanggan.map(p => [p.id, p]))
  const tagihan = new Map(data.tagihan.map(t => [t.id, t]))
  return data.pembayaran
    .filter(p => isLunas(p.status))
    .map(p => {
      const t = p.id_tagihan ? tagihan.get(p.id_tagihan) : undefined
      const c = p.id_pelanggan ? cust.get(p.id_pelanggan) : t ? cust.get(t.id_pelanggan) : undefined
      const paidDate = p.tgl || t?.tgl_dibuat || '-'
      return {
        no: p.no_trx || 'TRX-' + p.id,
        customerId: c?.id || p.id_pelanggan || '',
        name: c?.nama || '-',
        initials: c ? initialsOf(c.nama) : '-',
        wa: c?.whatsapp || '-',
        method: p.metode || 'Tunai',
        bank: 'BCA',
        amount: Number(p.nominal ?? t?.nominal ?? 0),
        date: paidDate,
        time: '09:00 WIB',
        status: p.status || 'Lunas',
        statusClass: 'bg-green-500/10 text-green-600',
        invoiceNo: t?.no_invoice || 'N/A',
        officer: p.petugas || 'Admin',
        history: [{ time: paidDate, action: 'Pembayaran diterima', user: 'Sistem' }],
      }
    })
}

const defaultCustomers: CustomerRecord[] = [
  { id: 'ISP-001', name: 'Ahmad Subarjo', initials: 'AS', wa: '08123456789', email: 'ahmad@email.com', pkg: 'WiFi Family (20 Mbps)', area: 'Pusat', status: 'Aktif', tagihan: 'Lunas', amount: 150000, address: 'Jl. Merdeka No. 12, Jakarta Pusat', joinDate: '15 Jan 2023', lastPayment: '10 Okt 2023', invoices: [{ no: '#INV-20231001', period: 'Okt 2023', amount: 150000, status: 'Lunas', date: '10 Okt 2023' }, { no: '#INV-20230901', period: 'Sep 2023', amount: 150000, status: 'Lunas', date: '10 Sep 2023' }], history: [{ time: '10 Okt 2023', action: 'Pembayaran tagihan Okt 2023 diterima' }, { time: '15 Jan 2023', action: 'Pelanggan terdaftar' }] },
  { id: 'ISP-002', name: 'Siti Wahyuni', initials: 'SW', wa: '08198765432', email: 'siti@email.com', pkg: 'WiFi Pro (50 Mbps)', area: 'Utara', status: 'Belum Bayar', tagihan: 'Rp 350.000', amount: 350000, address: 'Jl. Sudirman No. 45, Jakarta Utara', joinDate: '20 Feb 2023', lastPayment: '10 Sep 2023', invoices: [{ no: '#INV-20231002', period: 'Okt 2023', amount: 350000, status: 'Belum Dibayar', date: '-' }], history: [{ time: '01 Okt 2023', action: 'Tagihan Okt 2023 dibuat' }, { time: '20 Feb 2023', action: 'Pelanggan terdaftar' }] },
  { id: 'ISP-003', name: 'Bambang Pamungkas', initials: 'BP', wa: '08112233445', email: 'bambang@email.com', pkg: 'WiFi Basic (10 Mbps)', area: 'Selatan', status: 'Jatuh Tempo', tagihan: 'Rp 150.000', amount: 150000, address: 'Jl. Gatot Subroto No. 8, Jakarta Selatan', joinDate: '05 Mar 2023', lastPayment: '10 Agu 2023', invoices: [{ no: '#INV-20231003', period: 'Okt 2023', amount: 150000, status: 'Jatuh Tempo', date: '-' }, { no: '#INV-20230903', period: 'Sep 2023', amount: 150000, status: 'Jatuh Tempo', date: '-' }], history: [{ time: '10 Okt 2023', action: 'Tagihan melewati jatuh tempo' }, { time: '05 Mar 2023', action: 'Pelanggan terdaftar' }] },
  { id: 'ISP-004', name: 'Rian Hidayat', initials: 'RH', wa: '08155667788', email: 'rian@email.com', pkg: 'WiFi Pro (50 Mbps)', area: 'Utara', status: 'Belum Bayar', tagihan: 'Rp 350.000', amount: 350000, address: 'Jl. Kelapa Gading No. 3, Jakarta Utara', joinDate: '10 Apr 2023', lastPayment: '10 Agu 2023', invoices: [{ no: '#INV-20231004', period: 'Okt 2023', amount: 350000, status: 'Belum Dibayar', date: '-' }, { no: '#INV-20230904', period: 'Sep 2023', amount: 350000, status: 'Belum Dibayar', date: '-' }], history: [{ time: '01 Okt 2023', action: 'Tagihan Okt 2023 dibuat' }, { time: '10 Apr 2023', action: 'Pelanggan terdaftar' }] },
  { id: 'ISP-005', name: 'Dewi Sartika', initials: 'DS', wa: '08144556677', email: 'dewi@email.com', pkg: 'Ultra-Net (100 Mbps)', area: 'Pusat', status: 'Nunggak', tagihan: 'Rp 1.000.000', amount: 500000, address: 'Jl. Thamrin No. 21, Jakarta Pusat', joinDate: '01 Feb 2023', lastPayment: '10 Jul 2023', invoices: [{ no: '#INV-20230801', period: 'Agu 2023', amount: 500000, status: 'Nunggak', date: '-' }, { no: '#INV-20230701', period: 'Jul 2023', amount: 500000, status: 'Nunggak', date: '-' }], history: [{ time: '10 Agu 2023', action: 'Tagihan Agu 2023 menunggak' }, { time: '01 Feb 2023', action: 'Pelanggan terdaftar' }] },
  { id: 'ISP-006', name: 'Farhan Malik', initials: 'FM', wa: '08122334455', email: 'farhan@email.com', pkg: 'WiFi Basic (10 Mbps)', area: 'Selatan', status: 'Tidak Aktif', tagihan: '-', amount: 0, address: 'Jl. Kuningan No. 7, Jakarta Selatan', joinDate: '01 Jan 2023', lastPayment: '10 Jun 2023', invoices: [], history: [{ time: '01 Jul 2023', action: 'Layanan dinonaktifkan' }, { time: '01 Jan 2023', action: 'Pelanggan terdaftar' }] },
  { id: 'ISP-007', name: 'Lestari Wijaya', initials: 'LW', wa: '08133445566', email: 'lestari@email.com', pkg: 'WiFi Family (20 Mbps)', area: 'Barat', status: 'Aktif', tagihan: 'Lunas', amount: 150000, address: 'Jl. Kebon Jeruk No. 15, Jakarta Barat', joinDate: '20 Mei 2023', lastPayment: '10 Okt 2023', invoices: [{ no: '#INV-20231005', period: 'Okt 2023', amount: 150000, status: 'Lunas', date: '10 Okt 2023' }], history: [{ time: '10 Okt 2023', action: 'Pembayaran tagihan Okt 2023 diterima' }, { time: '20 Mei 2023', action: 'Pelanggan terdaftar' }] },
  { id: 'ISP-008', name: 'Eko Pratama', initials: 'EP', wa: '08166778899', email: 'eko@email.com', pkg: 'WiFi Pro (50 Mbps)', area: 'Barat', status: 'Belum Bayar', tagihan: 'Rp 350.000', amount: 350000, address: 'Jl. Cengkareng No. 9, Jakarta Barat', joinDate: '15 Jun 2023', lastPayment: '10 Sep 2023', invoices: [{ no: '#INV-20231006', period: 'Okt 2023', amount: 350000, status: 'Belum Dibayar', date: '-' }], history: [{ time: '01 Okt 2023', action: 'Tagihan Okt 2023 dibuat' }, { time: '15 Jun 2023', action: 'Pelanggan terdaftar' }] },
  { id: 'ISP-009', name: 'Budi Santoso', initials: 'BS', wa: '08177889900', email: 'budi@email.com', pkg: 'Ultra-Net (100 Mbps)', area: 'Pusat', status: 'Jatuh Tempo', tagihan: 'Rp 500.000', amount: 500000, address: 'Jl. Menteng No. 33, Jakarta Pusat', joinDate: '01 Mar 2023', lastPayment: '10 Sep 2023', invoices: [{ no: '#INV-20231007', period: 'Okt 2023', amount: 500000, status: 'Jatuh Tempo', date: '-' }], history: [{ time: '05 Okt 2023', action: 'Tagihan mendekati jatuh tempo' }, { time: '01 Mar 2023', action: 'Pelanggan terdaftar' }] },
]

function buildInvoices(customers: CustomerRecord[]): InvoiceRecord[] {
  return customers.flatMap(c => c.invoices.map(inv => ({
    no: inv.no,
    customerId: c.id,
    name: c.name,
    initials: c.initials,
    wa: c.wa,
    pkg: c.pkg,
    period: inv.period,
    amount: inv.amount,
    due: inv.date !== '-' ? inv.date : '10 ' + inv.period,
    status: inv.status,
    ...statusMap(inv.status),
    officer: 'Admin',
    paymentMethod: '-',
    paidDate: inv.date !== '-' ? inv.date + ', 09:00 WIB' : '-',
    history: [{ time: inv.date !== '-' ? inv.date + ', 09:00 WIB' : inv.period, action: inv.status === 'Lunas' ? 'Pembayaran diterima' : 'Tagihan dibuat', user: 'Sistem' }]
  })))
}

function buildPayments(customers: CustomerRecord[]): PaymentRecord[] {
  return customers
    .filter(c => c.invoices.some(inv => inv.status === 'Lunas'))
    .flatMap(c => c.invoices.filter(inv => inv.status === 'Lunas').map(inv => ({
      no: '#TRX-' + inv.no.replace('#INV-', ''),
      customerId: c.id,
      name: c.name,
      initials: c.initials,
      wa: c.wa,
      method: 'Transfer Bank',
      bank: 'BCA',
      amount: inv.amount,
      date: inv.date,
      time: '09:00 WIB',
      status: 'Lunas' as const,
      statusClass: 'bg-green-500/10 text-green-600',
      invoiceNo: inv.no,
      officer: 'Admin',
      history: [{ time: inv.date + ', 09:00 WIB', action: 'Pembayaran diterima via BCA', user: 'Sistem' }, { time: inv.date + ', 09:01 WIB', action: 'Invoice ' + inv.no + ' ditandai Lunas', user: 'Admin' }]
    })))
}

const defaultInvoices = buildInvoices(defaultCustomers)
const defaultPayments = buildPayments(defaultCustomers)

export function DataProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<CustomerRecord[]>(defaultCustomers)
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(defaultInvoices)
  const [payments, setPayments] = useState<PaymentRecord[]>(defaultPayments)
  const [loading, setLoading] = useState(true)
  const [apiOnline, setApiOnline] = useState(false)

  useEffect(() => {
    let active = true
    const loadFromApi = async () => {
      try {
        const res = await api.getAll()
        const d = res.data
        if (!active) return
        if (d) {
          if (d.pelanggan && d.pelanggan.length) setCustomers(mapCustomers(d))
          if (d.tagihan && d.tagihan.length) setInvoices(mapInvoices(d))
          if (d.pembayaran && d.pembayaran.length) setPayments(mapPayments(d))
        }
        setApiOnline(true)
      } catch (err) {
        console.warn('[DataContext] Backend tidak tersedia, memakai data lokal:', err)
        if (active) setApiOnline(false)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadFromApi()
    return () => {
      active = false
    }
  }, [])

  const addCustomer = (c: CustomerRecord) => {
    setCustomers(prev => [...prev, c])
    api.createPelanggan({
      nama: c.name,
      whatsapp: c.wa,
      paket: c.pkg,
      area: c.area,
      alamat: c.address,
      status: c.status,
    }).catch(err => console.warn('[DataContext] Gagal simpan pelanggan ke backend:', err))
  }

  const addInvoice = (inv: InvoiceRecord) => {
    setInvoices(prev => [...prev, inv])
    api.addTagihan({
      id_pelanggan: inv.customerId,
      periode: inv.period,
      nominal: String(inv.amount || 0),
      jatuh_tempo: inv.due,
      status: inv.status,
    }).catch(err => console.warn('[DataContext] Gagal simpan invoice ke backend:', err))
  }

  const updateInvoice = (no: string, fields: Partial<InvoiceRecord>) => {
    setInvoices(prev => prev.map(inv => (inv.no === no ? { ...inv, ...fields } : inv)))
    if (fields.status === 'Lunas') {
      api.bayarTagihan({ no_invoice: no }).catch(err => console.warn('[DataContext] Gagal update invoice ke backend:', err))
    }
  }

  const addPayment = (p: PaymentRecord) => {
    setPayments(prev => [...prev, p])
    api.bayarTagihan({ no_invoice: p.invoiceNo }).catch(err => console.warn('[DataContext] Gagal simpan pembayaran ke backend:', err))
  }

  return (
    <DataContext.Provider value={{ customers, setCustomers, addCustomer, invoices, setInvoices, addInvoice, updateInvoice, payments, setPayments, addPayment, loading, apiOnline }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
