import { useMemo, useState } from "react"
import { useData, type InvoiceRecord } from "../context/DataContext"

export default function Billing() {

  const {
    invoices,
    addInvoice,
    updateInvoice,
    addPayment
  } = useData()

  const [selected, setSelected] = useState<InvoiceRecord | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("Semua")

  const [form, setForm] = useState({
    name: "",
    period: "",
    amount: "",
    due: ""
  })

  const createInvoice = () => {

    addInvoice({

      no: `INV-${Date.now()}`,

      customerId: "",

      name: form.name,

      initials: form.name
        .split(" ")
        .map(x => x[0])
        .join("")
        .toUpperCase(),

      wa: "-",

      pkg: "Internet",

      period: form.period,

      amount: Number(form.amount),

      due: form.due,

      status: "Belum Dibayar",

      statusClass: "bg-red-100 text-red-600",

      dotClass: "bg-red-500",

      officer: "Admin",

      paymentMethod: "-",

      paidDate: "-",

      history: [

        {

          time: new Date().toLocaleDateString("id-ID"),

          action: "Tagihan dibuat",

          user: "Admin"

        }

      ]

    })

    setShowAdd(false)

    setForm({

      name: "",

      period: "",

      amount: "",

      due: ""

    })

  }

  const setPaid = (inv: InvoiceRecord) => {
    const today = new Date().toLocaleDateString("id-ID")
    const time = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB"

    updateInvoice(inv.no, {
      status: "Lunas",
      statusClass: "bg-green-100 text-green-600",
      dotClass: "bg-green-500",
      paymentMethod: "Transfer Bank",
      paidDate: `${today}, ${time}`
    })

    addPayment({
      no: `TRX-${Date.now()}`,
      customerId: inv.customerId,
      name: inv.name,
      initials: inv.initials,
      wa: inv.wa,
      method: "Transfer Bank",
      bank: "BCA",
      amount: inv.amount,
      date: today,
      time,
      status: "Lunas",
      statusClass: "bg-green-500/10 text-green-600",
      invoiceNo: inv.no,
      officer: "Admin",
      history: [{ time: `${today}, ${time}`, action: "Pembayaran diterima via BCA", user: "Admin" }]
    })
  }

  const filteredInvoices = useMemo(() => {

    return invoices.filter(inv => {

      const matchSearch =

        inv.name.toLowerCase().includes(search.toLowerCase()) ||

        inv.no.toLowerCase().includes(search.toLowerCase())

      const matchStatus =

        filterStatus === "Semua"

          ? true

          : inv.status === filterStatus

      return matchSearch && matchStatus

    })

  }, [invoices, search, filterStatus])

  const totalInvoice = invoices.length

  const paidInvoice = invoices.filter(
    i => i.status === "Lunas"
  ).length

  const unpaidInvoice = invoices.filter(
    i => i.status === "Belum Dibayar"
  ).length

  const dueInvoice = invoices.filter(
    i => i.status === "Jatuh Tempo"
  ).length

  const cards = [

    {

      title: "Total Invoice",

      value: totalInvoice,

      icon: "receipt_long",

      color: "bg-blue-100 text-blue-600",

      border: "border-blue-500"

    },

    {

      title: "Lunas",

      value: paidInvoice,

      icon: "payments",

      color: "bg-green-100 text-green-600",

      border: "border-green-500"

    },

    {

      title: "Belum Bayar",

      value: unpaidInvoice,

      icon: "schedule",

      color: "bg-red-100 text-red-600",

      border: "border-red-500"

    },

    {

      title: "Jatuh Tempo",

      value: dueInvoice,

      icon: "warning",

      color: "bg-orange-100 text-orange-600",

      border: "border-orange-500"

    }

  ]

  return (

    <div className="w-full p-4 md:p-8 space-y-6">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">

            Manajemen Tagihan

          </h1>

          <p className="text-sm text-slate-500 mt-1">

            Kelola seluruh invoice pelanggan MD Network

          </p>

        </div>

        <button

          onClick={() => setShowAdd(true)}

          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"

        >

          + Buat Tagihan

        </button>

      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">

        {cards.map(card => (

          <div

            key={card.title}

            className={`
              bg-white
              rounded-2xl
              border-t-4
              ${card.border}
              shadow-sm
              p-5
            `}

          >

            <div className="flex justify-between items-center">

              <div>

                <p className="text-sm text-slate-500">

                  {card.title}

                </p>

                <h2 className="text-3xl font-bold mt-2 text-slate-800">

                  {card.value}

                </h2>

              </div>

              <div

                className={`
                  w-14
                  h-14
                  rounded-full
                  flex
                  items-center
                  justify-center
                  ${card.color}
                `}

              >

                <span className="material-symbols-outlined text-3xl">

                  {card.icon}

                </span>

              </div>

            </div>

          </div>

        ))}

      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5">

        <div className="flex flex-col md:flex-row gap-4">

          <input

            type="text"

            placeholder="Cari nama pelanggan atau nomor invoice..."

            value={search}

            onChange={(e) => setSearch(e.target.value)}

            className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"

          />

          <select

            value={filterStatus}

            onChange={(e) => setFilterStatus(e.target.value)}

            className="border rounded-xl px-4 py-3"

          >

            <option>Semua</option>

            <option>Lunas</option>

            <option>Belum Dibayar</option>

            <option>Jatuh Tempo</option>

          </select>

        </div>

      </div>

      {/* Part 2 dimulai dari sini */}
            {/* LIST INVOICE */}

      <div className="space-y-4">

        {filteredInvoices.length === 0 && (

          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">

            <span className="material-symbols-outlined text-6xl text-slate-300">
              receipt_long
            </span>

            <h2 className="mt-4 text-xl font-bold text-slate-700">
              Tidak ada data tagihan
            </h2>

            <p className="text-slate-500 mt-2">
              Coba ubah pencarian atau filter yang dipilih.
            </p>

          </div>

        )}

        {filteredInvoices.map((inv) => (

          <div
            key={inv.no}
            className="
              bg-white
              rounded-2xl
              shadow-sm
              hover:shadow-lg
              transition-all
              border
              border-slate-100
              overflow-hidden
            "
          >

            <div className="p-5">

              <div className="flex justify-between items-start">

                <div className="flex gap-4">

                  <div
                    className="
                      w-14
                      h-14
                      rounded-full
                      bg-blue-100
                      text-blue-700
                      flex
                      items-center
                      justify-center
                      font-bold
                      text-lg
                    "
                  >
                    {inv.initials}
                  </div>

                  <div>

                    <h2 className="font-bold text-lg text-slate-800">
                      {inv.name}
                    </h2>

                    <p className="text-sm text-slate-500">
                      {inv.no}
                    </p>

                  </div>

                </div>

                <span
                  className={`
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-bold
                    ${inv.statusClass}
                  `}
                >
                  {inv.status}
                </span>

              </div>

              <div className="grid md:grid-cols-4 gap-4 mt-6">

                <div>

                  <p className="text-xs text-slate-500">
                    Paket
                  </p>

                  <p className="font-semibold mt-1">
                    {inv.pkg}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Periode
                  </p>

                  <p className="font-semibold mt-1">
                    {inv.period}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Nominal
                  </p>

                  <p className="font-bold text-blue-600 mt-1">
                    Rp {inv.amount.toLocaleString("id-ID")}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Jatuh Tempo
                  </p>

                  <p className="font-semibold mt-1">
                    {inv.due}
                  </p>

                </div>

              </div>

            </div>

            <div
              className="
                bg-slate-50
                border-t
                px-5
                py-4
                flex
                gap-3
                justify-end
                flex-wrap
              "
            >

              <button
                onClick={() => setSelected(inv)}
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  font-semibold
                  hover:bg-blue-100
                "
              >
                Detail
              </button>

              {inv.status !== "Lunas" && (

                <button
                  onClick={() => setPaid(inv)}
                  className="
                    px-4
                    py-2
                    rounded-xl
                    bg-green-50
                    text-green-600
                    font-semibold
                    hover:bg-green-100
                  "
                >
                  Tandai Lunas
                </button>

              )}

            </div>

          </div>

        ))}

      </div>

      {/* PART 3 DIMULAI DARI SINI */}
            {/* ===========================
          MODAL TAMBAH TAGIHAN
      =========================== */}

      {showAdd && (

        <div className="
          fixed
          inset-0
          bg-black/40
          backdrop-blur-sm
          flex
          items-center
          justify-center
          z-50
          p-4
        ">

          <div className="
            bg-white
            rounded-3xl
            w-full
            max-w-lg
            shadow-2xl
            overflow-hidden
          ">

            <div className="
              bg-blue-600
              text-white
              px-6
              py-5
            ">

              <h2 className="text-2xl font-bold">
                Tambah Tagihan Baru
              </h2>

              <p className="text-blue-100 mt-1">
                Lengkapi informasi tagihan pelanggan.
              </p>

            </div>

            <div className="p-6 space-y-4">

              <input
                className="
                  w-full
                  border
                  rounded-xl
                  p-3
                  focus:ring-2
                  focus:ring-blue-500
                  outline-none
                "
                placeholder="Nama Pelanggan"
                value={form.name}
                onChange={(e)=>
                  setForm({
                    ...form,
                    name:e.target.value
                  })
                }
              />

              <input
                className="
                  w-full
                  border
                  rounded-xl
                  p-3
                  focus:ring-2
                  focus:ring-blue-500
                  outline-none
                "
                placeholder="Periode"
                value={form.period}
                onChange={(e)=>
                  setForm({
                    ...form,
                    period:e.target.value
                  })
                }
              />

              <input
                className="
                  w-full
                  border
                  rounded-xl
                  p-3
                  focus:ring-2
                  focus:ring-blue-500
                  outline-none
                "
                placeholder="Nominal"
                value={form.amount}
                onChange={(e)=>
                  setForm({
                    ...form,
                    amount:e.target.value
                  })
                }
              />

              <input
                className="
                  w-full
                  border
                  rounded-xl
                  p-3
                  focus:ring-2
                  focus:ring-blue-500
                  outline-none
                "
                placeholder="Tanggal Jatuh Tempo"
                value={form.due}
                onChange={(e)=>
                  setForm({
                    ...form,
                    due:e.target.value
                  })
                }
              />

            </div>

            <div className="
              px-6
              pb-6
              flex
              gap-3
            ">

              <button

                onClick={createInvoice}

                className="
                  flex-1
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  py-3
                  rounded-xl
                  font-semibold
                "

              >

                Simpan

              </button>

              <button

                onClick={() => setShowAdd(false)}

                className="
                  flex-1
                  border
                  rounded-xl
                  py-3
                  font-semibold
                "

              >

                Batal

              </button>

            </div>

          </div>

        </div>

      )}

      {/* ===========================
          MODAL DETAIL
      =========================== */}

      {selected && (

        <div className="
          fixed
          inset-0
          bg-black/40
          backdrop-blur-sm
          flex
          justify-center
          items-center
          z-50
          p-4
        ">

          <div className="
            bg-white
            rounded-3xl
            shadow-2xl
            w-full
            max-w-xl
            overflow-hidden
          ">

            <div className="
              bg-slate-800
              text-white
              px-6
              py-5
            ">

              <h2 className="text-2xl font-bold">
                Detail Tagihan
              </h2>

              <p className="text-slate-300 mt-1">
                Informasi lengkap invoice pelanggan
              </p>

            </div>

            <div className="p-6 space-y-4">

              <div className="flex justify-between">

                <span className="text-slate-500">
                  No Invoice
                </span>

                <strong>
                  {selected.no}
                </strong>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Pelanggan
                </span>

                <strong>
                  {selected.name}
                </strong>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Paket
                </span>

                <strong>
                  {selected.pkg}
                </strong>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Periode
                </span>

                <strong>
                  {selected.period}
                </strong>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Nominal
                </span>

                <strong className="text-blue-600">
                  Rp {selected.amount.toLocaleString("id-ID")}
                </strong>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Status
                </span>

                <span className={`
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-bold
                  ${selected.statusClass}
                `}>

                  {selected.status}

                </span>

              </div>

            </div>

            <div className="
              p-6
              border-t
            ">

              <button

                onClick={() => setSelected(null)}

                className="
                  w-full
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  py-3
                  rounded-xl
                  font-semibold
                "

              >

                Tutup

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  )

}