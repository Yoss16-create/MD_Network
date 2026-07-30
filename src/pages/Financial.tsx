
import { useState, useMemo } from 'react'

interface Transaction {
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

const allTransactions: Transaction[] = [
  { date: '12 Juni 2024, 09:15', desc: 'Pembayaran Tagihan INV-00982 (Budi Santoso)', category: 'Pemasukan', catClass: 'bg-emerald-100 text-emerald-800', amount: 350000, amtClass: 'text-emerald-600', officer: 'Admin_Dhea', invoiceNo: 'INV-00982', pelanggan: 'Budi Santoso', metode: 'Transfer Bank (BCA)', month: 'Juni 2024' },
  { date: '11 Juni 2024, 14:30', desc: 'Pembelian Kabel Fiber Optic 200m', category: 'Pengeluaran', catClass: 'bg-error-container/20 text-error', amount: 1250000, amtClass: 'text-error', officer: 'Teknisi_Rian', invoiceNo: 'N/A', pelanggan: 'N/A', metode: 'Kas Operasional', month: 'Juni 2024' },
  { date: '15 Juni 2024, 14:00', desc: 'Pembayaran Bulk 45 Pelanggan (Juni)', category: 'Pemasukan', catClass: 'bg-emerald-100 text-emerald-800', amount: 18000000, amtClass: 'text-emerald-600', officer: 'Sistem', invoiceNo: 'BULK-JUN', pelanggan: '45 Pelanggan', metode: 'Auto Debet', month: 'Juni 2024' },
  { date: '10 Juni 2024, 10:00', desc: 'Sewa Bandwidth Tier-1 (Juni)', category: 'Pengeluaran', catClass: 'bg-error-container/20 text-error', amount: 12000000, amtClass: 'text-error', officer: 'Manager_Keuangan', invoiceNo: 'N/A', pelanggan: 'N/A', metode: 'Transfer Bank (Mandiri)', month: 'Juni 2024' },
  { date: '10 Juni 2024, 08:45', desc: 'Pembayaran Tagihan INV-00981 (Siti Aminah)', category: 'Pemasukan', catClass: 'bg-emerald-100 text-emerald-800', amount: 450000, amtClass: 'text-emerald-600', officer: 'Admin_Dhea', invoiceNo: 'INV-00981', pelanggan: 'Siti Aminah', metode: 'QRIS (GoPay)', month: 'Juni 2024' },
  { date: '09 Juni 2024, 16:20', desc: 'Biaya Maintenance BTS Wilayah Selatan', category: 'Pengeluaran', catClass: 'bg-error-container/20 text-error', amount: 3750000, amtClass: 'text-error', officer: 'Teknisi_Bagus', invoiceNo: 'N/A', pelanggan: 'N/A', metode: 'Kas Operasional', month: 'Juni 2024' },
  { date: '15 Mei 2024, 10:00', desc: 'Pembayaran Tagihan INV-00975 (Rian Hidayat)', category: 'Pemasukan', catClass: 'bg-emerald-100 text-emerald-800', amount: 350000, amtClass: 'text-emerald-600', officer: 'Admin_Dhea', invoiceNo: 'INV-00975', pelanggan: 'Rian Hidayat', metode: 'Transfer Bank (BCA)', month: 'Mei 2024' },
  { date: '15 Mei 2024, 14:00', desc: 'Pembayaran Bulk 40 Pelanggan (Mei)', category: 'Pemasukan', catClass: 'bg-emerald-100 text-emerald-800', amount: 12000000, amtClass: 'text-emerald-600', officer: 'Sistem', invoiceNo: 'BULK-MEI', pelanggan: '40 Pelanggan', metode: 'Auto Debet', month: 'Mei 2024' },
  { date: '12 Mei 2024, 15:00', desc: 'Pembayaran Tagihan INV-00976 (Lestari Wijaya)', category: 'Pemasukan', catClass: 'bg-emerald-100 text-emerald-800', amount: 175000, amtClass: 'text-emerald-600', officer: 'Admin_Bagus', invoiceNo: 'INV-00976', pelanggan: 'Lestari Wijaya', metode: 'QRIS (DANA)', month: 'Mei 2024' },
  { date: '05 Mei 2024, 09:00', desc: 'Biaya Internet Uplink ISP (Mei)', category: 'Pengeluaran', catClass: 'bg-error-container/20 text-error', amount: 10000000, amtClass: 'text-error', officer: 'Manager_Keuangan', invoiceNo: 'N/A', pelanggan: 'N/A', metode: 'Transfer Bank (BCA)', month: 'Mei 2024' },
  { date: '01 Mei 2024, 11:00', desc: 'Pembelian Router Mikrotik RB4011', category: 'Pengeluaran', catClass: 'bg-error-container/20 text-error', amount: 4500000, amtClass: 'text-error', officer: 'Teknisi_Rian', invoiceNo: 'N/A', pelanggan: 'N/A', metode: 'Kas Operasional', month: 'Mei 2024' },
  { date: '20 April 2024, 10:00', desc: 'Pembayaran Bulk 38 Pelanggan (April)', category: 'Pemasukan', catClass: 'bg-emerald-100 text-emerald-800', amount: 10000000, amtClass: 'text-emerald-600', officer: 'Sistem', invoiceNo: 'BULK-APR', pelanggan: '38 Pelanggan', metode: 'Auto Debet', month: 'April 2024' },
  { date: '20 April 2024, 14:00', desc: 'Pembayaran Tagihan INV-00960 (Farhan Malik)', category: 'Pemasukan', catClass: 'bg-emerald-100 text-emerald-800', amount: 750000, amtClass: 'text-emerald-600', officer: 'Admin_Dhea', invoiceNo: 'INV-00960', pelanggan: 'Farhan Malik', metode: 'Transfer Bank (Mandiri)', month: 'April 2024' },
  { date: '18 April 2024, 10:00', desc: 'Pembayaran Tagihan INV-00961 (Dewi Sartika)', category: 'Pemasukan', catClass: 'bg-emerald-100 text-emerald-800', amount: 350000, amtClass: 'text-emerald-600', officer: 'Admin_Dhea', invoiceNo: 'INV-00961', pelanggan: 'Dewi Sartika', metode: 'Tunai', month: 'April 2024' },
  { date: '10 April 2024, 08:00', desc: 'Biaya Listrik & Operasional', category: 'Pengeluaran', catClass: 'bg-error-container/20 text-error', amount: 5000000, amtClass: 'text-error', officer: 'Manager_Keuangan', invoiceNo: 'N/A', pelanggan: 'N/A', metode: 'Transfer Bank (BCA)', month: 'April 2024' },
  { date: '05 Juni 2024, 13:00', desc: 'Pembayaran Tagihan INV-00983 (Ahmad Subarjo)', category: 'Pemasukan', catClass: 'bg-emerald-100 text-emerald-800', amount: 150000, amtClass: 'text-emerald-600', officer: 'Admin_Dhea', invoiceNo: 'INV-00983', pelanggan: 'Ahmad Subarjo', metode: 'Transfer Bank (BCA)', month: 'Juni 2024' },
  { date: '08 Mei 2024, 10:30', desc: 'Pembayaran Tagihan INV-00977 (Bambang Pamungkas)', category: 'Pemasukan', catClass: 'bg-emerald-100 text-emerald-800', amount: 150000, amtClass: 'text-emerald-600', officer: 'Admin_Dhea', invoiceNo: 'INV-00977', pelanggan: 'Bambang Pamungkas', metode: 'Tunai', month: 'Mei 2024' },
  { date: '25 April 2024, 14:00', desc: 'Pembayaran Tagihan INV-00962 (Lestari Wijaya)', category: 'Pemasukan', catClass: 'bg-emerald-100 text-emerald-800', amount: 150000, amtClass: 'text-emerald-600', officer: 'Admin_Bagus', invoiceNo: 'INV-00962', pelanggan: 'Lestari Wijaya', metode: 'QRIS (GoPay)', month: 'April 2024' },
]

const months = [...new Set(allTransactions.map(t => t.month))]

const monthlyData: Record<string, { income: number; expense: number; count: number }> = {}
allTransactions.forEach(t => {
  if (!monthlyData[t.month]) monthlyData[t.month] = { income: 0, expense: 0, count: 0 }
  monthlyData[t.month].count++
  if (t.category === 'Pemasukan') monthlyData[t.month].income += t.amount
  else monthlyData[t.month].expense += t.amount
})

const formatRupiah = (n: number) => 'Rp ' + n.toLocaleString('id-ID')

export default function Financial() {
  const [category, setCategory] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('Bulan Ini')
  const [showPeriodPicker, setShowPeriodPicker] = useState(false)
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showBudgetDetail, setShowBudgetDetail] = useState(false)

  const currentMonthIndex = months.length - 1

  const periodTransactions = useMemo(() => {
    if (selectedPeriod === 'Semua') return allTransactions
    if (selectedPeriod === 'Bulan Ini') return allTransactions.filter(t => t.month === months[currentMonthIndex])
    return allTransactions.filter(t => t.month === selectedPeriod)
  }, [selectedPeriod])

  const periodIncome = periodTransactions.filter(t => t.category === 'Pemasukan').reduce((s, t) => s + t.amount, 0)
  const periodExpense = periodTransactions.filter(t => t.category === 'Pengeluaran').reduce((s, t) => s + t.amount, 0)
  const periodProfit = periodIncome - periodExpense
  const marginPct = periodIncome > 0 ? ((periodProfit / periodIncome) * 100).toFixed(1) : '0'

  const filtered = category ? periodTransactions.filter(t => t.category === category) : periodTransactions

  const chartMonths = months.slice(-6)
  const maxChart = Math.max(...chartMonths.map(m => { const d = monthlyData[m]; return d ? Math.max(d.income, d.expense) : 0 }), 1)

  const handleExport = (format: 'print' | 'csv') => {
    setShowExportModal(false)
    if (format === 'print') {
      const w = window.open('', '_blank', 'width=900,height=700')
      if (w) {
        const rows = filtered.map(t =>
          `<tr><td>${t.date}</td><td>${t.desc}</td><td style="color:${t.category === 'Pemasukan' ? '#16a34a' : '#ba1a1a'}">${t.category}</td><td style="color:${t.category === 'Pemasukan' ? '#16a34a' : '#ba1a1a'};font-weight:700">${formatRupiah(t.amount)}</td><td>${t.officer}</td></tr>`
        ).join('')
        w.document.write(`<html><head><title>Laporan Keuangan - ${selectedPeriod}</title><style>body{font-family:sans-serif;max-width:900px;margin:0 auto;padding:30px;color:#1e293b}h1{font-size:22px;color:#3525cd;margin-bottom:5px}.period{color:#64748b;margin-bottom:20px}.summary{display:flex;gap:24px;margin-bottom:30px;flex-wrap:wrap}.card{flex:1;min-width:180px;padding:16px;border-radius:12px;border:1px solid #e2e8f0}.card .label{font-size:11px;color:#64748b;text-transform:uppercase;margin-bottom:4px}.card .val{font-size:20px;font-weight:700}.income .val{color:#16a34a}.expense .val{color:#ba1a1a}.profit .val{color:#3525cd}table{width:100%;border-collapse:collapse;font-size:13px}th{background:#f1f5f9;text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;color:#64748b}td{padding:10px 12px;border-bottom:1px solid #f1f5f9}.footer{margin-top:30px;text-align:center;font-size:11px;color:#94a3b8}@media print{body{padding:15px}}</style></head><body><h1>MD_Network - Laporan Keuangan</h1><div class="period">Periode: <strong>${selectedPeriod}</strong> • ${filtered.length} transaksi</div><div class="summary"><div class="card income"><div class="label">Pemasukan</div><div class="val">${formatRupiah(periodIncome)}</div></div><div class="card expense"><div class="label">Pengeluaran</div><div class="val">${formatRupiah(periodExpense)}</div></div><div class="card profit"><div class="label">Laba Bersih</div><div class="val">${formatRupiah(periodProfit)}</div></div></div><table><thead><tr><th>Tanggal</th><th>Deskripsi</th><th>Kategori</th><th>Jumlah</th><th>Petugas</th></tr></thead><tbody>${rows}</tbody></table><div class="footer">Dicetak pada ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} • MD_Network WiFi CMS</div><script>setTimeout(()=>window.print(),300)</script></body></html>`)
        w.document.close()
      }
    } else {
      let csv = 'Tanggal,Deskripsi,Kategori,Jumlah,Petugas\n'
      filtered.forEach(t => csv += `"${t.date}","${t.desc}","${t.category}",${t.amount},"${t.officer}"\n`)
      const blob = new Blob([csv], { type: 'text/csv' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `Laporan_Keuangan_${selectedPeriod.replace(' ', '_')}.csv`
      a.click()
      URL.revokeObjectURL(a.href)
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[32px] font-bold tracking-[-0.02em] text-on-surface">Laporan Keuangan</h2>
          <p className="text-[14px] text-on-surface-variant">Ringkasan aktivitas finansial ISP Anda — {selectedPeriod}.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <button onClick={() => setShowPeriodPicker(!showPeriodPicker)} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-outline-variant shadow-sm hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
              <span className="text-[12px] font-semibold">{selectedPeriod}</span>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">expand_more</span>
            </button>
            {showPeriodPicker && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-xl border border-outline-variant shadow-lg z-20 min-w-[160px] py-2">
                <button onClick={() => { setSelectedPeriod('Bulan Ini'); setShowPeriodPicker(false) }} className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-surface-container-low transition-colors ${selectedPeriod === 'Bulan Ini' ? 'text-primary font-bold' : 'text-on-surface'}`}>Bulan Ini</button>
                <div className="h-px bg-outline-variant mx-3 my-1" />
                {months.map(m => (
                  <button key={m} onClick={() => { setSelectedPeriod(m); setShowPeriodPicker(false) }} className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-surface-container-low transition-colors ${selectedPeriod === m ? 'text-primary font-bold' : 'text-on-surface'}`}>{m}</button>
                ))}
                <div className="h-px bg-outline-variant mx-3 my-1" />
                <button onClick={() => { setSelectedPeriod('Semua'); setShowPeriodPicker(false) }} className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-surface-container-low transition-colors ${selectedPeriod === 'Semua' ? 'text-primary font-bold' : 'text-on-surface'}`}>Semua</button>
              </div>
            )}
            {showPeriodPicker && <div className="fixed inset-0 z-10" onClick={() => setShowPeriodPicker(false)} />}
          </div>
          <button onClick={() => setShowExportModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-all shadow-sm">
            <span className="material-symbols-outlined text-[20px]">download</span> Export
          </button>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowExportModal(false)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-outline-variant">
              <h3 className="text-[18px] font-semibold text-on-surface">Export Laporan Keuangan</h3>
              <p className="text-[13px] text-secondary mt-1">Periode: <strong>{selectedPeriod}</strong> • {filtered.length} transaksi</p>
            </div>
            <div className="p-6 space-y-3">
              <button onClick={() => handleExport('print')} className="w-full py-3.5 border border-outline-variant rounded-xl font-bold text-on-surface hover:bg-surface-container-low transition-colors flex items-center justify-center gap-3">
                <span className="material-symbols-outlined text-primary">print</span> Cetak / Print
              </button>
              <button onClick={() => handleExport('csv')} className="w-full py-3.5 border border-outline-variant rounded-xl font-bold text-on-surface hover:bg-surface-container-low transition-colors flex items-center justify-center gap-3">
                <span className="material-symbols-outlined text-green-600">description</span> Download CSV
              </button>
              <button onClick={() => setShowExportModal(false)} className="w-full py-3 bg-surface-container-low rounded-xl font-bold text-secondary hover:bg-surface-container-high transition-colors mt-2">Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: 'payments', color: 'bg-primary-container/10 text-primary', label: 'Total Pemasukan', val: formatRupiah(periodIncome), sub: `${periodTransactions.filter(t => t.category === 'Pemasukan').length} transaksi`, valClass: 'text-green-600', iconBg: 'trending_up' },
          { icon: 'outbound', color: 'bg-error-container/10 text-error', label: 'Total Pengeluaran', val: formatRupiah(periodExpense), sub: `${periodTransactions.filter(t => t.category === 'Pengeluaran').length} transaksi`, valClass: 'text-error', iconBg: 'trending_down' },
        ].map((s) => (
          <div key={s.label} className="glass-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><span className="material-symbols-outlined text-[80px]" style={{ fontVariationSettings: "'FILL' 1" }}>{s.iconBg}</span></div>
            <div className="flex items-center gap-4 mb-4"><div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span></div><div><p className="text-on-surface-variant text-[12px] font-semibold tracking-[0.05em]">{s.label}</p><h3 className={`text-[22px] font-bold ${s.valClass}`}>{s.val}</h3></div></div>
            <div className="text-[11px] text-secondary">{s.sub}</div>
          </div>
        ))}
        <div className="glass-card p-6 rounded-2xl bg-[#1a1280] text-white shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group" style={{ border: '2px solid #3525cd' }}>
          <div className="absolute top-0 right-0 p-4 opacity-15 group-hover:opacity-25 transition-opacity"><span className="material-symbols-outlined text-[80px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span></div>
          <div className="flex items-center gap-4 mb-4"><div className="w-12 h-12 rounded-xl bg-white/25 flex items-center justify-center text-white"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>savings</span></div><div><p className="text-black/70 text-[12px] font-semibold tracking-[0.05em] uppercase">Laba Bersih</p><h3 className="text-[30px] font-extrabold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">{formatRupiah(periodProfit)}</h3></div></div>
          <div className="flex items-center gap-1 text-[12px] font-bold text-emerald-300 bg-white/10 rounded-full px-3 py-1 w-fit"><span className="material-symbols-outlined text-[14px]">stars</span><span>Margin {marginPct}%</span></div>
        </div>
      </div>

      {/* Chart + Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div><h4 className="text-[20px] font-semibold tracking-[-0.01em] text-on-surface">Statistik Bulanan</h4><p className="text-[14px] text-on-surface-variant">Pendapatan vs pengeluaran 6 bulan terakhir.</p></div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-primary rounded-full" /><span className="text-[11px] text-secondary">Pemasukan</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-rose-400 rounded-full" /><span className="text-[11px] text-secondary">Pengeluaran</span></div>
            </div>
          </div>
          <div className="relative h-72">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 240" preserveAspectRatio="none">
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3525cd" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#3525cd" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              {[0, 1, 2, 3, 4].map(i => (
                <g key={i}>
                  <line x1="40" y1={20 + i * 48} x2="580" y2={20 + i * 48} stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="0.5" />
                  <text x="36" y={24 + i * 48} textAnchor="end" fontSize="9" fill="#94a3b8">
                    {maxChart > 0 ? Math.round((maxChart * (4 - i) / 4) / 1000000) + 'M' : '0'}
                  </text>
                </g>
              ))}
              <path
                d={(() => {
                  const pts = chartMonths.map((m, i) => {
                    const d = monthlyData[m] || { income: 0, expense: 0 }
                    const h = maxChart > 0 ? (d.expense / maxChart) * 200 : 0
                    const x = 40 + (i / (chartMonths.length - 1)) * 520
                    return `${x},${220 - h}`
                  })
                  const area = pts.map((p, i) => {
                    const [cx, cy] = p.split(',').map(Number)
                    return i === 0 ? `M${cx},${cy}` : `C${cx - 40},${cy} ${cx - 40},${cy} ${cx},${cy}`
                  }).join(' ')
                  return area + ` L${Number(pts[pts.length - 1].split(',')[0])},220 L${Number(pts[0].split(',')[0])},220 Z`
                })()}
                fill="url(#expenseGrad)" stroke="none"
              />
              <path
                d={(() => {
                  const pts = chartMonths.map((m, i) => {
                    const d = monthlyData[m] || { income: 0, expense: 0 }
                    const h = maxChart > 0 ? (d.expense / maxChart) * 200 : 0
                    const x = 40 + (i / (chartMonths.length - 1)) * 520
                    return `${x},${220 - h}`
                  })
                  return pts.map((p, i) => {
                    const [cx, cy] = p.split(',').map(Number)
                    return i === 0 ? `M${cx},${cy}` : `C${cx - 40},${cy} ${cx - 40},${cy} ${cx},${cy}`
                  }).join(' ')
                })()}
                fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round"
              />
              <path
                d={(() => {
                  const pts = chartMonths.map((m, i) => {
                    const d = monthlyData[m] || { income: 0, expense: 0 }
                    const h = maxChart > 0 ? (d.income / maxChart) * 200 : 0
                    const x = 40 + (i / (chartMonths.length - 1)) * 520
                    return `${x},${220 - h}`
                  })
                  const area = pts.map((p, i) => {
                    const [cx, cy] = p.split(',').map(Number)
                    return i === 0 ? `M${cx},${cy}` : `C${cx - 40},${cy} ${cx - 40},${cy} ${cx},${cy}`
                  }).join(' ')
                  return area + ` L${Number(pts[pts.length - 1].split(',')[0])},220 L${Number(pts[0].split(',')[0])},220 Z`
                })()}
                fill="url(#incomeGrad)" stroke="none"
              />
              <path
                d={(() => {
                  const pts = chartMonths.map((m, i) => {
                    const d = monthlyData[m] || { income: 0, expense: 0 }
                    const h = maxChart > 0 ? (d.income / maxChart) * 200 : 0
                    const x = 40 + (i / (chartMonths.length - 1)) * 520
                    return `${x},${220 - h}`
                  })
                  return pts.map((p, i) => {
                    const [cx, cy] = p.split(',').map(Number)
                    return i === 0 ? `M${cx},${cy}` : `C${cx - 40},${cy} ${cx - 40},${cy} ${cx},${cy}`
                  }).join(' ')
                })()}
                fill="none" stroke="#3525cd" strokeWidth="2.5" strokeLinecap="round" filter="url(#glow)"
              />
              {chartMonths.map((m, i) => {
                const d = monthlyData[m] || { income: 0, expense: 0 }
                const x = 40 + (i / (chartMonths.length - 1)) * 520
                const incomeY = 220 - (maxChart > 0 ? (d.income / maxChart) * 200 : 0)
                const expenseY = 220 - (maxChart > 0 ? (d.expense / maxChart) * 200 : 0)
                const tooltipY = Math.min(incomeY, expenseY) - 50
                return (
                  <g key={m} className="group cursor-pointer">
                    <circle cx={x} cy={incomeY} r="14" fill="transparent" />
                    <circle cx={x} cy={incomeY} r="5" fill="#3525cd" stroke="#fff" strokeWidth="2" className="transition-all group-hover:r-[7px]" />
                    <circle cx={x} cy={expenseY} r="14" fill="transparent" />
                    <circle cx={x} cy={expenseY} r="5" fill="#f43f5e" stroke="#fff" strokeWidth="2" className="transition-all group-hover:r-[7px]" />
                    <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <rect x={x - 72} y={tooltipY} width="144" height="44" rx="8" fill="#0b1c30" />
                      <text x={x} y={tooltipY + 18} textAnchor="middle" fontSize="10" fill="#c3c0ff">📥 {formatRupiah(d.income)}</text>
                      <text x={x} y={tooltipY + 34} textAnchor="middle" fontSize="10" fill="#fda4af">📤 {formatRupiah(d.expense)}</text>
                    </g>
                    <text x={x} y="238" textAnchor="middle" fontSize="10" fontWeight="700" fill="#94a3b8">{m.split(' ')[0]}</text>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl shadow-sm flex flex-col">
          <h4 className="text-[20px] font-semibold tracking-[-0.01em] text-on-surface mb-6">Alokasi Biaya</h4>
          <div className="flex-1 space-y-4">
            {periodExpense > 0 ? [
              { label: 'Infrastruktur & Maintenance', pct: 45 },
              { label: 'Bandwidth ISP', pct: 30 },
              { label: 'Operasional & Gaji', pct: 20 },
              { label: 'Lain-lain', pct: 5 },
            ].map(b => (
              <div key={b.label}><div className="flex justify-between text-[13px] mb-1"><span>{b.label}</span><span className="font-bold">{b.pct}%</span></div><div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${b.pct}%` }} /></div></div>
            )) : <p className="text-secondary text-[14px] text-center py-4">Tidak ada data pengeluaran</p>}
          </div>
          <button onClick={() => setShowBudgetDetail(true)} className="mt-6 text-primary font-bold text-[14px] flex items-center justify-center gap-2 hover:underline">
            Lihat Detail Kategori <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="glass-card rounded-2xl shadow-sm overflow-hidden border border-outline-variant">
        <div className="p-6 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-4">
          <h4 className="text-[20px] font-semibold tracking-[-0.01em] text-on-surface">Riwayat Transaksi</h4>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">filter_list</span>
            <select value={category} onChange={e => setCategory(e.target.value)} className="pl-10 pr-8 py-2 bg-white border border-outline-variant rounded-xl text-[14px] appearance-none focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">
              <option value="">Semua Kategori</option><option value="Pemasukan">Pemasukan</option><option value="Pengeluaran">Pengeluaran</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-surface-container-low"><th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Tanggal</th><th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Deskripsi</th><th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Kategori</th><th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Jumlah</th><th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Petugas</th><th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase text-right">Aksi</th></tr></thead>
            <tbody className="divide-y divide-outline-variant">
              {filtered.map((t, i) => (
                <tr key={i} onClick={() => setSelectedTx(t)} className="hover:bg-surface-container-lowest transition-colors cursor-pointer">
                  <td className="px-6 py-4 text-[14px]">{t.date}</td><td className="px-6 py-4 text-[14px] font-medium">{t.desc}</td>
                  <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${t.catClass}`}>{t.category}</span></td>
                  <td className={`px-6 py-4 text-[14px] font-bold ${t.amtClass}`}>{formatRupiah(t.amount)}</td><td className="px-6 py-4 text-[14px]">{t.officer}</td>
                  <td className="px-6 py-4 text-right"><button onClick={(e) => { e.stopPropagation(); setSelectedTx(t) }} className="p-1 hover:bg-surface-container-highest rounded-full transition-colors"><span className="material-symbols-outlined text-on-surface-variant">visibility</span></button></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-secondary text-[14px]">Tidak ada transaksi untuk periode ini</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-between">
          <p className="text-[14px] text-on-surface-variant">Menampilkan {filtered.length} dari {allTransactions.length} transaksi</p>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSelectedTx(null)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-outline-variant flex items-center justify-between">
              <h3 className="text-[20px] font-semibold text-on-surface">Detail Transaksi</h3>
              <button onClick={() => setSelectedTx(null)} className="p-1 hover:bg-surface-container-highest rounded-full transition-colors"><span className="material-symbols-outlined text-on-surface-variant">close</span></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-center"><span className={`inline-flex items-center px-4 py-2 rounded-full text-[13px] font-bold ${selectedTx.catClass}`}>{selectedTx.category}</span></div>
              <div className="bg-surface-container-low rounded-xl p-4 space-y-3 text-[14px]">
                <div className="flex justify-between"><span className="text-secondary">Tanggal</span><span className="font-semibold text-on-surface">{selectedTx.date}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Deskripsi</span><span className="font-semibold text-on-surface text-right max-w-[260px]">{selectedTx.desc}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Invoice</span><span className="font-semibold text-primary">{selectedTx.invoiceNo}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Pelanggan</span><span className="font-semibold text-on-surface">{selectedTx.pelanggan}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Metode</span><span className="font-semibold text-on-surface">{selectedTx.metode}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Petugas</span><span className="font-semibold text-on-surface">{selectedTx.officer}</span></div>
                <div className="border-t border-outline-variant pt-3 flex justify-between"><span className="text-secondary">Jumlah</span><span className={`text-[18px] font-bold ${selectedTx.amtClass}`}>{formatRupiah(selectedTx.amount)}</span></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { handleExport('print'); setSelectedTx(null) }} className="flex-1 py-3 border border-outline-variant text-secondary rounded-xl font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">print</span> Cetak
                </button>
                <button onClick={() => setSelectedTx(null)} className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-all">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Alokasi Biaya */}
      {showBudgetDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowBudgetDetail(false)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-outline-variant flex items-center justify-between shrink-0">
              <h3 className="text-[20px] font-semibold text-on-surface">Detail Alokasi Biaya</h3>
              <button onClick={() => setShowBudgetDetail(false)} className="p-1 hover:bg-surface-container-highest rounded-full"><span className="material-symbols-outlined text-on-surface-variant">close</span></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="text-center">
                <p className="text-[13px] text-secondary">Total Pengeluaran: <strong className="text-on-surface">{formatRupiah(periodExpense)}</strong></p>
              </div>
              {[
                { label: 'Infrastruktur & Maintenance', pct: 45, amount: periodExpense * 0.45, desc: 'Pemeliharaan BTS, kabel fiber, router, switch, power backup, dan perangkat jaringan lainnya. Termasuk biaya teknisi lapangan.' },
                { label: 'Bandwidth ISP', pct: 30, amount: periodExpense * 0.30, desc: 'Sewa bandwidth upstream dari Tier-1 provider. Termasuk biaya langganan internet backbone dan koneksi peering.' },
                { label: 'Operasional & Gaji', pct: 20, amount: periodExpense * 0.20, desc: 'Gaji karyawan, biaya kantor, listrik, transportasi, ATK, dan kebutuhan operasional harian.' },
                { label: 'Lain-lain', pct: 5, amount: periodExpense * 0.05, desc: 'Biaya marketing, training, langganan software, pajak, dan pengeluaran tidak terduga.' },
              ].map((b, i) => (
                <div key={b.label} className="bg-surface-container-low rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${['bg-blue-500','bg-violet-500','bg-amber-500','bg-slate-400'][i]}`} />
                      <h4 className="text-[15px] font-semibold text-on-surface">{b.label}</h4>
                    </div>
                    <span className="text-[14px] font-bold text-on-surface">{b.pct}% <span className="text-[12px] text-secondary font-normal">({formatRupiah(b.amount)})</span></span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden mb-2">
                    <div className={`h-full rounded-full transition-all ${['bg-blue-500','bg-violet-500','bg-amber-500','bg-slate-400'][i]}`} style={{ width: `${b.pct}%` }} />
                  </div>
                  <p className="text-[12px] text-secondary leading-relaxed">{b.desc}</p>
                </div>
              ))}
              <button onClick={() => setShowBudgetDetail(false)} className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-all">Mengerti</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
