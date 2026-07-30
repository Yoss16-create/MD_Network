
import { useState } from 'react'
import { useData, type CustomerRecord } from '../context/DataContext'

export default function Customers() {
  const { customers, setCustomers, addCustomer } = useData()
  const [search, setSearch] = useState('')
  const [area, setArea] = useState('')
  const [status, setStatus] = useState('')
  const [selectedCust, setSelectedCust] = useState<CustomerRecord | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState<CustomerRecord | null>(null)
  const [addMode, setAddMode] = useState(false)
  const [addForm, setAddForm] = useState({ name: '', wa: '', email: '', pkg: 'WiFi Family (20 Mbps)', area: 'Central', address: '' })

  const filtered = customers.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.id.toLowerCase().includes(search.toLowerCase())) return false
    if (area && c.area !== area) return false
    if (status && c.status !== status) return false
    return true
  })

  const getWALink = (phone: string, name: string = '') => {
    const p = phone.startsWith('62') ? phone : `62${phone.slice(1)}`
    const text = encodeURIComponent(`Halo *${name || 'Pelanggan'}*,\n\nKami dari *MD_Network*. Ada yang bisa kami bantu?\n\nTerima kasih.`)
    return `https://wa.me/${p}?text=${text}`
  }

  const openEdit = (c: CustomerRecord) => { setEditForm({ ...c }); setEditMode(true) }
  const saveEdit = () => {
    if (editForm) { setCustomers(customers.map(c => c.id === editForm.id ? editForm : c)); setEditMode(false); setEditForm(null) }
  }
  const saveAdd = () => {
    const newId = `ISP-${String(customers.length + 1).padStart(3, '0')}`
    addCustomer({
      id: newId, name: addForm.name, initials: addForm.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(), wa: addForm.wa, email: addForm.email,
      pkg: addForm.pkg, area: addForm.area, status: 'Aktif', tagihan: 'Lunas', amount: 150000, address: addForm.address,
      joinDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }), lastPayment: '-', invoices: [],
      history: [{ time: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }), action: 'Pelanggan terdaftar - ' + addForm.pkg }]
    })
    setAddMode(false)
    setAddForm({ name: '', wa: '', email: '', pkg: 'WiFi Family (20 Mbps)', area: 'Central', address: '' })
  }

  const toggleStatus = (c: CustomerRecord) => {
    setCustomers(customers.map(item => item.id === c.id ? { ...item, status: item.status === 'Aktif' ? 'Belum Bayar' : 'Aktif', tagihan: item.status === 'Aktif' ? 'Rp 350.000' : 'Lunas' } : item))
  }

  const statusColor = (s: string) => s === 'Aktif' ? 'bg-[#E8F5E9] text-[#2E7D32]' : s === 'Belum Bayar' ? 'bg-error-container/40 text-error' : s === 'Jatuh Tempo' ? 'bg-[#FFF3E0] text-[#E65100]' : s === 'Nunggak' ? 'bg-red-200 text-red-800' : 'bg-slate-200 text-slate-600'

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[32px] font-bold tracking-[-0.02em] text-on-surface">Semua Pelanggan</h2>
          <div className="flex items-center gap-2 mt-1 text-on-surface-variant"><span className="text-[14px]">Dashboard</span><span className="material-symbols-outlined text-sm">chevron_right</span><span className="text-[14px] font-semibold text-primary">Manajemen Pelanggan</span></div>
        </div>
        <button onClick={() => setAddMode(true)} className="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold transition-all hover:opacity-90 active:scale-95 shadow-sm">
          <span className="material-symbols-outlined">person_add</span> Tambah Pelanggan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm flex items-center gap-3">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
          <input value={search} onChange={e => setSearch(e.target.value)} className="flex-1 border-none bg-transparent focus:ring-0 text-base outline-none" placeholder="Cari Nama atau ID..." />
        </div>
        <div className="md:col-span-3 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm flex items-center gap-3">
          <span className="material-symbols-outlined text-on-surface-variant">map</span>
          <select value={area} onChange={e => setArea(e.target.value)} className="flex-1 border-none bg-transparent focus:ring-0 text-base appearance-none cursor-pointer outline-none">
            <option value="">Semua Area</option><option>Pusat</option><option>Utara</option><option>Selatan</option><option>Barat</option>
          </select>
        </div>
        <div className="md:col-span-3 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm flex items-center gap-3">
          <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
          <select value={status} onChange={e => setStatus(e.target.value)} className="flex-1 border-none bg-transparent focus:ring-0 text-base appearance-none cursor-pointer outline-none">
            <option value="">Semua Status</option><option>Aktif</option><option>Belum Bayar</option><option>Jatuh Tempo</option><option>Nunggak</option><option>Tidak Aktif</option>
          </select>
        </div>
        <div onClick={() => { setSearch(''); setArea(''); setStatus('') }} className="md:col-span-1 flex items-center justify-center bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm hover:bg-surface-container-low cursor-pointer transition-colors">
          <span className="material-symbols-outlined text-secondary">refresh</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low"><tr>
              <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">ID</th>
              <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Nama</th>
              <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">WhatsApp</th>
              <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Paket</th>
              <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Area</th>
              <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Status</th>
              <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase">Tagihan</th>
              <th className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase text-right">Action</th>
            </tr></thead>
            <tbody className="divide-y divide-outline-variant">
              {filtered.map((c) => (
                <tr key={c.id} onClick={() => setSelectedCust(c)} className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                  <td className="px-6 py-5"><span className="text-[14px] font-semibold text-secondary">{c.id}</span></td>
                  <td className="px-6 py-5"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{c.initials}</div><span className="text-base font-medium">{c.name}</span></div></td>
                  <td className="px-6 py-5"><a href={getWALink(c.wa, c.name)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex items-center gap-1 text-[14px] text-secondary hover:text-primary transition-colors"><span className="material-symbols-outlined text-sm">chat</span>{c.wa}</a></td>
                  <td className="px-6 py-5 text-[14px]">{c.pkg}</td>
                  <td className="px-6 py-5"><span className="inline-flex items-center gap-1 text-[14px] text-on-surface-variant"><span className="material-symbols-outlined text-[16px]">location_on</span>{c.area}</span></td>
                  <td className="px-6 py-5"><span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold ${statusColor(c.status)}`}>{c.status}</span></td>
                  <td className="px-6 py-5"><span className={`text-[14px] font-medium ${c.tagihan === 'Lunas' || c.tagihan === '-' ? 'text-primary' : 'text-error'}`}>{c.tagihan}</span></td>
                  <td className="px-6 py-5 text-right"><div className="flex items-center justify-end gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedCust(c) }} className="p-2 hover:bg-primary-container/10 text-secondary hover:text-primary rounded-lg transition-colors"><span className="material-symbols-outlined">visibility</span></button>
                    <button onClick={(e) => { e.stopPropagation(); openEdit(c) }} className="p-2 hover:bg-primary-container/10 text-secondary hover:text-primary rounded-lg transition-colors"><span className="material-symbols-outlined">edit</span></button>
                    <button onClick={(e) => { e.stopPropagation(); toggleStatus(c) }} className="p-2 hover:bg-primary-container/10 text-secondary hover:text-primary rounded-lg transition-colors"><span className="material-symbols-outlined">swap_horiz</span></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant bg-surface-container-lowest">
          <span className="text-[12px] font-semibold text-on-surface-variant">Menampilkan {filtered.length} dari {customers.length} pelanggan</span>
        </div>
      </div>

      {selectedCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSelectedCust(null)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-outline-variant flex items-center justify-between shrink-0">
              <h3 className="text-[20px] font-semibold text-on-surface">Detail Pelanggan</h3>
              <button onClick={() => setSelectedCust(null)} className="p-1 hover:bg-surface-container-highest rounded-full"><span className="material-symbols-outlined text-on-surface-variant">close</span></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0">{selectedCust.initials}</div>
                <div><h3 className="text-[18px] font-bold text-on-surface">{selectedCust.name}</h3><span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold mt-1 ${statusColor(selectedCust.status)}`}>{selectedCust.status}</span></div>
              </div>
              <div className="bg-surface-container-low rounded-xl p-4 space-y-3 text-[14px]">
                <div className="flex justify-between"><span className="text-secondary">ID</span><span className="font-bold text-primary">{selectedCust.id}</span></div>
                <div className="flex justify-between"><span className="text-secondary">WhatsApp</span><a href={getWALink(selectedCust.wa)} target="_blank" rel="noopener noreferrer" className="font-semibold text-on-surface hover:text-primary">{selectedCust.wa}</a></div>
                <div className="flex justify-between"><span className="text-secondary">Paket</span><span className="font-semibold text-on-surface">{selectedCust.pkg}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Area</span><span className="font-semibold text-on-surface">{selectedCust.area}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Alamat</span><span className="font-semibold text-on-surface text-right max-w-[220px]">{selectedCust.address}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Bergabung</span><span className="font-semibold text-on-surface">{selectedCust.joinDate}</span></div>
              </div>
              {selectedCust.invoices.length > 0 && (
                <div>
                  <h4 className="text-[16px] font-semibold text-on-surface mb-3">Riwayat Invoice</h4>
                  <div className="overflow-hidden rounded-xl border border-outline-variant">
                    <table className="w-full text-left text-[13px]"><thead className="bg-surface-container-low"><tr><th className="px-4 py-3">Invoice</th><th className="px-4 py-3">Periode</th><th className="px-4 py-3">Jumlah</th><th className="px-4 py-3">Status</th></tr></thead>
                      <tbody className="divide-y divide-outline-variant">{selectedCust.invoices.map((inv, i) => (
                        <tr key={i}><td className="px-4 py-3 font-bold text-primary">{inv.no}</td><td className="px-4 py-3">{inv.period}</td><td className="px-4 py-3 font-semibold">Rp {inv.amount.toLocaleString('id-ID')}</td>
                          <td className="px-4 py-3"><span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${inv.status === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-error-container/40 text-error'}`}>{inv.status}</span></td></tr>
                      ))}</tbody></table>
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <a href={getWALink(selectedCust.wa, selectedCust.name)} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-green-100 text-green-700 rounded-xl font-bold hover:bg-green-200 transition-colors flex items-center justify-center gap-2"><span className="material-symbols-outlined text-lg">chat</span> WhatsApp</a>
                <button onClick={() => { setSelectedCust(null); openEdit(selectedCust) }} className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-all">Edit</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editMode && editForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => { setEditMode(false); setEditForm(null) }}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-outline-variant flex items-center justify-between shrink-0"><h3 className="text-[20px] font-semibold text-on-surface">Edit Pelanggan</h3><button onClick={() => { setEditMode(false); setEditForm(null) }} className="p-1 hover:bg-surface-container-highest rounded-full"><span className="material-symbols-outlined text-on-surface-variant">close</span></button></div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-1">Nama</label><input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none" /></div>
                <div><label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-1">WhatsApp</label><input value={editForm.wa} onChange={e => setEditForm({ ...editForm, wa: e.target.value })} className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none" /></div>
                <div><label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-1">Paket</label><select value={editForm.pkg} onChange={e => setEditForm({ ...editForm, pkg: e.target.value })} className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none"><option>WiFi Basic (10 Mbps)</option><option>WiFi Family (20 Mbps)</option><option>WiFi Pro (50 Mbps)</option><option>Ultra-Net (100 Mbps)</option></select></div>
                <div><label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-1">Status</label><select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none"><option>Aktif</option><option>Belum Bayar</option><option>Jatuh Tempo</option><option>Nunggak</option><option>Tidak Aktif</option></select></div>
                <div><label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-1">Area</label><select value={editForm.area} onChange={e => setEditForm({ ...editForm, area: e.target.value })} className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none"><option>Pusat</option><option>Utara</option><option>Selatan</option><option>Barat</option></select></div>
              </div>
              <div className="flex gap-3 pt-2"><button onClick={() => { setEditMode(false); setEditForm(null) }} className="flex-1 py-3 border border-outline-variant text-secondary rounded-xl font-bold">Batal</button><button onClick={saveEdit} className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-bold">Simpan</button></div>
            </div>
          </div>
        </div>
      )}

      {addMode && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setAddMode(false)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-outline-variant flex items-center justify-between"><h3 className="text-[20px] font-semibold text-on-surface">Tambah Pelanggan Baru</h3><button onClick={() => setAddMode(false)} className="p-1 hover:bg-surface-container-highest rounded-full"><span className="material-symbols-outlined text-on-surface-variant">close</span></button></div>
            <div className="p-6 space-y-4">
              <div><label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-1">Nama Lengkap *</label><input value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Nama pelanggan" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-1">WhatsApp *</label><input value={addForm.wa} onChange={e => setAddForm({ ...addForm, wa: e.target.value })} className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none" placeholder="08123456789" /></div>
                <div><label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-1">Paket</label><select value={addForm.pkg} onChange={e => setAddForm({ ...addForm, pkg: e.target.value })} className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none"><option>WiFi Basic (10 Mbps)</option><option>WiFi Family (20 Mbps)</option><option>WiFi Pro (50 Mbps)</option><option>Ultra-Net (100 Mbps)</option></select></div>
                <div><label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-1">Area</label><select value={addForm.area} onChange={e => setAddForm({ ...addForm, area: e.target.value })} className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none"><option>Pusat</option><option>Utara</option><option>Selatan</option><option>Barat</option></select></div>
              </div>
              <div className="flex gap-3 pt-2"><button onClick={() => setAddMode(false)} className="flex-1 py-3 border border-outline-variant text-secondary rounded-xl font-bold">Batal</button><button onClick={saveAdd} disabled={!addForm.name || !addForm.wa} className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-bold disabled:opacity-50">Simpan</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
