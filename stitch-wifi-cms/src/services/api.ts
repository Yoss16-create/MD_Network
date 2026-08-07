/*
 * API Stitch WiFi — Google Apps Script (Web App).
 *
 * Request : POST JSON ke VITE_API_URL  →  { action: '...', ...payload }
 * Response: { ok: true, data?, user?, message? }  |  { ok: false, error: '...' }
 *
 * Action yang tersedia di backend:
 *  - ping                    → health check
 *  - login                   → { username, email, password }
 *  - getAll                  → data lengkap semua menu:
 *      { data: { pelanggan, paket, tagihan, pembayaran, transaksi, pengingat, profil, pengguna } }
 *  - create_pelanggan        → { nama, whatsapp, paket, area, alamat, status, tgl_register }
 *  - addPelanggan            → alias create_pelanggan
 *  - hapus_pelanggan         → { id }
 *  - add_tagihan             → { id_pelanggan, periode, nominal, jatuh_tempo, status }
 *  - bayar                   → { id, no_invoice }  (menandai tagihan lunas)
 *  - kirim_wa                → { wa, pesan }
 *
 * Catatan: Apps Script tidak mendukung CORS preflight, maka Content-Type
 * wajib "text/plain;charset=utf-8" (bukan application/json).
 */

const API_URL: string = import.meta.env.VITE_API_URL || ''
const API_TIMEOUT_MS = 20000

export class ApiError extends Error {
  readonly offline: boolean

  constructor(message: string, offline = false) {
    super(message)
    this.name = 'ApiError'
    this.offline = offline
  }
}

export function isApiConfigured(): boolean {
  return API_URL.length > 0
}

interface ApiEnvelope {
  ok: boolean
  error?: string
  message?: string
  data?: unknown
  user?: ApiUser
}

async function request<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  if (!API_URL) {
    throw new ApiError('VITE_API_URL belum dikonfigurasi di file .env', true)
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

  let res: Response
  try {
    res = await fetch(API_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, ...payload }),
    })
  } catch {
    clearTimeout(timer)
    throw new ApiError('Tidak dapat terhubung ke server. Mode data lokal aktif.', true)
  }
  clearTimeout(timer)

  const raw = await res.text()
  let data: ApiEnvelope
  try {
    data = JSON.parse(raw) as ApiEnvelope
  } catch {
    data = { ok: false, error: raw || `Respons tidak valid dari server (${res.status})` }
  }

  if (!res.ok) {
    throw new ApiError(data.error || `Server error (${res.status})`, true)
  }
  if (data.ok === false) {
    throw new ApiError(data.error || 'Operasi gagal di server', false)
  }
  return data as unknown as T
}

/* ─────────────────────────── Tipe Backend ─────────────────────────── */

export interface ApiUser {
  id: string
  nama: string
  email: string
  role: string
  aktif?: string
}

export interface BackendPelanggan {
  id: string
  nama: string
  whatsapp: string
  paket: string
  area: string
  alamat: string
  status: string
  tgl_register: string
}

export interface BackendPaket {
  id: string
  nama: string
  kecepatan: string
  harga: string
}

export interface BackendTagihan {
  id: string
  no_invoice: string
  id_pelanggan: string
  periode: string
  nominal: string
  jatuh_tempo: string
  status: string
  tgl_dibuat: string
  file_url?: string
}

export interface BackendPembayaran {
  id: string
  no_trx?: string
  id_tagihan?: string
  id_pelanggan?: string
  nominal?: string
  metode?: string
  tgl?: string
  status?: string
  petugas?: string
}

export interface BackendTransaksi {
  id: string
  keterangan: string
  tipe: string
  nominal: string
  petugas: string
  tgl: string
}

export interface BackendPengingat {
  id?: string
  nama?: string
  name?: string
  wa?: string
  whatsapp?: string
  paket?: string
  pkg?: string
  nominal?: string
  amount?: string
  jatuh_tempo?: string
  due?: string
  status?: string
  statusClass?: string
}

export interface BackendProfil {
  key: string
  value: string
}

export interface BackendPengguna {
  id: string
  nama: string
  email: string
  role: string
  password: string
  aktif?: string
}

export interface BackendData {
  pelanggan: BackendPelanggan[]
  paket: BackendPaket[]
  tagihan: BackendTagihan[]
  pembayaran: BackendPembayaran[]
  transaksi: BackendTransaksi[]
  pengingat: BackendPengingat[]
  profil: BackendProfil[]
  pengguna: BackendPengguna[]
}

/* ─────────────────────────── Tipe Tampilan Bersama ─────────────────────────── */

export interface Transaction {
  date: string
  desc: string
  category: string
  catClass: string
  amount: number
  amtClass: string
  officer: string
  invoiceNo: string
  pelanggan: string
  metode: string
  month: string
}

export interface Reminder {
  name: string
  pkg: string
  amount: string
  due: string
  wa: string
  status: string
  statusClass: string
}

/* ─────────────────────────── Aksi ─────────────────────────── */

export function ping() {
  return request<ApiEnvelope>('ping')
}

export function login(payload: { username?: string; email: string; password: string }) {
  return request<ApiEnvelope & { user?: ApiUser }>('login', payload)
}

export function register(payload: { name: string; email: string; password: string; company: string }) {
  return request<ApiEnvelope & { user?: ApiUser }>('register', payload as unknown as Record<string, unknown>)
}

export function forgotPassword(payload: { email: string }) {
  return request<ApiEnvelope>('forgot_password', payload)
}

export function updateProfile(payload: Record<string, string>) {
  return request<ApiEnvelope>('update_profil', payload as Record<string, unknown>)
}

export function changePassword(payload: { email: string; current: string; newPassword: string }) {
  return request<ApiEnvelope>('ubah_password', payload as Record<string, unknown>)
}

export function addReminder(payload: Reminder) {
  return request<ApiEnvelope>('add_pengingat', payload as unknown as Record<string, unknown>)
}

export function updateReminder(name: string, fields: { status: string; statusClass: string }) {
  return request<ApiEnvelope>('update_pengingat', { nama: name, ...fields })
}

export function sendWhatsApp(payload: { to: string; message: string }) {
  return kirimWa({ wa: payload.to, pesan: payload.message })
}

export function saveSettings(payload: { section: string; settings: Record<string, unknown> }) {
  return request<ApiEnvelope>('save_settings', payload as Record<string, unknown>)
}

export function getTransactions() {
  return getAll().then(res => ({ transactions: (res.data?.transaksi ?? []).map(mapTransaction) }))
}

export function getReminders() {
  return getAll().then(res => ({ reminders: (res.data?.pengingat ?? []).map(mapReminder) }))
}

export function getSettings() {
  return getAll().then(res => ({ settings: mapSettings(res.data?.profil ?? []) }))
}

export function getAll() {
  return request<ApiEnvelope & { data?: BackendData }>('getAll')
}

export function createPelanggan(payload: Partial<BackendPelanggan>) {
  return request<ApiEnvelope>('create_pelanggan', payload as Record<string, unknown>)
}

export function hapusPelanggan(id: string) {
  return request<ApiEnvelope>('hapus_pelanggan', { id })
}

export function addTagihan(payload: Partial<BackendTagihan>) {
  return request<ApiEnvelope>('add_tagihan', payload as Record<string, unknown>)
}

export function bayarTagihan(payload: { id?: string; no_invoice?: string }) {
  return request<ApiEnvelope>('bayar', payload as Record<string, unknown>)
}

export function kirimWa(payload: { wa: string; pesan: string }) {
  return request<ApiEnvelope>('kirim_wa', payload)
}

/* ─────────────────────────── Konverter Data Backend ─────────────────────────── */

const MONTHS_ID = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

function monthOf(dateStr: string): string {
  const iso = /^\d{4}-\d{1,2}-\d{1,2}/.exec(dateStr)
  if (iso) {
    const [, y, m] = iso[0].split('-').map(Number)
    return `${MONTHS_ID[m] ?? m} ${y}`
  }
  const dmy = /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})/.exec(dateStr)
  if (dmy) {
    const m = Number(dmy[2])
    return `${MONTHS_ID[m] ?? m} ${dmy[3]}`
  }
  return dateStr
}

function mapTransaction(t: BackendTransaksi): Transaction {
  const amount = Number(t.nominal ?? 0) || 0
  const masuk = /masuk/i.test(t.tipe ?? '') || t.tipe === 'Pemasukan'
  return {
    date: t.tgl || '-',
    desc: t.keterangan || '-',
    category: masuk ? 'Pemasukan' : 'Pengeluaran',
    catClass: masuk ? 'bg-emerald-100 text-emerald-800' : 'bg-error-container/20 text-error',
    amount,
    amtClass: masuk ? 'text-emerald-600' : 'text-error',
    officer: t.petugas || 'Admin',
    invoiceNo: 'N/A',
    pelanggan: 'N/A',
    metode: 'Tunai',
    month: monthOf(t.tgl ?? ''),
  }
}

function mapReminder(r: BackendPengingat): Reminder {
  const status = r.status || 'Pending'
  const isTerkirim = status === 'Terkirim'
  const isGagal = status === 'Gagal'
  return {
    name: r.nama || r.name || '-',
    pkg: r.paket || r.pkg || '-',
    amount: r.nominal || r.amount || 'Rp 0',
    due: r.jatuh_tempo || r.due || '-',
    wa: r.wa || r.whatsapp || '',
    status,
    statusClass: r.statusClass || (isTerkirim ? 'bg-green-500/10 text-green-600' : isGagal ? 'bg-error-container text-on-error-container' : 'bg-tertiary-container/20 text-tertiary-container'),
  }
}

export interface SettingsData {
  general?: {
    company: string
    email: string
    phone: string
    address: string
    currency: string
    language: string
    timezone: string
  }
  invoicePrefix?: string
  dueDays?: string
  lateFee?: string
  autoReminder?: boolean
  waApi?: string
  waTemplate?: boolean
  smtpHost?: string
  smtpPort?: string
  backupAuto?: boolean
  backupFreq?: string
}

interface SettingsKeyMeta {
  field: string
  group?: 'general'
}

const SETTINGS_KEY_MAP: Record<string, SettingsKeyMeta> = {
  company: { field: 'company', group: 'general' },
  email: { field: 'email', group: 'general' },
  phone: { field: 'phone', group: 'general' },
  address: { field: 'address', group: 'general' },
  currency: { field: 'currency', group: 'general' },
  language: { field: 'language', group: 'general' },
  timezone: { field: 'timezone', group: 'general' },
  invoice_prefix: { field: 'invoicePrefix' },
  due_days: { field: 'dueDays' },
  late_fee: { field: 'lateFee' },
  auto_reminder: { field: 'autoReminder' },
  wa_api: { field: 'waApi' },
  wa_template: { field: 'waTemplate' },
  smtp_host: { field: 'smtpHost' },
  smtp_port: { field: 'smtpPort' },
  backup_auto: { field: 'backupAuto' },
  backup_freq: { field: 'backupFreq' },
}

function mapSettings(rows: BackendProfil[]): SettingsData {
  const settings: SettingsData = { general: {} as SettingsData['general'] }
  for (const row of rows) {
    const meta = SETTINGS_KEY_MAP[row.key]
    if (!meta) continue
    let value: string | boolean = row.value
    if (meta.field === 'autoReminder' || meta.field === 'waTemplate' || meta.field === 'backupAuto') {
      value = row.value === 'true' || row.value === '1'
    }
    if (meta.group === 'general') {
      ;(settings.general as Record<string, string | boolean>)[meta.field as string] = String(value)
    } else {
      ;(settings as unknown as Record<string, string | boolean>)[meta.field as string] = value
    }
  }
  return settings
}
