
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: string
  company: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  register: (name: string, email: string, password: string, company: string) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const USERS_KEY = 'md_network_users'
const CURRENT_USER_KEY = 'md_network_current_user'

const defaultUsers: (User & { password: string })[] = [
  { id: 'ADM-001', name: 'Admin Utama', email: 'admin@mdnetwork.co.id', password: 'admin123', role: 'Super Administrator', company: 'MD_Network' },
  { id: 'KSR-001', name: 'Budi Kasir', email: 'kasir@mdnetwork.co.id', password: 'kasir123', role: 'Kasir', company: 'MD_Network' },
  { id: 'TKN-001', name: 'Rian Teknisi', email: 'teknisi@mdnetwork.co.id', password: 'teknisi123', role: 'Teknisi', company: 'MD_Network' },
]

function getUsers(): (User & { password: string })[] {
  const stored = localStorage.getItem(USERS_KEY)
  if (stored) return JSON.parse(stored)
  localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers))
  return defaultUsers
}

function saveUsers(users: (User & { password: string })[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(CURRENT_USER_KEY)
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const login = (email: string, password: string): boolean => {
    const users = getUsers()
    const found = users.find(u => u.email === email && u.password === password)
    if (found) {
      const { password: _, ...userData } = found
      setUser(userData)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData))
      return true
    }
    return false
  }

  const register = (name: string, email: string, password: string, company: string): boolean => {
    const users = getUsers()
    if (users.find(u => u.email === email)) return false
    const id = `USR-${String(users.length + 1).padStart(3, '0')}`
    const newUser = { id, name, email, password, role: 'Administrator', company }
    saveUsers([...users, newUser])
    const { password: _, ...userData } = newUser
    setUser(userData)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(CURRENT_USER_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
