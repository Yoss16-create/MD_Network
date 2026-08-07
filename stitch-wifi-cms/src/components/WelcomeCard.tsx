import { useEffect, useState } from "react"
import WelcomeIllustration from "./WelcomeIllustration"

export default function WelcomeCard() {

  const [now, setNow] = useState(new Date())

  useEffect(() => {

    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(timer)

  }, [])

  const greeting =
    now.getHours() < 11
      ? "Pagi"
      : now.getHours() < 15
      ? "Siang"
      : now.getHours() < 18
      ? "Sore"
      : "Malam"

  const tanggal = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  const jam = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })



  return (
  <div
    className="
      relative
      overflow-hidden
      rounded-3xl
      bg-gradient-to-r
      from-blue-600
      via-indigo-600
      to-purple-700
      shadow-xl
      px-6
      py-6
      text-white
      min-h-[235px]
    "
  >
    {/* Background */}
    <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10"></div>
    <div className="absolute -right-5 bottom-0 w-28 h-28 rounded-full bg-white/10"></div>

    {/* Content */}
    <div className="relative z-10 h-full flex items-start">

      {/* Text */}
      <div className="w-[65%]">

        <div className="flex items-center gap-2">

          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>

          <span className="text-sm font-semibold text-green-100">
            System Online
          </span>

        </div>

        <h2 className="mt-4 text-[28px] font-bold leading-tight">
          Selamat {greeting}, Yos
        </h2>

        <p className="mt-2 text-[14px] leading-6 text-blue-100">
          Selamat datang kembali di Dashboard MD Network
        </p>

        <div className="mt-6 space-y-3">

          <div className="flex items-center gap-3">

            <span className="material-symbols-outlined text-[22px]">
              calendar_month
            </span>

            <span className="text-[15px] font-medium">
              {tanggal}
            </span>

          </div>

          <div className="flex items-center gap-3">

            <span className="material-symbols-outlined text-[22px]">
              schedule
            </span>

            <span className="text-[15px] font-medium">
              {jam} WIB
            </span>

          </div>

        </div>

      </div>

      {/* Ilustrasi */}
  <div className="absolute right-5 -bottom-6">
  <WelcomeIllustration />
</div>

    </div>

  </div>
)
}