
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('md_network_remember')
    if (saved) {
      const { email, password } = JSON.parse(saved)
      setForm({ email, password })
      setRemember(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (login(form.email, form.password)) {
      if (remember) {
        localStorage.setItem('md_network_remember', JSON.stringify({ email: form.email, password: form.password }))
      } else {
        localStorage.removeItem('md_network_remember')
      }
      navigate('/')
    } else {
      setError('Email atau password salah!')
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

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="text-center">
            <h2 className="text-[18px] font-semibold text-on-surface">Masuk ke Akun</h2>
            <p className="text-[13px] text-secondary mt-1">Silakan login untuk melanjutkan</p>
          </div>

          {error && (
            <div className="bg-error-container/20 text-error text-[13px] font-medium p-3 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span> {error}
            </div>
          )}

          <div>
            <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Email</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">mail</span>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="email@mdnetwork.co.id" />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">lock</span>
              <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full pl-10 pr-12 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Masukkan password" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined text-[20px]">{showPw ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          <button type="submit" className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-all shadow-md active:scale-[0.98]">
            Masuk
          </button>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20" />
              <span className="text-[12px] text-secondary">Ingat saya</span>
            </label>
            <Link to="/forgot-password" className="text-[12px] text-primary hover:underline font-medium">Lupa password?</Link>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[13px] text-secondary">Belum punya akun?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">Daftar di sini</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
