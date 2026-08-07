export default function WelcomeIllustration() {
  return (
    <div className="absolute right-0 bottom-0 w-28 h-28 pointer-events-none">

      {/* Awan */}

      <div className="absolute top-2 left-3 opacity-70">

        <div className="w-8 h-3 bg-white/50 rounded-full"></div>

        <div className="absolute -top-1 left-2 w-5 h-3 bg-white/50 rounded-full"></div>

      </div>

      {/* Gelombang Sinyal */}

      <div className="absolute top-1 right-3">

        <div className="w-8 h-8 rounded-full border-2 border-blue-200/60 animate-pulse"></div>

        <div className="absolute top-1 left-1 w-6 h-6 rounded-full border-2 border-blue-200/60"></div>

        <div className="absolute top-2 left-2 w-4 h-4 rounded-full border-2 border-blue-200/60"></div>

        <div className="absolute top-[14px] left-[14px] w-1.5 h-1.5 rounded-full bg-blue-200"></div>

      </div>

      {/* Tower */}

      <div className="absolute bottom-0 right-6">

        <div className="absolute bottom-14 left-[10px] w-[2px] h-3 bg-red-500 rounded-full animate-pulse"></div>

        <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[58px] border-l-transparent border-r-transparent border-b-slate-700"></div>

        <div className="absolute bottom-0 left-[11px] w-[2px] h-16 bg-slate-700"></div>

      </div>

      {/* Gedung */}

      <div className="absolute bottom-0 left-7 w-11 h-14 rounded-t-lg bg-blue-500 shadow-lg">

        <div className="grid grid-cols-2 gap-1 p-1.5">

          <div className="w-1.5 h-1.5 bg-blue-200 rounded-sm"></div>
          <div className="w-1.5 h-1.5 bg-blue-200 rounded-sm"></div>
          <div className="w-1.5 h-1.5 bg-blue-200 rounded-sm"></div>
          <div className="w-1.5 h-1.5 bg-blue-200 rounded-sm"></div>
          <div className="w-1.5 h-1.5 bg-blue-200 rounded-sm"></div>
          <div className="w-1.5 h-1.5 bg-blue-200 rounded-sm"></div>

        </div>

      </div>

      {/* Pohon */}

      <div className="absolute bottom-0 left-0">

        <div className="w-1 h-5 bg-amber-700 mx-auto"></div>

        <div className="w-5 h-5 rounded-full bg-green-500 -mt-1"></div>

      </div>

    </div>
  )
}