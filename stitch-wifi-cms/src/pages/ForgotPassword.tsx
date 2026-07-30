
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email) {
      setError('Masukkan email Anda!')
      return
    }
    const users = JSON.parse(localStorage.getItem('md_network_users') || '[]')
    if (!users.find((u: { email: string }) => u.email === email)) {
      setError('Email tidak ditemukan!')
      return
    }
    setSent(true)
    setError('')
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-md p-8 border border-outline-variant">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="MD_Network" className="w-16 h-16 rounded-xl object-contain mx-auto mb-4" />
          <h1 className="text-[24px] font-bold text-primary">MD_Network</h1>
          <p className="text-secondary text-[14px] mt-1">WiFi Business Management CMS</p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          <div className="text-center">
            <h2 className="text-[18px] font-semibold text-on-surface">Lupa Password</h2>
            <p className="text-[13px] text-secondary mt-1">Masukkan email Anda untuk reset password</p>
          </div>

          {error && (
            <div className="bg-error-container/20 text-error text-[13px] font-medium p-3 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span> {error}
            </div>
          )}

          {sent && (
            <div className="bg-green-100 text-green-700 text-[13px] font-medium p-4 rounded-lg flex items-start gap-2">
              <span className="material-symbols-outlined text-sm shrink-0 mt-0.5">check_circle</span>
              <div>
                <p className="font-bold mb-1">Link reset password telah dikirim!</p>
                <p className="text-[12px]">Silakan cek email <strong>{email}</strong> untuk melanjutkan reset password.</p>
                <p className="text-[11px] mt-2 opacity-70">(Demo: password akan di-reset ke <strong>password123</strong>)</p>
              </div>
            </div>
          )}

          {!sent && (
            <>
              <div>
                <label className="block text-[12px] font-semibold text-secondary uppercase tracking-[0.05em] mb-2">Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">mail</span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="email@mdnetwork.co.id" />
                </div>
              </div>

              <button type="submit" className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-all shadow-md active:scale-[0.98]">
                Kirim Link Reset
              </button>
            </>
          )}
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-[13px] text-primary font-bold hover:underline flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  )
}
