
import { useState, useRef } from 'react'

export default function Profile() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photo, setPhoto] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuAGujT-UcfxoSqqkFYdS9Q_ZDcTkmJzP0bmXSRq3aKrQr6fA2EZcXjJMQutK-tQCZQbFX4EYFqegBpHKQKYs43GkBmRJAouzX6_ypcSLOnCUR7yuviwcwGhkoZxmDFl2GkYE6KKIPOQvKHbXnijdN71GS5oNArgIqPjkniAnZ_CpN1XS2yCP50mYntIuuNfG-rmbKFE7m0qyE3elL0kz8Pff3jHnZzzIw1sXwHwERtSc2faI9bgFt7SCg')

  const [form, setForm] = useState({
    name: 'Admin Utama',
    email: 'admin@mdnetwork.co.id',
    phone: '081234567890',
    company: 'MD Network',
    address: 'Jl. Raya Internet No. 45, Jakarta Pusat',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [show2FA, setShow2FA] = useState(false)
  const [saved, setSaved] = useState(false)

  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' })
  const [pwError, setPwError] = useState('')

  const [notifEmail, setNotifEmail] = useState(true)
  const [notifWa, setNotifWa] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  const [faStep, setFaStep] = useState(1)
  const [faCode, setFaCode] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSaved(false)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        if (ev.target?.result) setPhoto(ev.target.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleChangePassword = () => {
    setPwError('')
    if (!pwForm.current) { setPwError('Password saat ini wajib diisi'); return }
    if (pwForm.newPw.length < 6) { setPwError('Password baru minimal 6 karakter'); return }
    if (pwForm.newPw !== pwForm.confirm) { setPwError('Konfirmasi password tidak cocok'); return }
    setShowPassword(false)
    setPwForm({ current: '', newPw: '', confirm: '' })
    alert('Password berhasil diubah!')
  }

  const handleToggle2FA = () => {
    if (faStep === 1) {
      setFaStep(2)
    } else {
      if (faCode.length === 6) {
        setShow2FA(false)
        setFaStep(1)
        setFaCode('')
        alert('Autentikasi Dua Faktor berhasil diaktifkan!')
      }
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[32px] font-bold tracking-[-0.02em] text-on-surface">Profil & Pengaturan</h2>
          <p className="text-secondary text-base">Kelola informasi akun dan preferensi Anda.</p>
        </div>
        <button onClick={() => { if (confirm('Anda yakin ingin logout?')) alert('Berhasil logout!') }} className="px-5 py-2.5 bg-error text-on-error rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95">
          <span className="material-symbols-outlined">logout</span> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant shadow-sm text-center">
            <div className="relative inline-block mx-auto">
              <img className="w-24 h-24 rounded-full border-4 border-primary/20 object-cover mx-auto mb-4" src={photo} alt="Admin" />
              <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-4 right-0 w-8 h-8 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-md hover:opacity-90 transition-all">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </div>
            <h3 className="text-[20px] font-semibold text-on-surface">{form.name}</h3>
            <p className="text-secondary text-[14px]">Super Administrator</p>
            <button onClick={() => fileInputRef.current?.click()} className="mt-4 px-4 py-2 border border-outline-variant rounded-lg text-secondary font-bold text-[12px] hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-sm align-middle mr-1">photo_camera</span> Ganti Foto
            </button>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm space-y-4">
            <h4 className="text-[14px] font-semibold text-on-surface">Informasi Akun</h4>
            <div className="space-y-3 text-[14px]">
              <div className="flex justify-between"><span className="text-secondary">Bergabung</span><span className="font-medium">12 Januari 2023</span></div>
              <div className="flex justify-between"><span className="text-secondary">Login Terakhir</span><span className="font-medium">Hari ini, {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span></div>
              <div className="flex justify-between"><span className="text-secondary">Status</span><span className="inline-flex items-center gap-1 text-green-600 font-bold"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Aktif</span></div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm space-y-4">
            <h4 className="text-[14px] font-semibold text-on-surface">Keamanan</h4>
            <button onClick={() => setShowPassword(true)} className="w-full py-3 px-4 border border-outline-variant rounded-lg text-secondary font-bold text-[12px] hover:bg-surface-container-low transition-colors text-left flex items-center gap-3">
              <span className="material-symbols-outlined text-lg">lock</span> Ganti Password
            </button>
            <button onClick={() => setShow2FA(true)} className="w-full py-3 px-4 border border-outline-variant rounded-lg text-secondary font-bold text-[12px] hover:bg-surface-container-low transition-colors text-left flex items-center gap-3">
              <span className="material-symbols-outlined text-lg">shield</span> Autentikasi Dua Faktor
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[20px] font-semibold text-on-surface">Edit Profil</h3>
              {saved && <span className="text-[12px] font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">Tersimpan!</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Nama Lengkap</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Email</label>
                <input name="email" value={form.email} onChange={handleChange} type="email" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Nomor Telepon</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Perusahaan</label>
                <input name="company" value={form.company} onChange={handleChange} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Alamat</label>
                <textarea name="address" value={form.address} onChange={handleChange} rows={2} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-8 justify-end">
              <button onClick={() => { if (confirm('Batalkan perubahan?')) window.location.reload() }} className="px-6 py-3 border border-outline-variant text-secondary rounded-lg font-bold hover:bg-surface-container-low transition-colors">Batal</button>
              <button onClick={handleSave} className="px-6 py-3 bg-primary text-on-primary rounded-lg font-bold shadow-md hover:opacity-90 transition-all active:scale-95">Simpan Perubahan</button>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant shadow-sm">
            <h3 className="text-[20px] font-semibold text-on-surface mb-6">Preferensi</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-outline-variant">
                <div><p className="text-[14px] font-medium text-on-surface">Notifikasi Email</p><p className="text-[12px] text-secondary">Terima laporan mingguan via email</p></div>
                <button onClick={() => setNotifEmail(!notifEmail)} className={`relative w-11 h-6 rounded-full transition-colors ${notifEmail ? 'bg-primary' : 'bg-surface-container-highest'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifEmail ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-outline-variant">
                <div><p className="text-[14px] font-medium text-on-surface">Notifikasi WhatsApp</p><p className="text-[12px] text-secondary">Dapatkan pengingat tagihan via WhatsApp</p></div>
                <button onClick={() => setNotifWa(!notifWa)} className={`relative w-11 h-6 rounded-full transition-colors ${notifWa ? 'bg-primary' : 'bg-surface-container-highest'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifWa ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div><p className="text-[14px] font-medium text-on-surface">Mode Gelap</p><p className="text-[12px] text-secondary">Tampilan latar belakang gelap</p></div>
                <button onClick={() => setDarkMode(!darkMode)} className={`relative w-11 h-6 rounded-full transition-colors ${darkMode ? 'bg-primary' : 'bg-surface-container-highest'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Ganti Password */}
      {showPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowPassword(false)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-outline-variant flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-on-surface">Ganti Password</h3>
              <button onClick={() => setShowPassword(false)} className="p-1 hover:bg-surface-container-highest rounded-full"><span className="material-symbols-outlined text-on-surface-variant">close</span></button>
            </div>
            <div className="p-6 space-y-4">
              {pwError && <div className="bg-error-container/20 text-error text-[13px] font-medium p-3 rounded-lg">{pwError}</div>}
              <div>
                <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Password Saat Ini</label>
                <input type="password" value={pwForm.current} onChange={e => setPwForm({ ...pwForm, current: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Password Baru</label>
                <input type="password" value={pwForm.newPw} onChange={e => setPwForm({ ...pwForm, newPw: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Konfirmasi Password Baru</label>
                <input type="password" value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowPassword(false); setPwError('') }} className="flex-1 py-3 border border-outline-variant text-secondary rounded-xl font-bold hover:bg-surface-container-low transition-colors">Batal</button>
                <button onClick={handleChangePassword} className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-all">Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2FA */}
      {show2FA && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => { setShow2FA(false); setFaStep(1); setFaCode('') }}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-outline-variant flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-on-surface">Autentikasi Dua Faktor</h3>
              <button onClick={() => { setShow2FA(false); setFaStep(1); setFaCode('') }} className="p-1 hover:bg-surface-container-highest rounded-full"><span className="material-symbols-outlined text-on-surface-variant">close</span></button>
            </div>
            <div className="p-6 space-y-4">
              {faStep === 1 ? (
                <>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined text-primary text-[32px]">shield</span>
                    </div>
                    <p className="text-[14px] text-on-surface font-medium mb-2">Aktifkan Autentikasi Dua Faktor</p>
                    <p className="text-[13px] text-secondary">Tambahkan lapisan keamanan ekstra ke akun Anda. Setiap login akan memerlukan kode verifikasi dari aplikasi authenticator.</p>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-4 text-center">
                    <p className="text-[11px] text-secondary mb-3 font-bold uppercase tracking-wider">Scan QR Code</p>
                    <div className="w-32 h-32 bg-white border-2 border-outline-variant rounded-xl mx-auto flex items-center justify-center">
                      <span className="material-symbols-outlined text-[48px] text-on-surface-variant">qr_code_2</span>
                    </div>
                    <p className="text-[11px] text-secondary mt-3">Atau masukkan kode manual: <strong className="text-on-surface">ABCD-EFGH-IJKL-MNOP</strong></p>
                  </div>
                  <button onClick={() => setFaStep(2)} className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-all">
                    Lanjutkan
                  </button>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined text-green-600 text-[32px]">pin</span>
                    </div>
                    <p className="text-[14px] text-on-surface font-medium mb-2">Verifikasi Kode</p>
                    <p className="text-[13px] text-secondary">Masukkan 6 digit kode dari aplikasi authenticator Anda.</p>
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Kode Verifikasi</label>
                    <input type="text" maxLength={6} value={faCode} onChange={e => setFaCode(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[18px] text-center tracking-[0.5em] font-bold focus:ring-2 focus:ring-primary/20 outline-none" placeholder="000000" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setFaStep(1)} className="flex-1 py-3 border border-outline-variant text-secondary rounded-xl font-bold hover:bg-surface-container-low transition-colors">Kembali</button>
                    <button onClick={handleToggle2FA} disabled={faCode.length !== 6} className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Verifikasi</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
