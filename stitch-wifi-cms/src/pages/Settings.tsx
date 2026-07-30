
import { useState } from 'react'

export default function Settings() {
  const [general, setGeneral] = useState({
    company: 'MD_Network',
    email: 'admin@mdnetwork.co.id',
    phone: '081234567890',
    address: 'Jl. Raya Internet No. 45, Jakarta Pusat',
    currency: 'IDR',
    language: 'id',
    timezone: 'WIB',
  })

  const [invoicePrefix, setInvoicePrefix] = useState('INV')
  const [dueDays, setDueDays] = useState('7')
  const [lateFee, setLateFee] = useState('2')
  const [autoReminder, setAutoReminder] = useState(true)

  const [waApi, setWaApi] = useState('')
  const [waTemplate, setWaTemplate] = useState(true)
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com')
  const [smtpPort, setSmtpPort] = useState('587')

  const [backupAuto, setBackupAuto] = useState(true)
  const [backupFreq, setBackupFreq] = useState('daily')
  const [saved, setSaved] = useState('')

  const handleSave = (section: string) => {
    setSaved(section)
    setTimeout(() => setSaved(''), 3000)
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1100px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[32px] font-bold tracking-[-0.02em] text-on-surface">Pengaturan</h2>
          <p className="text-secondary text-base">Konfigurasi sistem, tagihan, notifikasi, dan backup data.</p>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[20px] font-semibold text-on-surface flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">settings</span> Informasi Perusahaan
          </h3>
          {saved === 'general' && <span className="text-[12px] font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">Tersimpan!</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Nama Perusahaan</label>
            <input value={general.company} onChange={e => setGeneral({ ...general, company: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Email Perusahaan</label>
            <input value={general.email} onChange={e => setGeneral({ ...general, email: e.target.value })} type="email" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Telepon</label>
            <input value={general.phone} onChange={e => setGeneral({ ...general, phone: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Mata Uang</label>
            <select value={general.currency} onChange={e => setGeneral({ ...general, currency: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none">
              <option value="IDR">Rupiah (IDR)</option><option value="USD">Dollar (USD)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Alamat</label>
            <textarea value={general.address} onChange={e => setGeneral({ ...general, address: e.target.value })} rows={2} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none resize-none" />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button onClick={() => handleSave('general')} className="px-6 py-3 bg-primary text-on-primary rounded-lg font-bold shadow-md hover:opacity-90 transition-all">Simpan</button>
        </div>
      </div>

      {/* Invoice Settings */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[20px] font-semibold text-on-surface flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">receipt_long</span> Pengaturan Tagihan
          </h3>
          {saved === 'invoice' && <span className="text-[12px] font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">Tersimpan!</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Prefix Invoice</label>
            <input value={invoicePrefix} onChange={e => setInvoicePrefix(e.target.value)} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Jatuh Tempo (hari)</label>
            <input type="number" value={dueDays} onChange={e => setDueDays(e.target.value)} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Denda Keterlambatan (%)</label>
            <input type="number" value={lateFee} onChange={e => setLateFee(e.target.value)} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none" />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`relative w-11 h-6 rounded-full transition-colors ${autoReminder ? 'bg-primary' : 'bg-surface-container-highest'}`} onClick={() => setAutoReminder(!autoReminder)}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${autoReminder ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <div>
                <p className="text-[14px] font-medium text-on-surface">Pengingat Otomatis</p>
                <p className="text-[11px] text-secondary">Kirim pengingat H-3 jatuh tempo</p>
              </div>
            </label>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button onClick={() => handleSave('invoice')} className="px-6 py-3 bg-primary text-on-primary rounded-lg font-bold shadow-md hover:opacity-90 transition-all">Simpan</button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[20px] font-semibold text-on-surface flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">notifications</span> Notifikasi & Integrasi
          </h3>
          {saved === 'notif' && <span className="text-[12px] font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">Tersimpan!</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">WhatsApp API Key</label>
            <input type="password" value={waApi} onChange={e => setWaApi(e.target.value)} placeholder="Masukkan API key WhatsApp Gateway" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none" />
            <p className="text-[11px] text-secondary mt-1">Gunakan WhatsApp Business API untuk pengiriman otomatis</p>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`relative w-11 h-6 rounded-full transition-colors ${waTemplate ? 'bg-primary' : 'bg-surface-container-highest'}`} onClick={() => setWaTemplate(!waTemplate)}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${waTemplate ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <div>
                <p className="text-[14px] font-medium text-on-surface">Template WhatsApp</p>
                <p className="text-[11px] text-secondary">Gunakan template pesan otomatis</p>
              </div>
            </label>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">SMTP Host</label>
            <input value={smtpHost} onChange={e => setSmtpHost(e.target.value)} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">SMTP Port</label>
            <input value={smtpPort} onChange={e => setSmtpPort(e.target.value)} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none" />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button onClick={() => handleSave('notif')} className="px-6 py-3 bg-primary text-on-primary rounded-lg font-bold shadow-md hover:opacity-90 transition-all">Simpan</button>
        </div>
      </div>

      {/* Backup & System */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[20px] font-semibold text-on-surface flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">cloud_upload</span> Backup & Sistem
          </h3>
          {saved === 'backup' && <span className="text-[12px] font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">Tersimpan!</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`relative w-11 h-6 rounded-full transition-colors ${backupAuto ? 'bg-primary' : 'bg-surface-container-highest'}`} onClick={() => setBackupAuto(!backupAuto)}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${backupAuto ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <div>
                <p className="text-[14px] font-medium text-on-surface">Backup Otomatis</p>
                <p className="text-[11px] text-secondary">Backup data secara berkala</p>
              </div>
            </label>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Frekuensi Backup</label>
            <select value={backupFreq} onChange={e => setBackupFreq(e.target.value)} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none">
              <option value="daily">Harian</option><option value="weekly">Mingguan</option><option value="monthly">Bulanan</option>
            </select>
          </div>
          <div className="md:col-span-2 flex gap-3 pt-4 border-t border-outline-variant">
            <button onClick={() => alert('Backup manual sedang diproses... Data berhasil di-backup!')} className="px-6 py-3 border border-primary text-primary rounded-lg font-bold hover:bg-primary/5 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined">cloud_upload</span> Backup Sekarang
            </button>
            <button onClick={() => { if (confirm('Reset semua pengaturan ke default?')) window.location.reload() }} className="px-6 py-3 border border-error text-error rounded-lg font-bold hover:bg-error/5 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined">restart_alt</span> Reset ke Default
            </button>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button onClick={() => handleSave('backup')} className="px-6 py-3 bg-primary text-on-primary rounded-lg font-bold shadow-md hover:opacity-90 transition-all">Simpan</button>
        </div>
      </div>
    </div>
  )
}
