
import { createContext, useContext, useState, type ReactNode } from 'react'

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
  payments: PaymentRecord[]
  setPayments: (payments: PaymentRecord[]) => void
  addPayment: (p: PaymentRecord) => void
}

const DataContext = createContext<DataContextType | null>(null)

const statusMap = (s: string) => {
  if (s === 'Lunas') return { statusClass: 'bg-green-500/10 text-green-600', dotClass: 'bg-green-500' }
  if (s === 'Jatuh Tempo') return { statusClass: 'bg-tertiary-container/20 text-tertiary-container', dotClass: 'bg-tertiary-container' }
  if (s === 'Nunggak') return { statusClass: 'bg-red-200 text-red-800', dotClass: 'bg-red-600' }
  return { statusClass: 'bg-error-container text-on-error-container', dotClass: 'bg-error' }
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

  const addCustomer = (c: CustomerRecord) => setCustomers(prev => [...prev, c])
  const addInvoice = (inv: InvoiceRecord) => setInvoices(prev => [...prev, inv])
  const addPayment = (p: PaymentRecord) => setPayments(prev => [...prev, p])

  return (
    <DataContext.Provider value={{ customers, setCustomers, addCustomer, invoices, setInvoices, addInvoice, payments, setPayments, addPayment }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
