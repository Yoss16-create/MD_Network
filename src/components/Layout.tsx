import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopAppBar from './TopAppBar'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="md:ml-[260px] flex flex-col min-h-screen">
        <TopAppBar />
        <main className="flex-1 pb-20 md:pb-8">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
