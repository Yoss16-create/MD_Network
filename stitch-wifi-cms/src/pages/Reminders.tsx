import { useEffect, useState } from 'react'
import { useData } from '../context/DataContext'
import * as api from '../services/api'
import type { Reminder } from '../services/api'

export default function Reminders() {

  const { customers } = useData()

console.log(customers)
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [editingTemplate, setEditingTemplate] = useState(false)
  const [templateMsg, setTemplateMsg] = useState(
    `Halo *[Nama]*,\n\nKami dari *MD_Network* ingin mengingatkan bahwa tagihan internet Anda akan segera jatuh tempo.\n\n📦 Paket: *[Paket]*\n💰 Nominal: *[Nominal]*\n📅 Jatuh Tempo: *[Jatuh Tempo]*\n\nSilakan lakukan pembayaran sebelum jatuh tempo untuk menghindari pemutusan layanan.\n\nTerima kasih,\n*MD_Network*`
  )
  const [showAddReminder, setShowAddReminder] = useState(false)
  const [showSendOptions, setShowSendOptions] = useState(false)
  const [showBusinessConfig, setShowBusinessConfig] = useState(false)
  const [businessConfig, setBusinessConfig] = useState({ apiKey: '', apiUrl: '', sending: false, results: [] as string[], activeTarget: '' })
  const [addForm, setAddForm] = useState({ name: '', pkg: 'WiFi Family (20 Mbps)', amount: '', wa: '' })

  const [reminders, setReminders] = useState<Reminder[]>([
    { name: 'Budi Santoso', pkg: 'Home-Pro 50Mbps', amount: 'Rp 350.000', due: 'Besok', wa: '08123456789', status: 'Pending', statusClass: 'bg-tertiary-container/20 text-tertiary-container' },
    { name: 'Siti Rahayu', pkg: 'Ultra-Net 100Mbps', amount: 'Rp 750.000', due: '2 Hari Lagi', wa: '08198765432', status: 'Pending', statusClass: 'bg-tertiary-container/20 text-tertiary-container' },
    { name: 'Agus Pratama', pkg: 'Basic-Lite 20Mbps', amount: 'Rp 175.000', due: '3 Hari Lagi', wa: '08112233445', status: 'Pending', statusClass: 'bg-tertiary-container/20 text-tertiary-container' },
    { name: 'Rian Hidayat', pkg: 'Home-Pro 50Mbps', amount: 'Rp 350.000', due: '20 Mei 2024', wa: '08155667788', status: 'Pending', statusClass: 'bg-tertiary-container/20 text-tertiary-container' },
    { name: 'Lestari Wijaya', pkg: 'Basic-Lite 20Mbps', amount: 'Rp 175.000', due: '18 Mei 2024', wa: '08133445566', status: 'Pending', statusClass: 'bg-tertiary-container/20 text-tertiary-container' },
  ])

  useEffect(() => {
    api.getReminders()
      .then(res => {
        if (res.reminders) setReminders(res.reminders)
      })
      .catch(err => console.warn('[Reminders] Backend tidak tersedia, memakai data lokal:', err))
  }, [])

  const buildText = (r: Reminder) => templateMsg
    .replace('[Nama]', r.name)
    .replace('[Paket]', r.pkg)
    .replace('[Nominal]', r.amount)
    .replace('[Jatuh Tempo]', r.due)

  const getWALink = (r: Reminder) => {
    const phone = r.wa.startsWith('62') ? r.wa : `62${r.wa.slice(1)}`
    return `https://wa.me/${phone}?text=${encodeURIComponent(buildText(r))}`
  }

  const persistStatus = (name: string, status: string, statusClass: string) => {
    api.updateReminder(name, { status, statusClass })
      .catch(err => console.warn('[Reminders] Gagal sinkron status ke backend:', err))
  }

  const sendBusiness = async (r: Reminder): Promise<boolean> => {
    const to = r.wa.startsWith('62') ? r.wa : `62${r.wa.slice(1)}`
    try {
      await api.sendWhatsApp({ to, message: buildText(r) })
      return true
    } catch (err) {
      console.warn('[Reminders] Backend sendWhatsApp gagal, fallback ke API langsung:', err)
      if (!businessConfig.apiUrl || !businessConfig.apiKey) return false
      try {
        const res = await fetch(businessConfig.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${businessConfig.apiKey}` },
          body: JSON.stringify({ to, message: buildText(r) })
        })
        return res.ok
      } catch {
        return false
      }
    }
  }

  const toggleStatus = (r: Reminder) => {
    const next = r.status === 'Gagal'
      ? { status: 'Pending', statusClass: 'bg-tertiary-container/20 text-tertiary-container' }
      : { status: 'Gagal', statusClass: 'bg-error-container text-on-error-container' }
    setReminders(prev => prev.map(item => item.name === r.name ? { ...item, ...next } : item))
    persistStatus(r.name, next.status, next.statusClass)
  }

  const sendMassReminder = () => {
    const pending = reminders.filter(r => r.status === 'Pending')
    if (pending.length === 0) { alert('Semua pengingat sudah terkirim!'); return }
    setShowSendOptions(true)
  }

  const handleFreeSendMass = () => {
    const pending = reminders.filter(r => r.status === 'Pending')
    if (confirm(`Buka WhatsApp untuk ${pending.length} pelanggan?`)) {
      pending.forEach((r, i) => setTimeout(() => window.open(getWALink(r), '_blank'), i * 1000))
      setReminders(prev => prev.map(item =>
        item.status === 'Pending' ? { ...item, status: 'Terkirim', statusClass: 'bg-green-500/10 text-green-600' } : item
      ))
      pending.forEach(r => persistStatus(r.name, 'Terkirim', 'bg-green-500/10 text-green-600'))
    }
    setShowSendOptions(false)
  }

  const handleBusinessSendMass = async () => {
    const pending = reminders.filter(r => r.status === 'Pending')
    if (!businessConfig.apiUrl || !businessConfig.apiKey) {
      alert('Harap isi API Key dan API URL terlebih dahulu!')
      return
    }
    setBusinessConfig(prev => ({ ...prev, sending: true, results: [], activeTarget: `Mengirim ke ${pending.length} pelanggan...` }))
    const results: string[] = []
    for (const r of pending) {
      const ok = await sendBusiness(r)
      if (ok) {
        results.push(`✅ ${r.name} - Terkirim`)
        setReminders(prev => prev.map(item => item.name === r.name ? { ...item, status: 'Terkirim', statusClass: 'bg-green-500/10 text-green-600' } : item))
        persistStatus(r.name, 'Terkirim', 'bg-green-500/10 text-green-600')
      } else {
        results.push(`❌ ${r.name} - Gagal`)
        setReminders(prev => prev.map(item => item.name === r.name ? { ...item, status: 'Gagal', statusClass: 'bg-error-container text-on-error-container' } : item))
        persistStatus(r.name, 'Gagal', 'bg-error-container text-on-error-container')
      }
      setBusinessConfig(prev => ({ ...prev, activeTarget: `${r.name} selesai`, results: [...results] }))
    }
    setBusinessConfig(prev => ({ ...prev, sending: false, activeTarget: 'Semua selesai!' }))
    setShowSendOptions(false)
  }

  const handleFreeSendIndividual = (r: Reminder) => {
    window.open(getWALink(r), '_blank')
    setReminders(prev => prev.map(item => item.name === r.name ? { ...item, status: 'Terkirim', statusClass: 'bg-green-500/10 text-green-600' } : item))
    persistStatus(r.name, 'Terkirim', 'bg-green-500/10 text-green-600')
  }

  const handleBusinessSendIndividual = async (r: Reminder) => {
    if (!businessConfig.apiUrl || !businessConfig.apiKey) {
      setShowBusinessConfig(true)
      return
    }
    const ok = await sendBusiness(r)
    if (ok) {
      setReminders(prev => prev.map(item => item.name === r.name ? { ...item, status: 'Terkirim', statusClass: 'bg-green-500/10 text-green-600' } : item))
      persistStatus(r.name, 'Terkirim', 'bg-green-500/10 text-green-600')
      alert(`Pesan terkirim ke ${r.name}!`)
    } else {
      alert(`Gagal mengirim ke ${r.name}`)
    }
  }

  const resendFailed = () => {
    const f = reminders.filter(r => r.status === 'Gagal')
    if (f.length === 0) { alert('Tidak ada pengingat gagal!'); return }
    if (confirm(`Kirim ulang ${f.length} pengingat gagal?`)) {
      f.forEach((r, i) => setTimeout(() => window.open(getWALink(r), '_blank'), i * 1000))
      setReminders(prev => prev.map(item =>
        item.status === 'Gagal' ? { ...item, status: 'Terkirim', statusClass: 'bg-green-500/10 text-green-600' } : item
      ))
      f.forEach(r => persistStatus(r.name, 'Terkirim', 'bg-green-500/10 text-green-600'))
    }
  }

  const exportReminders = () => {
    const csv = 'Pelanggan,Paket,Nominal,Jatuh Tempo,WhatsApp,Status\n' +
      filtered.map(r => `"${r.name}","${r.pkg}","${r.amount}","${r.due}","${r.wa}","${r.status}"`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'Data_Pengingat.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const saveTemplate = () => {
    setEditingTemplate(false)
    alert('Template pesan berhasil disimpan!')
  }

  const addReminder = () => {
    const newReminder: Reminder = {
      name: addForm.name, pkg: addForm.pkg, amount: 'Rp ' + Number(addForm.amount || 0).toLocaleString('id-ID'),
      due: '-', wa: addForm.wa, status: 'Pending', statusClass: 'bg-tertiary-container/20 text-tertiary-container'
    }
    setReminders(prev => [...prev, newReminder])
    api.addReminder(newReminder).catch(err => console.warn('[Reminders] Gagal simpan pengingat ke backend:', err))
    setShowAddReminder(false)
    setAddForm({ name: '', pkg: 'WiFi Family (20 Mbps)', amount: '', wa: '' })
  }

  const pending = reminders.filter(r => r.status === 'Pending').length
  const sent = reminders.filter(r => r.status === 'Terkirim').length
  const failed = reminders.filter(r => r.status === 'Gagal').length

  const filtered = (activeTab === 'all' ? reminders
    : activeTab === 'sent' ? reminders.filter(r => r.status === 'Terkirim')
    : activeTab === 'failed' ? reminders.filter(r => r.status === 'Gagal')
    : reminders.filter(r => r.status === 'Pending'))
    .filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface">
  Pengingat & Notifikasi
</h2>

<p className="text-sm text-secondary mt-1">
  Kirim pengingat tagihan langsung ke WhatsApp pelanggan.
</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={exportReminders} className="px-5 py-2.5 bg-surface-container-lowest border border-outline-variant text-secondary rounded-lg font-bold flex items-center gap-2 hover:bg-surface-container-low">
            <span className="material-symbols-outlined">download</span> Export
          </button>
          <button onClick={sendMassReminder} disabled={pending === 0} className="px-5 py-2.5 bg-primary text-on-primary rounded-lg font-bold flex items-center gap-2 shadow-md active:scale-95 disabled:opacity-50">
            <span className="material-symbols-outlined">send</span>
            {pending > 0 ? `Kirim ke ${pending} Pelanggan` : 'Semua Sudah Terkirim'}
          </button>
        </div>
      </div>

      {/* Stat Cards - clickable */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: 'campaign', color: 'bg-primary/10 text-primary', label: 'Total Pengingat', val: reminders.length, action: () => { setActiveTab('all'); setSearch('') } },
          { icon: 'check_circle', color: 'bg-green-500/10 text-green-600', label: 'Terkirim', val: sent, action: () => setActiveTab('sent') },
          { icon: 'schedule', color: 'bg-tertiary-container/10 text-tertiary-container', label: 'Pending', val: pending, action: () => setActiveTab('scheduled') },
          { icon: 'error', color: 'bg-error/10 text-error', label: 'Gagal', val: failed, action: () => setActiveTab('failed') },
        ].map((s) => (
          <div
  key={s.label}
  onClick={s.action}
  className="glass-card p-6 rounded-xl shadow-sm hover:border-primary/50 transition-colors group cursor-pointer"
>
  <div className="flex justify-center mb-3">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${s.color}`}>
      <span className="material-symbols-outlined text-[24px]">
        {s.icon}
      </span>
    </div>
  </div>

  <p className="text-center text-on-surface-variant text-[12px] font-semibold tracking-[0.05em] mb-1">
    {s.label}
  </p>

  <h3 className="text-center text-[22px] font-bold">
    {s.val}
  </h3>
</div>
        ))}
      </div>

      {/* Search + Add */}
<div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex-1 bg-surface-container-lowest px-3 py-2 rounded-lg border border-outline-variant shadow-sm flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">search</span>
          
          {search && <button onClick={() => setSearch('')} className="text-secondary hover:text-primary"><span className="material-symbols-outlined">close</span></button>}
        </div>
        <button onClick={() => setShowAddReminder(true)} className="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium flex items-center justify-center gap-2 shadow-md whitespace-nowrap">
          <span className="material-symbols-outlined">add</span> Tambah
        </button>
        {failed > 0 && (
          <button onClick={resendFailed} className="px-5 py-2.5 bg-amber-100 text-amber-700 rounded-lg font-bold flex items-center gap-2 hover:bg-amber-200 active:scale-95">
            <span className="material-symbols-outlined">refresh</span> Kirim Ulang ({failed})
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-outline-variant">
        <div className="flex gap-8 overflow-x-auto custom-scrollbar">
          {[
            { id: 'all', label: 'Semua Pengingat' },
            { id: 'scheduled', label: 'Pending', badge: pending },
            { id: 'sent', label: 'Terkirim' },
            { id: 'failed', label: 'Gagal' },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-1 py-4 border-b-2 whitespace-nowrap text-[14px] flex items-center gap-2 ${activeTab === t.id ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-primary'}`}>
              {t.label}
              {typeof t.badge === 'number' && t.badge > 0 && <span className="bg-tertiary-container/20 text-tertiary-container text-[10px] px-1.5 py-0.5 rounded-full">{t.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Reminder Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
  {filtered.map((r) => (
    <div
      key={r.name}
      className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5 hover:shadow-md transition"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
              r.status === 'Terkirim'
                ? 'bg-green-100 text-green-700'
                : r.status === 'Gagal'
                ? 'bg-error/10 text-error'
                : 'bg-primary/10 text-primary'
            }`}
          >
            {r.name
              .split(' ')
              .map(w => w[0])
              .join('')}
          </div>

          <div>
            <h4 className="font-bold text-sm">{r.name}</h4>
            <p className="text-xs text-secondary">{r.wa}</p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.statusClass}`}>
          {r.status}
        </span>
      </div>


      {/* Detail */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-secondary">Paket</span>
          <span className="font-semibold">{r.pkg}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-secondary">Nominal</span>
          <span className="font-bold">{r.amount}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-secondary">Jatuh Tempo</span>
          <span className="text-error font-semibold">{r.due}</span>
        </div>
      </div>


      {/* Action */}
      <div className="flex gap-2 mt-5 pt-4 border-t border-outline-variant">

        {r.status === 'Pending' && (
          <>
            <button
              onClick={() => handleFreeSendIndividual(r)}
              className="flex-1 py-2 rounded-lg bg-green-500/10 text-green-600 text-sm font-bold"
            >
              Kirim WA
            </button>

            <button
              onClick={() => handleBusinessSendIndividual(r)}
              className="px-3 rounded-lg bg-blue-500/10 text-blue-600"
            >
              <span className="material-symbols-outlined text-sm">
                bolt
              </span>
            </button>
          </>
        )}

        {(r.status === 'Terkirim' || r.status === 'Gagal') && (
          <button
            onClick={() => handleFreeSendIndividual(r)}
            className="flex-1 py-2 rounded-lg bg-green-500/10 text-green-600 text-sm font-bold"
          >
            Kirim Ulang
          </button>
        )}

        <button
          onClick={() => toggleStatus(r)}
          className="px-3 rounded-lg bg-primary/10 text-primary"
        >
          <span className="material-symbols-outlined text-sm">
            swap_horiz
          </span>
        </button>

      </div>

    </div>
  ))}
</div>

<div className="mt-4 text-sm text-secondary">
  Menampilkan {filtered.length} dari {reminders.length} pengingat
</div>

      {/* Template Pesan - Editable */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[16px] font-semibold text-on-surface">Template Pesan WhatsApp</h3>
          <button onClick={() => setEditingTemplate(!editingTemplate)} className="text-[12px] text-primary font-medium hover:underline">
            {editingTemplate ? 'Batal Edit' : 'Edit Template'}
          </button>
        </div>
        {editingTemplate ? (
          <div className="space-y-3">
            <textarea value={templateMsg} onChange={e => setTemplateMsg(e.target.value)} rows={8} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[13px] outline-none resize-none font-mono leading-relaxed" />
            <div className="flex items-center gap-2 text-[11px] text-secondary mb-2">
              <span>Gunakan:</span>
              <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[11px]">[Nama]</code>
              <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[11px]">[Paket]</code>
              <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[11px]">[Nominal]</code>
              <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[11px]">[Jatuh Tempo]</code>
            </div>
            <button onClick={saveTemplate} className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90">Simpan Template</button>
          </div>
        ) : (
          <div className="bg-surface-container-low p-4 rounded-lg text-[13px] text-on-surface-variant whitespace-pre-wrap leading-relaxed select-all">{templateMsg}</div>
        )}
      </div>

      {/* Modal Tambah Pengingat */}
      {showAddReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowAddReminder(false)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-outline-variant flex items-center justify-between"><h3 className="text-[20px] font-semibold">Tambah Pengingat</h3><button onClick={() => setShowAddReminder(false)} className="p-1"><span className="material-symbols-outlined text-on-surface-variant">close</span></button></div>
            <div className="p-6 space-y-4">
              <div><label className="block text-[12px] font-semibold text-secondary uppercase mb-2">Nama Pelanggan *</label><input value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] outline-none" placeholder="Nama pelanggan" /></div>
              <div><label className="block text-[12px] font-semibold text-secondary uppercase mb-2">Paket</label><select value={addForm.pkg} onChange={e => setAddForm({ ...addForm, pkg: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] outline-none"><option>WiFi Basic (10 Mbps)</option><option>WiFi Family (20 Mbps)</option><option>WiFi Pro (50 Mbps)</option><option>Ultra-Net (100 Mbps)</option></select></div>
              <div className="grid grid-cols-2 gap-4"><div><label className="block text-[12px] font-semibold text-secondary uppercase mb-2">Nominal (Rp)</label><input type="number" value={addForm.amount} onChange={e => setAddForm({ ...addForm, amount: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] outline-none" placeholder="350000" /></div><div><label className="block text-[12px] font-semibold text-secondary uppercase mb-2">WhatsApp *</label><input value={addForm.wa} onChange={e => setAddForm({ ...addForm, wa: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] outline-none" placeholder="08123456789" /></div></div>
              <div className="flex gap-3 pt-2"><button onClick={() => setShowAddReminder(false)} className="flex-1 py-3 border border-outline-variant text-secondary rounded-xl font-bold">Batal</button><button onClick={addReminder} disabled={!addForm.name || !addForm.wa} className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-bold disabled:opacity-50">Simpan</button></div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pilih Metode Pengiriman */}
      {showSendOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowSendOptions(false)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-outline-variant"><h3 className="text-[18px] font-semibold text-on-surface">Pilih Metode Pengiriman</h3><p className="text-[13px] text-secondary mt-1">Kirim ke {reminders.filter(r => r.status === 'Pending').length} pelanggan</p></div>
            <div className="p-6 space-y-3">
              <button onClick={handleFreeSendMass} className="w-full py-4 border border-outline-variant rounded-xl font-bold text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-4 px-5">
                <span className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0"><span className="material-symbols-outlined">send</span></span>
                <div className="text-left flex-1">
                  <p className="text-[14px]">WhatsApp Gratis</p>
                  <p className="text-[11px] text-secondary font-normal">Buka tab WA satu per satu, klik kirim manual. Tidak ada biaya.</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </button>
              <button onClick={handleBusinessSendMass} className="w-full py-4 border border-outline-variant rounded-xl font-bold text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-4 px-5">
                <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0"><span className="material-symbols-outlined">bolt</span></span>
                <div className="text-left flex-1">
                  <p className="text-[14px]">WhatsApp Business API</p>
                  <p className="text-[11px] text-secondary font-normal">Kirim otomatis via API. Butuh API Key & URL. Berbayar ~Rp 500/percakapan.</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </button>
              <button onClick={() => setShowSendOptions(false)} className="w-full py-3 bg-surface-container-low rounded-xl font-bold text-secondary hover:bg-surface-container-high mt-2">Batal</button>
            </div>
            {/* Business API Config */}
            <div className="px-6 pb-6">
              <div className="border-t border-outline-variant pt-4 mt-1">
                <p className="text-[12px] font-semibold text-secondary uppercase mb-3">Konfigurasi Business API</p>
                <div className="space-y-3">
                  <input value={businessConfig.apiUrl} onChange={e => setBusinessConfig(prev => ({ ...prev, apiUrl: e.target.value }))} className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-[13px] outline-none" placeholder="API URL (https://api.whatsapp.com/...)" />
                  <input value={businessConfig.apiKey} onChange={e => setBusinessConfig(prev => ({ ...prev, apiKey: e.target.value }))} type="password" className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-[13px] outline-none" placeholder="API Key / Token" />
                </div>
              </div>
            </div>
            {/* Status pengiriman API */}
            {businessConfig.results.length > 0 && (
              <div className="px-6 pb-6">
                <div className="bg-surface-container-low rounded-xl p-3 max-h-40 overflow-y-auto space-y-1">
                  {businessConfig.results.map((r, i) => <p key={i} className="text-[12px]">{r}</p>)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Konfigurasi Business API */}
      {showBusinessConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowBusinessConfig(false)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-outline-variant">
              <h3 className="text-[18px] font-semibold text-on-surface">Konfigurasi WhatsApp Business API</h3>
              <p className="text-[13px] text-secondary mt-1">Isi kredensial API untuk pengiriman otomatis</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">API URL</label>
                <input value={businessConfig.apiUrl} onChange={e => setBusinessConfig(prev => ({ ...prev, apiUrl: e.target.value }))} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[13px] outline-none" placeholder="https://graph.facebook.com/v17.0/PHONE_ID/messages" />
                <p className="text-[11px] text-secondary mt-1">Endpoint WhatsApp Cloud API dari Meta</p>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Access Token</label>
                <input value={businessConfig.apiKey} onChange={e => setBusinessConfig(prev => ({ ...prev, apiKey: e.target.value }))} type="password" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[13px] outline-none" placeholder="EAAx..." />
                <p className="text-[11px] text-secondary mt-1">Token akses permanen dari Meta Business</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800">
                <strong>ℹ️ Cara mendapatkan:</strong> Daftar di <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Meta for Developers</a> → WhatsApp → Quick Start → dapatkan Phone ID + Token.
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowBusinessConfig(false)} className="flex-1 py-3 border border-outline-variant text-secondary rounded-xl font-bold">Batal</button>
                <button onClick={() => { setShowBusinessConfig(false); alert('Konfigurasi disimpan!') }} disabled={!businessConfig.apiUrl || !businessConfig.apiKey} className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 disabled:opacity-50">Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
