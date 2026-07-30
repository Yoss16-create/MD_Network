
import { useState } from 'react'
import { useData, type InvoiceRecord } from '../context/DataContext'

export default function Billing() {
  const { invoices: sharedInvoices, setInvoices, addInvoice } = useData()
  const [activeTab, setActiveTab] = useState('all')
  const [selectedInv, setSelectedInv] = useState<InvoiceRecord | null>(null)
  const [showNewInvoice, setShowNewInvoice] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPeriod, setFilterPeriod] = useState('')
  const [filterSearch, setFilterSearch] = useState('')
  const [newForm, setNewForm] = useState({ name: '', pkg: 'WiFi Family (20 Mbps)', period: '', amount: '', due: '' })

  const invoices = sharedInvoices

  const createInvoice = () => {
    const nextNo = invoices.length + 1
    addInvoice({
      no: `#INV-2023${String(nextNo).padStart(4, '0')}`, customerId: '', name: newForm.name,
      initials: newForm.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      wa: '-', pkg: newForm.pkg, period: newForm.period, amount: Number(newForm.amount || 0), due: newForm.due,
      status: 'Belum Dibayar', statusClass: 'bg-error-container text-on-error-container', dotClass: 'bg-error',
      officer: 'Admin', paymentMethod: '-', paidDate: '-',
      history: [{ time: new Date().toLocaleDateString('id-ID'), action: 'Tagihan dibuat manual', user: 'Admin' }]
    })
    setShowNewInvoice(false)
    setNewForm({ name: '', pkg: 'WiFi Family (20 Mbps)', period: '', amount: '', due: '' })
  }

  const markAsPaid = (inv: InvoiceRecord) => {
    setInvoices(invoices.map(i => i.no === inv.no ? { ...i, status: 'Lunas', statusClass: 'bg-green-500/10 text-green-600', dotClass: 'bg-green-500', paymentMethod: 'Manual', paidDate: new Date().toLocaleDateString('id-ID') } : i))
  }

  const getWALink = (inv: InvoiceRecord) => {
    const phone = inv.wa.startsWith('62') ? inv.wa : `62${inv.wa.slice(1)}`
    return `https://wa.me/${phone}?text=${encodeURIComponent(`Halo *${inv.name}*, tagihan Anda ${inv.status}. Silakan bayar. -MD_Network`)}`
  }

  const printInvoice = (inv: InvoiceRecord) => {
    const w = window.open('', '_blank', 'width=450,height=700')
    if (w) {
      w.document.write(`
        <html><head><title>${inv.no}</title>
        <style>
          body{font-family:sans-serif;max-width:380px;margin:0 auto;padding:24px;color:#1e293b}
          .header{text-align:center;border-bottom:2px solid #3525cd;padding-bottom:16px;margin-bottom:20px}
          h1{font-size:20px;color:#3525cd;margin:0}
          .sub{font-size:11px;color:#64748b}
          .label{color:#64748b;font-size:12px;text-transform:uppercase;margin-bottom:2px}
          .val{font-weight:600;font-size:14px;margin-bottom:12px}
          .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:13px}
          .total{border-top:2px solid #3525cd;margin-top:16px;padding-top:12px;font-size:18px;font-weight:700}
          .status{display:inline-block;padding:6px 14px;border-radius:20px;font-size:11px;font-weight:700;margin:12px 0}
          .footer{text-align:center;font-size:10px;color:#94a3b8;margin-top:30px}
          @media print{body{padding:12px}}
        </style></head><body>
          <div class="header"><h1>MD_Network</h1><div class="sub">Invoice Tagihan Internet</div></div>
          <div class="label">No. Invoice</div><div class="val" style="color:#3525cd">${inv.no}</div>
          <div class="label">Pelanggan</div><div class="val">${inv.name}</div>
          <div class="label">ID Pelanggan</div><div class="val">${(inv as any).customerId || (inv as any).id || '-'}</div>
          <div class="row"><span>Paket</span><span>${inv.pkg}</span></div>
          <div class="row"><span>Periode</span><span>${inv.period}</span></div>
          <div class="row"><span>Jatuh Tempo</span><span style="color:#ba1a1a">${inv.due}</span></div>
          <div class="row total"><span>Total Tagihan</span><span style="color:#3525cd">Rp ${inv.amount.toLocaleString('id-ID')}</span></div>
          <div style="text-align:center"><span class="status" style="background:${inv.status === 'Lunas' ? '#dcfce7' : inv.status === 'Jatuh Tempo' ? '#fff3e0' : '#ffdad6'};color:${inv.status === 'Lunas' ? '#16a34a' : inv.status === 'Jatuh Tempo' ? '#e65100' : '#ba1a1a'}">${inv.status}</span></div>
          ${inv.status === 'Lunas' ? `<div class="row"><span>Metode Bayar</span><span>${inv.paymentMethod}</span></div><div class="row"><span>Tgl Bayar</span><span>${inv.paidDate}</span></div>` : ''}
          <div class="footer">Silakan lakukan pembayaran sebelum jatuh tempo<br>MD_Network - WiFi Business CMS</div>
          <script>setTimeout(()=>window.print(),300)</script>
        </body></html>
      `)
      w.document.close()
    }
  }

  const filtered = (activeTab === 'all' ? invoices
    : activeTab === 'unpaid' ? invoices.filter(i => i.status === 'Belum Dibayar')
    : activeTab === 'paid' ? invoices.filter(i => i.status === 'Lunas')
    : activeTab === 'history' ? invoices
    : invoices)
    .filter(i => !filterSearch || i.name.toLowerCase().includes(filterSearch.toLowerCase()) || i.no.toLowerCase().includes(filterSearch.toLowerCase()))
    .filter(i => !filterStatus || i.status === filterStatus)
    .filter(i => !filterPeriod || i.period === filterPeriod)

  const clearFilters = () => {
    setFilterStatus('')
    setFilterPeriod('')
    setFilterSearch('')
  }

  const totalUnpaid = invoices.filter(i => i.status === 'Belum Dibayar').length
  const totalOverdue = invoices.filter(i => i.status === 'Jatuh Tempo').length
  const totalPaid = invoices.filter(i => i.status === 'Lunas').length

  return (
    <>
      <div className="p-4 md:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-[32px] font-bold tracking-[-0.02em] text-on-surface">Semua Tagihan</h2>
            <p className="text-secondary text-base">Kelola seluruh penagihan bulanan pelanggan internet Anda.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowFilter(!showFilter)} className="px-5 py-2.5 bg-surface-container-lowest border border-outline-variant text-secondary rounded-lg font-bold flex items-center gap-2 hover:bg-surface-container-low transition-all">
              <span className="material-symbols-outlined">filter_list</span> Filter
              {(filterStatus || filterPeriod || filterSearch) && <span className="w-1.5 h-1.5 bg-primary rounded-full" />}
            </button>
            <button onClick={() => setShowNewInvoice(true)} className="px-5 py-2.5 bg-primary text-on-primary rounded-lg font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95">
              <span className="material-symbols-outlined">add</span> Buat Tagihan
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[14px] font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">filter_list</span> Filter Tagihan
              </h4>
              <button onClick={clearFilters} className="text-[12px] text-primary font-medium hover:underline">Reset Filter</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-secondary uppercase tracking-[0.05em] mb-1">Cari</label>
                <input value={filterSearch} onChange={e => setFilterSearch(e.target.value)} className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-[13px] focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Nama atau No. Invoice..." />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-secondary uppercase tracking-[0.05em] mb-1">Status</label>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-[13px] focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="">Semua Status</option>
                  <option value="Lunas">Lunas</option>
                  <option value="Belum Dibayar">Belum Dibayar</option>
                  <option value="Jatuh Tempo">Jatuh Tempo</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-secondary uppercase tracking-[0.05em] mb-1">Periode</label>
                <input value={filterPeriod} onChange={e => setFilterPeriod(e.target.value)} className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-[13px] focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Okt 2023, dll..." />
              </div>
            </div>
            {(filterStatus || filterPeriod || filterSearch) && (
              <div className="mt-3 pt-3 border-t border-outline-variant flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-secondary">Aktif:</span>
                {filterSearch && <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Cari: {filterSearch}</span>}
                {filterStatus && <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{filterStatus}</span>}
                {filterPeriod && <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Periode: {filterPeriod}</span>}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: 'receipt', color: 'bg-primary/10 text-primary', tag: 'Total', tagClass: 'text-secondary bg-surface-container-high', label: 'Total Tagihan', val: invoices.length, action: () => { setFilterStatus(''); setActiveTab('all') } },
            { icon: 'pending_actions', color: 'bg-error/10 text-error', tag: 'Urgent', tagClass: 'text-error bg-error-container/20', label: 'Belum Dibayar', val: totalUnpaid, action: () => { setFilterStatus('Belum Dibayar'); setActiveTab('all') } },
            { icon: 'event_busy', color: 'bg-tertiary-container/10 text-tertiary-container', tag: 'Follow Up', tagClass: 'text-tertiary-container bg-tertiary-container/10', label: 'Jatuh Tempo', val: totalOverdue, action: () => { setFilterStatus('Jatuh Tempo'); setActiveTab('all') } },
            { icon: 'check_circle', color: 'bg-green-500/10 text-green-600', tag: 'Success', tagClass: 'text-green-600 bg-green-500/10', label: 'Terbayar (Lunas)', val: totalPaid, action: () => { setFilterStatus('Lunas'); setActiveTab('all') } },
          ].map((s) => (
            <div key={s.label} onClick={s.action} className="glass-card p-6 rounded-xl shadow-sm hover:border-primary/50 transition-colors group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${s.color}`}><span className="material-symbols-outlined">{s.icon}</span></div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${s.tagClass}`}>{s.tag}</span>
              </div>
              <p className="text-on-surface-variant text-[12px] font-semibold tracking-[0.05em] mb-1">{s.label}</p>
              <h3 className="text-[20px] font-semibold text-on-surface">{s.val}</h3>
            </div>
          ))}
        </div>

        <div className="border-b border-outline-variant">
          <div className="flex gap-8 overflow-x-auto custom-scrollbar">
            {[
              { id: 'all', label: 'Semua Tagihan' },
              { id: 'unpaid', label: 'Belum Dibayar', badge: totalUnpaid },
              { id: 'paid', label: 'Lunas' },
              { id: 'history', label: 'Riwayat' },
            ].map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`px-1 py-4 border-b-2 whitespace-nowrap text-[14px] flex items-center gap-2 ${activeTab === t.id ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-primary transition-colors'}`}>
                {t.label}
                {typeof t.badge === 'number' && t.badge > 0 && <span className="bg-error text-on-error text-[10px] px-1.5 py-0.5 rounded-full">{t.badge}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low"><tr>
                <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">No. Invoice</th>
                <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Pelanggan</th>
                <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Periode</th>
                <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Nominal</th>
                <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Jatuh Tempo</th>
                <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Status</th>
                <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Action</th>
              </tr></thead>
              <tbody className="divide-y divide-outline-variant">
                {filtered.map((inv) => (
                  <tr key={inv.no} onClick={() => setSelectedInv(inv)} className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4 font-bold text-primary">{inv.no}</td>
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed font-bold text-xs">{inv.initials}</div><div><p className="font-bold text-on-surface text-[14px]">{inv.name}</p></div></div></td>
                    <td className="px-6 py-4 text-on-surface-variant text-[14px]">{inv.period}</td>
                    <td className="px-6 py-4 font-bold text-on-surface">Rp {inv.amount.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 text-on-surface-variant text-[14px]">{inv.due}</td>
                    <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${inv.statusClass}`}><span className={`w-1.5 h-1.5 rounded-full ${inv.dotClass}`} />{inv.status}</span></td>
                    <td className="px-6 py-4"><div className="flex gap-1">
                      <button onClick={(e) => { e.stopPropagation(); setSelectedInv(inv) }} className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors" title="Lihat Detail"><span className="material-symbols-outlined text-sm">visibility</span></button>
                      {inv.status !== 'Lunas' && (
                        <button onClick={(e) => { e.stopPropagation(); window.open(getWALink(inv), '_blank') }} className="p-2 hover:bg-green-500/10 rounded-lg text-green-600 transition-colors" title="Kirim Pengingat WA"><span className="material-symbols-outlined text-sm">send</span></button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); printInvoice(inv) }} className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors" title="Cetak Invoice"><span className="material-symbols-outlined text-sm">print</span></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between">
            <span className="text-on-surface-variant text-[14px]">Showing 1-{filtered.length} of {invoices.length} invoices</span>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface hover:border-primary disabled:opacity-50" disabled><span className="material-symbols-outlined text-sm">chevron_left</span></button>
              <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold text-xs">1</button>
              <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface hover:border-primary"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 pt-0">
        <div className="bg-on-secondary-fixed text-on-secondary-container p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 text-center md:text-left">
            <h4 className="text-[20px] font-semibold text-white mb-2">Catat Pembayaran Manual</h4>
            <p className="text-secondary-fixed-dim max-w-md">Ada pelanggan yang bayar via tunai atau transfer? Klik di sini untuk mencatat transaksi secara instan.</p>
          </div>
          <button onClick={() => setShowNewInvoice(true)} className="relative z-10 px-8 py-4 bg-white text-on-background rounded-xl font-extrabold flex items-center gap-3 shadow-2xl hover:bg-surface-container-low transition-all hover:scale-105 active:scale-95 group">
            <span className="material-symbols-outlined text-primary group-hover:rotate-12 transition-transform">add_card</span> Buat Tagihan Baru
          </button>
        </div>
      </div>

      {/* Modal Buat Tagihan Baru */}
      {showNewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowNewInvoice(false)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-outline-variant flex items-center justify-between">
              <h3 className="text-[20px] font-semibold text-on-surface">Buat Tagihan Baru</h3>
              <button onClick={() => setShowNewInvoice(false)} className="p-1 hover:bg-surface-container-highest rounded-full">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Nama Pelanggan *</label>
                <input value={newForm.name} onChange={e => setNewForm({ ...newForm, name: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Nama pelanggan" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Paket</label>
                <select value={newForm.pkg} onChange={e => setNewForm({ ...newForm, pkg: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none">
                  <option>WiFi Basic (10 Mbps) - Rp 150.000</option><option>WiFi Family (20 Mbps) - Rp 200.000</option><option>WiFi Pro (50 Mbps) - Rp 350.000</option><option>Ultra-Net (100 Mbps) - Rp 500.000</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Periode</label>
                  <input value={newForm.period} onChange={e => setNewForm({ ...newForm, period: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Okt 2024" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Nominal (Rp) *</label>
                  <input type="number" value={newForm.amount} onChange={e => setNewForm({ ...newForm, amount: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none" placeholder="350000" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Jatuh Tempo</label>
                <input value={newForm.due} onChange={e => setNewForm({ ...newForm, due: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none" placeholder="10 Okt 2024" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowNewInvoice(false)} className="flex-1 py-3 border border-outline-variant text-secondary rounded-xl font-bold hover:bg-surface-container-low transition-colors">Batal</button>
                <button onClick={createInvoice} disabled={!newForm.name || !newForm.amount} className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  Buat Tagihan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Invoice */}
      {selectedInv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSelectedInv(null)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-outline-variant flex items-center justify-between shrink-0">
              <h3 className="text-[20px] font-semibold text-on-surface">Detail Tagihan</h3>
              <button onClick={() => setSelectedInv(null)} className="p-1 hover:bg-surface-container-highest rounded-full transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-center">
                <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold ${selectedInv.statusClass}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedInv.dotClass}`} />{selectedInv.status}
                </span>
              </div>

              <div className="bg-surface-container-low rounded-xl p-4 space-y-3 text-[14px]">
                <div className="flex justify-between"><span className="text-secondary">No. Invoice</span><span className="font-bold text-primary">{selectedInv.no}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Pelanggan</span><span className="font-semibold text-on-surface">{selectedInv.name}</span></div>
                <div className="flex justify-between"><span className="text-secondary">ID Pelanggan</span><span className="font-semibold text-on-surface">{(selectedInv as any).customerId || '-'}</span></div>
                <div className="flex justify-between"><span className="text-secondary">WhatsApp</span><span className="font-semibold text-on-surface">{selectedInv.wa}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Paket</span><span className="font-semibold text-on-surface">{selectedInv.pkg}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Periode</span><span className="font-semibold text-on-surface">{selectedInv.period}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Jatuh Tempo</span><span className="font-semibold text-on-surface text-error">{selectedInv.due}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Petugas</span><span className="font-semibold text-on-surface">{selectedInv.officer}</span></div>
                {selectedInv.status === 'Lunas' && (
                  <>
                    <div className="flex justify-between"><span className="text-secondary">Metode Bayar</span><span className="font-semibold text-on-surface">{selectedInv.paymentMethod}</span></div>
                    <div className="flex justify-between"><span className="text-secondary">Tgl Bayar</span><span className="font-semibold text-on-surface">{selectedInv.paidDate}</span></div>
                  </>
                )}
                <div className="border-t border-outline-variant pt-3 flex justify-between">
                  <span className="text-secondary">Total</span>
                  <span className={`text-[22px] font-bold ${selectedInv.status === 'Lunas' ? 'text-green-600' : 'text-error'}`}>Rp {selectedInv.amount.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Riwayat Invoice */}
              <div>
                <h4 className="text-[16px] font-semibold text-on-surface mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">receipt_long</span> Riwayat Tagihan
                </h4>
                <div className="relative space-y-4 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant">
                  {selectedInv.history.map((h, i) => (
                    <div key={i} className="relative flex gap-3">
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${i === 0 ? 'bg-primary/10 text-primary' : i === selectedInv.history.length - 1 ? 'bg-green-100 text-green-700' : 'bg-surface-container-high text-secondary'}`}>
                        <span className="material-symbols-outlined text-sm">{i === 0 ? 'receipt' : i === selectedInv.history.length - 1 ? 'check' : 'schedule'}</span>
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-on-surface">{h.action}</p>
                        <p className="text-[11px] text-secondary mt-0.5">{h.time} • {h.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                {selectedInv.status !== 'Lunas' && (
                  <button onClick={() => { markAsPaid(selectedInv); setSelectedInv(prev => prev ? { ...prev, status: 'Lunas', statusClass: 'bg-green-500/10 text-green-600', dotClass: 'bg-green-500' } : null) }} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg">check_circle</span> Tandai Lunas
                  </button>
                )}
                <button onClick={() => printInvoice(selectedInv)} className="flex-1 py-3 border border-outline-variant text-secondary rounded-xl font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">print</span> Cetak
                </button>
                <button onClick={() => setSelectedInv(null)} className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-all">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
