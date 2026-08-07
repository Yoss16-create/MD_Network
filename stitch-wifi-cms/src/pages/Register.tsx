
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', company: '' })
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password || !form.company) {
      setError('Semua field wajib diisi!')
      return
    }
    if (form.password !== form.confirm) {
      setError('Password dan konfirmasi tidak cocok!')
      return
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter!')
      return
    }
    const success = await register(form.name, form.email, form.password, form.company)
    if (success) {
      navigate('/')
    } else {
      setError('Email sudah terdaftar! Gunakan email lain.')
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-md p-8 border border-outline-variant">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="MD_Network" className="w-16 h-16 rounded-xl object-contain mx-auto mb-4" />
          <h1 className="text-[24px] font-bold text-primary">MD_Network</h1>
          <p className="text-secondary text-[14px] mt-1">WiFi Business Management CMS</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="text-center">
            <h2 className="text-[18px] font-semibold text-on-surface">Daftar Akun Baru</h2>
            <p className="text-[13px] text-secondary mt-1">Isi data berikut untuk membuat akun</p>
          </div>

          {error && (
            <div className="bg-error-container/20 text-error text-[13px] font-medium p-3 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span> {error}
            </div>
          )}

          <div>
            <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Nama Lengkap *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Nama lengkap" />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Email *</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="email@example.com" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Password *</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-3 pr-10 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Min 6 karakter" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">{showPw ? 'visibility_off' : 'visibility'}</span></button>
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Konfirmasi *</label>
              <input type={showPw ? 'text' : 'password'} value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Ulangi password" />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Nama Perusahaan *</label>
            <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Nama perusahaan ISP Anda" />
          </div>

          <button type="submit" className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-all shadow-md active:scale-[0.98]">
            Daftar Akun
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[13px] text-secondary">Sudah punya akun?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
