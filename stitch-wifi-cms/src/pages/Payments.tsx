
import { useState } from 'react'
import { useData } from '../context/DataContext'

const formatRupiah = (n: number) => 'Rp ' + n.toLocaleString('id-ID')

export default function Payments() {
  const { payments: sharedPayments } = useData()
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedPay, setSelectedPay] = useState<typeof sharedPayments[0] | null>(null)
  const [showRecordPayment, setShowRecordPayment] = useState(false)
  const [recordForm, setRecordForm] = useState({ name: '', method: 'Transfer Bank', bank: 'BCA', amount: '', invoiceNo: '' })

  const payments = sharedPayments

  const filtered = (activeTab === 'all' ? payments : payments.filter(p => p.method === activeTab))
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.no.toLowerCase().includes(search.toLowerCase()))
    .filter(p => !filterStatus || p.status === filterStatus)

  const totalSukses = payments.filter(p => p.status === 'Lunas').length
  const totalPending = payments.filter(p => p.status === 'Pending').length
  const totalGagal = payments.filter(p => p.status === 'Gagal').length
  const totalNominal = payments.filter(p => p.status === 'Lunas').reduce((s, p) => s + p.amount, 0)

  const recordPayment = () => {
    alert(`Pembayaran berhasil dicatat!\n\nPelanggan: ${recordForm.name}\nInvoice: ${recordForm.invoiceNo}\nMetode: ${recordForm.method} (${recordForm.bank})\nNominal: Rp ${Number(recordForm.amount).toLocaleString('id-ID')}`)
    setShowRecordPayment(false)
    setRecordForm({ name: '', method: 'Transfer Bank', bank: 'BCA', amount: '', invoiceNo: '' })
  }

  const exportPayments = () => {
    const csv = 'No.Transaksi,Pelanggan,Metode,Bank,Nominal,Tanggal,Status\n' + filtered.map(p => `"${p.no}","${p.name}","${p.method}","${p.bank}","${p.amount}","${p.date}","${p.status}"`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'Data_Pembayaran.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const printReceipt = (p: typeof sharedPayments[0]) => {
    const w = window.open('', '_blank', 'width=400,height=600')
    if (w) {
      w.document.write(`<html><head><title>Kwitansi ${p.no}</title><style>body{font-family:sans-serif;max-width:350px;margin:0 auto;padding:20px;color:#1e293b}h1{font-size:18px;text-align:center}.sub{text-align:center;font-size:11px;color:#64748b}.r{display:flex;justify-content:space-between;padding:8px 0;font-size:13px;border-bottom:1px solid #e2e8f0}.r .l{color:#64748b}.r .v{font-weight:600;text-align:right}.t{border-top:2px solid #3525cd;margin-top:10px;padding-top:10px;font-size:16px}.s{text-align:center;padding:6px 12px;border-radius:20px;font-size:11px;font-weight:700;margin:15px auto;display:inline-block}.f{text-align:center;font-size:10px;color:#94a3b8;margin-top:30px}@media print{body{padding:10px}}</style></head><body><h1>MD_Network</h1><div class="sub">Kwitansi Pembayaran</div><div class="r"><span class="l">No. Transaksi</span><span class="v">${p.no}</span></div><div class="r"><span class="l">Invoice</span><span class="v">${p.invoiceNo}</span></div><div class="r"><span class="l">Pelanggan</span><span class="v">${p.name}</span></div><div class="r"><span class="l">Metode</span><span class="v">${p.method} (${p.bank})</span></div><div class="r"><span class="l">Tanggal</span><span class="v">${p.date}, ${p.time}</span></div><div class="r"><span class="l">Petugas</span><span class="v">${p.officer}</span></div><div class="r t"><span class="l">Total</span><span class="v" style="color:#3525cd;font-size:18px">${formatRupiah(p.amount)}</span></div><div style="text-align:center"><span class="s" style="background:${p.status === 'Lunas' ? '#dcfce7' : '#fff3e0'};color:${p.status === 'Lunas' ? '#16a34a' : '#e65100'}">${p.status}</span></div><div class="f">Terima kasih<br>MD_Network</div><script>setTimeout(()=>window.print(),300)</script></body></html>`)
      w.document.close()
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div><h2 className="text-[32px] font-bold text-on-surface">Semua Pembayaran</h2><p className="text-secondary text-base">Pantau seluruh transaksi pembayaran pelanggan Anda.</p></div>
        <div className="flex gap-3">
          <button onClick={exportPayments} className="px-5 py-2.5 bg-surface-container-lowest border border-outline-variant text-secondary rounded-lg font-bold flex items-center gap-2 hover:bg-surface-container-low">
            <span className="material-symbols-outlined">download</span> Export
          </button>
          <button onClick={() => setShowRecordPayment(true)} className="px-5 py-2.5 bg-primary text-on-primary rounded-lg font-bold flex items-center gap-2 shadow-md active:scale-95">
            <span className="material-symbols-outlined">add_card</span> Catat Pembayaran
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="flex-1 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm flex items-center gap-3">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
          <input value={search} onChange={e => setSearch(e.target.value)} className="flex-1 border-none bg-transparent outline-none text-base" placeholder="Cari transaksi atau pelanggan..." />
          {search && <button onClick={() => setSearch('')} className="text-secondary hover:text-primary"><span className="material-symbols-outlined">close</span></button>}
        </div>
        {filterStatus && (
          <div className="bg-primary/10 text-primary px-4 rounded-xl border border-primary/20 flex items-center gap-2 text-[13px] font-medium">
            <span className="material-symbols-outlined text-sm">filter_alt</span>
            {filterStatus === 'Lunas' ? 'Sukses' : filterStatus}
            <button onClick={() => setFilterStatus('')} className="hover:text-primary"><span className="material-symbols-outlined text-sm">close</span></button>
          </div>
        )}
      </div>

      {/* Stat Cards - clickable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: 'payments', color: 'bg-primary/10 text-primary', label: 'Total Pembayaran', val: formatRupiah(totalNominal), action: () => { setFilterStatus(''); setSearch(''); setActiveTab('all') } },
          { icon: 'check_circle', color: 'bg-green-500/10 text-green-600', label: 'Sukses', val: totalSukses, action: () => { setFilterStatus('Lunas'); setSearch(''); setActiveTab('all') } },
          { icon: 'pending_actions', color: 'bg-tertiary-container/10 text-tertiary-container', label: 'Pending', val: totalPending, action: () => { setFilterStatus('Pending'); setSearch(''); setActiveTab('all') } },
          { icon: 'cancel', color: 'bg-error/10 text-error', label: 'Gagal', val: totalGagal, action: () => { setFilterStatus('Gagal'); setSearch(''); setActiveTab('all') } },
        ].map((s) => (
          <div key={s.label} onClick={s.action} className="glass-card p-6 rounded-xl shadow-sm hover:border-primary/50 transition-colors group cursor-pointer">
            <div className="flex items-start mb-3"><div className={`w-10 h-10 rounded-full flex items-center justify-center ${s.color}`}><span className="material-symbols-outlined">{s.icon}</span></div></div>
            <p className="text-on-surface-variant text-[12px] font-semibold tracking-[0.05em] mb-1">{s.label}</p>
            <h3 className="text-[20px] font-semibold">{s.val}</h3>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-outline-variant">
        <div className="flex gap-8 overflow-x-auto custom-scrollbar">
          {[{ id: 'all', label: 'Semua' }, { id: 'Transfer Bank', label: 'Transfer Bank' }, { id: 'QRIS', label: 'QRIS / E-Wallet' }, { id: 'Tunai', label: 'Tunai' }].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-1 py-4 border-b-2 whitespace-nowrap text-[14px] ${activeTab === t.id ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-primary'}`}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low"><tr>
              <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">No. Transaksi</th>
              <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Pelanggan</th>
              <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Metode</th>
              <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Bank/E-Wallet</th>
              <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Nominal</th>
              <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Tanggal</th>
              <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Status</th>
              <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Action</th>
            </tr></thead>
            <tbody className="divide-y divide-outline-variant">
              {filtered.map((p) => (
                <tr key={p.no} onClick={() => setSelectedPay(p)} className="hover:bg-surface-container-low/50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-bold text-primary">{p.no}</td>
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{p.initials}</div><span className="font-bold text-[14px]">{p.name}</span></div></td>
                  <td className="px-6 py-4 text-[14px]">{p.method}</td><td className="px-6 py-4 text-[14px]">{p.bank}</td><td className="px-6 py-4 font-bold">{formatRupiah(p.amount)}</td><td className="px-6 py-4 text-[14px]">{p.date}</td>
                  <td className="px-6 py-4"><span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${p.statusClass}`}>{p.status}</span></td>
                  <td className="px-6 py-4"><div className="flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); printReceipt(p) }} className="p-2 hover:bg-primary/10 rounded-lg text-primary"><span className="material-symbols-outlined text-sm">receipt_long</span></button>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedPay(p) }} className="p-2 hover:bg-primary/10 rounded-lg text-primary"><span className="material-symbols-outlined text-sm">visibility</span></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between">
          <span className="text-[14px]">Menampilkan {filtered.length} dari {payments.length} transaksi</span>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSelectedPay(null)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-outline-variant flex items-center justify-between shrink-0"><h3 className="text-[20px] font-semibold">Detail Pembayaran</h3><button onClick={() => setSelectedPay(null)} className="p-1"><span className="material-symbols-outlined text-on-surface-variant">close</span></button></div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-center"><span className={`inline-flex items-center px-4 py-2 rounded-full text-[13px] font-bold ${selectedPay.statusClass}`}>{selectedPay.status}</span></div>
              <div className="bg-surface-container-low rounded-xl p-4 space-y-3 text-[14px]">
                <div className="flex justify-between"><span className="text-secondary">No. Transaksi</span><span className="font-bold text-primary">{selectedPay.no}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Invoice</span><span className="font-semibold">{selectedPay.invoiceNo}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Pelanggan</span><span className="font-semibold">{selectedPay.name}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Metode</span><span className="font-semibold">{selectedPay.method} ({selectedPay.bank})</span></div>
                <div className="flex justify-between"><span className="text-secondary">Tanggal</span><span className="font-semibold">{selectedPay.date}, {selectedPay.time}</span></div>
                <div className="border-t border-outline-variant pt-3 flex justify-between"><span className="text-secondary">Jumlah</span><span className="text-[22px] font-bold">{formatRupiah(selectedPay.amount)}</span></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { printReceipt(selectedPay); setSelectedPay(null) }} className="flex-1 py-3 border border-outline-variant text-secondary rounded-xl font-bold">Cetak Kwitansi</button>
                <button onClick={() => setSelectedPay(null)} className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-bold">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showRecordPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowRecordPayment(false)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-outline-variant flex items-center justify-between"><h3 className="text-[20px] font-semibold">Catat Pembayaran Baru</h3><button onClick={() => setShowRecordPayment(false)} className="p-1"><span className="material-symbols-outlined text-on-surface-variant">close</span></button></div>
            <div className="p-6 space-y-4">
              <div><label className="block text-[12px] font-semibold text-secondary uppercase mb-2">Nama Pelanggan *</label><input value={recordForm.name} onChange={e => setRecordForm({ ...recordForm, name: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] outline-none" placeholder="Nama pelanggan" /></div>
              <div><label className="block text-[12px] font-semibold text-secondary uppercase mb-2">No. Invoice</label><input value={recordForm.invoiceNo} onChange={e => setRecordForm({ ...recordForm, invoiceNo: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] outline-none" placeholder="INV-00999" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[12px] font-semibold text-secondary uppercase mb-2">Metode</label><select value={recordForm.method} onChange={e => setRecordForm({ ...recordForm, method: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] outline-none"><option>Transfer Bank</option><option>QRIS</option><option>Tunai</option></select></div>
                <div><label className="block text-[12px] font-semibold text-secondary uppercase mb-2">Bank/E-Wallet</label><input value={recordForm.bank} onChange={e => setRecordForm({ ...recordForm, bank: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] outline-none" placeholder="BCA, GoPay" /></div>
              </div>
              <div><label className="block text-[12px] font-semibold text-secondary uppercase mb-2">Nominal (Rp) *</label><input type="number" value={recordForm.amount} onChange={e => setRecordForm({ ...recordForm, amount: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] outline-none" placeholder="350000" /></div>
              <div className="flex gap-3 pt-2"><button onClick={() => setShowRecordPayment(false)} className="flex-1 py-3 border border-outline-variant text-secondary rounded-xl font-bold">Batal</button><button onClick={recordPayment} disabled={!recordForm.name || !recordForm.amount} className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-bold disabled:opacity-50">Simpan</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
