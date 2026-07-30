
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'

export default function Dashboard() {
  const navigate = useNavigate()
  const { customers, invoices, payments } = useData()
  const [chartPeriod, setChartPeriod] = useState('6')
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [showActivityModal, setShowActivityModal] = useState(false)

  const totalCustomers = customers.length
  const activeCustomers = customers.filter(c => c.status === 'Aktif').length
  const belumBayar = customers.filter(c => c.status === 'Belum Bayar').length
  const jatuhTempo = customers.filter(c => c.status === 'Jatuh Tempo').length
  const nunggak = customers.filter(c => c.status === 'Nunggak').length
  const tidakAktif = customers.filter(c => c.status === 'Tidak Aktif').length
  const totalPendapatan = payments.filter(p => p.status === 'Lunas').reduce((s, p) => s + p.amount, 0)

  const summaryCards = [
    { icon: 'group', color: 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-on-primary', badge: `${activeCustomers} aktif`, badgeClass: 'text-green-600 bg-green-50', label: 'Total Pelanggan', val: totalCustomers, link: '/customers' },
    { icon: 'check_circle', color: 'bg-secondary-container/30 text-secondary group-hover:bg-secondary group-hover:text-on-secondary', badge: 'Aktif', badgeClass: 'text-blue-600 bg-blue-50', label: 'Pelanggan Aktif', val: activeCustomers, filled: true, link: '/customers' },
    { icon: 'warning', color: 'bg-error/10 text-error group-hover:bg-error group-hover:text-on-error', badge: `${belumBayar + jatuhTempo + nunggak} urgent`, badgeClass: 'text-error bg-error-container/20', label: 'Ada Tagihan', val: belumBayar + jatuhTempo + nunggak, link: '/billing' },
    { icon: 'payments', color: 'bg-green-100 text-green-700 group-hover:bg-green-600 group-hover:text-white', badge: 'Bulan Ini', badgeClass: 'text-green-600 bg-green-50', label: 'Pendapatan Bulan Ini', val: 'Rp ' + (totalPendapatan / 1000000).toFixed(0) + 'M', link: '/financial' },
  ]

  const troubleCustomers = customers.filter(c => ['Jatuh Tempo', 'Belum Bayar', 'Nunggak'].includes(c.status))
  const dueItems = troubleCustomers.slice(0, 3).map(c => ({
    name: c.name, pkg: c.pkg, due: c.status === 'Nunggak' ? 'Menunggak' : c.status === 'Jatuh Tempo' ? 'Jatuh Tempo' : 'Belum Bayar',
    urgent: c.status === 'Nunggak' || c.status === 'Jatuh Tempo', wa: c.wa
  }))

  const unpaidInvoices = invoices.filter(i => i.status !== 'Lunas').slice(0, 4)

  const activities = [
    { icon: 'check', color: 'bg-green-100 text-green-700', text: `Pendapatan bulan ini: Rp ${(totalPendapatan / 1000000).toFixed(0)}M`, time: 'Data real-time', detail: `${payments.filter(p => p.status === 'Lunas').length} transaksi sukses` },
    { icon: 'warning', color: 'bg-error/10 text-error', text: `${belumBayar + jatuhTempo + nunggak} pelanggan ada tagihan`, time: 'Ringkasan', detail: `${belumBayar} Belum Bayar, ${jatuhTempo} Jatuh Tempo, ${nunggak} Nunggak, ${tidakAktif} Tidak Aktif` },
    { icon: 'group', color: 'bg-primary-container/10 text-primary', text: `${activeCustomers} pelanggan aktif dari ${totalCustomers}`, time: 'Ringkasan', detail: `Aktif: ${activeCustomers}, Belum Bayar: ${belumBayar}, Jatuh Tempo: ${jatuhTempo}, Nunggak: ${nunggak}, Tidak Aktif: ${tidakAktif}` },
    { icon: 'payments', color: 'bg-green-100 text-green-700', text: `${payments.length} pembayaran tercatat`, time: 'Ringkasan', detail: `Total: Rp ${totalPendapatan.toLocaleString('id-ID')}` },
  ]

  const sendWA = (name: string, wa: string, msg: string) => {
    const phone = wa.startsWith('62') ? wa : `62${wa.slice(1)}`
    const text = encodeURIComponent(`Halo *${name}*, ${msg}. Silakan lakukan pembayaran. Terima kasih.\n\n*MD_Network*`)
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank')
  }

  const handleExport = () => {
    const w = window.open('', '_blank', 'width=900,height=700')
    if (w) {
      const rows = unpaidInvoices.map(r => `<tr><td>${r.name}</td><td>${r.pkg}</td><td>Rp ${r.amount.toLocaleString('id-ID')}</td><td>${r.due}</td><td>${r.status}</td></tr>`).join('')
      w.document.write(`<html><head><title>Dashboard Report</title><style>body{font-family:sans-serif;max-width:900px;margin:0 auto;padding:30px;color:#1e293b}h1{color:#3525cd}.grid{display:flex;gap:16px;margin-bottom:30px}.card{flex:1;padding:20px;border:1px solid #e2e8f0;border-radius:12px}.card .label{font-size:11px;color:#64748b;text-transform:uppercase}.card .val{font-size:24px;font-weight:700}table{width:100%;border-collapse:collapse;font-size:13px}th{background:#f1f5f9;text-align:left;padding:10px 12px}td{padding:10px 12px;border-bottom:1px solid #f1f5f9}@media print{body{padding:15px}}</style></head><body><h1>MD_Network - Dashboard</h1><div class="grid">${summaryCards.map(c => `<div class="card"><div class="label">${c.label}</div><div class="val">${c.val}</div></div>`).join('')}</div><table><thead><tr><th>Nama</th><th>Paket</th><th>Nominal</th><th>Jatuh Tempo</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table><script>setTimeout(()=>window.print(),300)</script></body></html>`)
      w.document.close()
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[32px] font-bold tracking-[-0.02em] text-on-surface">Selamat datang kembali, Admin</h2>
          <p className="text-secondary text-base flex items-center gap-2 mt-1">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-[12px] font-semibold text-secondary hover:bg-surface-container-low transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((s) => (
          <div key={s.label} onClick={() => s.link && navigate(s.link)} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:border-primary hover:shadow-md transition-all group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${s.color} transition-colors`}>
                <span className="material-symbols-outlined" style={s.filled ? { fontVariationSettings: "'FILL' 1" } : undefined}>{s.icon}</span>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded ${s.badgeClass}`}>{s.badge}</span>
            </div>
            <p className="text-secondary text-[12px] font-semibold tracking-[0.05em] mb-1 uppercase">{s.label}</p>
            <h3 className="text-[32px] font-bold">{s.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div><h4 className="text-[20px] font-semibold text-on-surface">Pemasukan vs Pengeluaran</h4><p className="text-[14px] text-secondary">Analitik keuangan 6 bulan terakhir</p></div>
            <select value={chartPeriod} onChange={e => setChartPeriod(e.target.value)} className="bg-surface-container-low border-none rounded-lg text-[12px] font-semibold focus:ring-primary/20 outline-none p-2 cursor-pointer">
              <option value="6">6 Bulan Terakhir</option><option value="12">1 Tahun Terakhir</option>
            </select>
          </div>
          <div className="h-64 relative w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3525cd" stopOpacity="0.25" /><stop offset="100%" stopColor="#3525cd" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line stroke="#E2E8F0" strokeDasharray="4" x1="0" x2="800" y1="0" y2="0" />
              <line stroke="#E2E8F0" strokeDasharray="4" x1="0" x2="800" y1="50" y2="50" />
              <line stroke="#E2E8F0" strokeDasharray="4" x1="0" x2="800" y1="100" y2="100" />
              <line stroke="#E2E8F0" strokeDasharray="4" x1="0" x2="800" y1="150" y2="150" />
              <path d="M0,150 L100,120 L200,130 L300,80 L400,100 L500,60 L600,70 L700,40 L800,50 L800,200 L0,200 Z" fill="url(#chartGradient)" />
              <path d="M0,150 L100,120 L200,130 L300,80 L400,100 L500,60 L600,70 L700,40 L800,50" fill="none" stroke="#3525cd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              <path d="M0,180 L100,170 L200,175 L300,150 L400,160 L500,140 L600,145 L700,130 L800,140" fill="none" stroke="#94a3b8" strokeDasharray="6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              <circle cx="700" cy="40" fill="#3525cd" r="5" stroke="#fff" strokeWidth="2" />
              <circle cx="700" cy="130" fill="#94a3b8" r="5" stroke="#fff" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex items-center justify-between cursor-pointer hover:border-primary" onClick={() => navigate('/customers')}>
            <div><p className="text-secondary text-[12px] font-semibold mb-1">Pelanggan Aktif</p><h4 className="text-[20px] font-semibold text-on-surface">{activeCustomers}</h4></div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-full"><span className="material-symbols-outlined">group</span></div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex items-center justify-between cursor-pointer hover:border-error" onClick={() => navigate('/billing')}>
            <div><p className="text-secondary text-[12px] font-semibold mb-1">Belum Bayar + Nunggak</p><h4 className="text-[20px] font-semibold text-on-surface">{belumBayar + nunggak}</h4></div>
            <div className="p-2 bg-red-50 text-red-600 rounded-full"><span className="material-symbols-outlined">warning</span></div>
          </div>
          <div className="bg-primary p-6 rounded-xl shadow-lg flex items-center justify-between text-on-primary relative overflow-hidden cursor-pointer" onClick={() => navigate('/financial')}>
            <div className="relative z-10"><p className="opacity-80 text-[12px] font-semibold mb-1">Pendapatan Bulan Ini</p><h4 className="text-[20px] font-semibold">Rp {(totalPendapatan / 1000000).toFixed(0)}M</h4></div>
            <div className="relative z-10 p-2 bg-white/20 rounded-full"><span className="material-symbols-outlined">account_balance</span></div>
            <div className="absolute -right-4 -bottom-4 opacity-10"><span className="material-symbols-outlined text-[100px]">payments</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[20px] font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">notification_important</span> Perlu Perhatian ({troubleCustomers.length})
              </h3>
              <button onClick={() => navigate('/customers')} className="text-primary text-[12px] font-semibold hover:underline">Lihat Semua</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dueItems.map((c) => (
                <div key={c.name} className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/billing')}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${c.urgent ? 'bg-error/10 text-error' : 'bg-tertiary-container/10 text-tertiary'}`}>{c.name.split(' ').map(w => w[0]).join('')}</div>
                    <div><h5 className="text-[12px] font-semibold text-on-surface">{c.name}</h5><p className="text-[10px] text-secondary">{c.pkg}</p></div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div><p className="text-[10px] text-secondary">Status</p><p className={`font-bold text-[14px] ${c.urgent ? 'text-error' : 'text-tertiary'}`}>{c.due}</p></div>
                    <button onClick={(e) => { e.stopPropagation(); sendWA(c.name, c.wa, c.due) }} className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-on-primary transition-colors"><span className="material-symbols-outlined text-sm">send</span></button>
                  </div>
                </div>
              ))}
              {troubleCustomers.length > 3 && (
                <div onClick={() => navigate('/customers')} className="bg-surface-container-lowest p-4 rounded-xl border border-dashed border-outline-variant hover:border-primary transition-colors cursor-pointer flex items-center justify-center flex-col gap-1">
                  <span className="text-[28px] font-bold text-primary">+{troubleCustomers.length - 3}</span>
                  <span className="text-[11px] text-secondary">lainnya</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between">
              <h3 className="text-[20px] font-semibold text-on-surface">Tagihan Perlu Tindakan</h3>
              <button onClick={() => navigate('/billing')} className="text-primary text-[12px] font-semibold hover:underline">Lihat Semua</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left"><thead className="bg-surface-container-low text-[12px] font-semibold text-secondary"><tr><th className="px-6 py-4">Nama</th><th className="px-6 py-4">Paket</th><th className="px-6 py-4">Nominal</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Action</th></tr></thead>
                <tbody className="divide-y divide-outline-variant text-[14px]">
                  {unpaidInvoices.map((r) => (
                    <tr key={r.no} className="hover:bg-surface-container-low/50 transition-colors cursor-pointer" onClick={() => navigate('/billing')}>
                      <td className="px-6 py-4 font-medium text-on-surface">{r.name}</td><td className="px-6 py-4">{r.pkg}</td><td className="px-6 py-4">Rp {r.amount.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4"><span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${r.statusClass}`}><span className={`w-1.5 h-1.5 rounded-full ${r.dotClass}`} />{r.status}</span></td>
                      <td className="px-6 py-4"><button onClick={(e) => { e.stopPropagation(); sendWA(r.name, r.wa, r.status) }} className="text-green-600 hover:underline font-bold text-xs"><span className="material-symbols-outlined text-sm">send</span></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
            <h3 className="text-[20px] font-semibold text-on-surface mb-4">Ringkasan Pelanggan</h3>
            <div className="space-y-3">
              {[
                { label: 'Aktif', val: activeCustomers, color: 'bg-green-500' },
                { label: 'Belum Bayar', val: belumBayar, color: 'bg-error' },
                { label: 'Jatuh Tempo', val: jatuhTempo, color: 'bg-yellow-500' },
                { label: 'Nunggak', val: nunggak, color: 'bg-red-600' },
                { label: 'Tidak Aktif', val: tidakAktif, color: 'bg-slate-400' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${s.color}`} />
                  <span className="flex-1 text-[13px] text-on-surface">{s.label}</span>
                  <span className="text-[13px] font-bold text-on-surface">{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[20px] font-semibold text-on-surface">Aktivitas Terbaru</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-secondary">{lastRefresh.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                <button onClick={() => setLastRefresh(new Date())} className="text-primary text-[12px] font-semibold hover:underline">Refresh</button>
              </div>
            </div>
            <div className="relative space-y-5 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant">
              {activities.map((a, i) => (
                <div key={i} className="relative flex gap-3 cursor-pointer" onClick={() => setShowActivityModal(true)}>
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${a.color}`}><span className="material-symbols-outlined text-sm">{a.icon}</span></div>
                  <div><p className="text-[13px] font-medium text-on-surface">{a.text}</p><p className="text-[10px] text-secondary mt-0.5">{a.time}</p></div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowActivityModal(true)} className="w-full mt-6 py-3 bg-surface-container-low text-secondary rounded-lg text-[12px] font-semibold hover:bg-surface-container-high transition-colors">
              Lihat Semua Aktivitas
            </button>
          </div>
        </div>
      </div>

      {showActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowActivityModal(false)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-outline-variant flex items-center justify-between shrink-0">
              <h3 className="text-[20px] font-semibold text-on-surface">Semua Aktivitas</h3>
              <button onClick={() => setShowActivityModal(false)} className="p-1 hover:bg-surface-container-highest rounded-full"><span className="material-symbols-outlined text-on-surface-variant">close</span></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="relative space-y-6 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant">
                {activities.map((a, i) => (
                  <div key={i} className="relative flex gap-4">
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${a.color}`}><span className="material-symbols-outlined text-sm">{a.icon}</span></div>
                    <div className="flex-1"><p className="text-[14px] font-medium text-on-surface">{a.text}</p><p className="text-[11px] text-secondary mt-1">{a.time}</p><p className="text-[11px] text-on-surface-variant bg-surface-container-low rounded-lg p-2 mt-2">{a.detail}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
