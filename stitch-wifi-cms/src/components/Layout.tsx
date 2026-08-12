import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import MobileHeader from './MobileHeader'


export default function Layout() {

  return (
    <div className="
      min-h-screen
      bg-slate-50
      overflow-x-hidden
    ">

      {/* Sidebar Desktop */}
      <Sidebar />


      {/* Konten Utama */}
      <main
        className="
          w-full
          md:ml-[220px]
          min-h-screen
          pb-20
          md:pb-0
        "
      >

        {/* Header Mobile */}
        <MobileHeader />


        <div
          className="
            w-full
            px-3
            sm:px-4
            md:px-6
            pt-20
            md:pt-4
            pb-4
          "
        >

          <Outlet />

        </div>


      </main>


      {/* Navigasi bawah Mobile */}
      <BottomNav />


    </div>
  )
}