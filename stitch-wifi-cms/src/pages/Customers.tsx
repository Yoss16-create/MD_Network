import { useData } from "../context/DataContext"

export default function Customers() {

  const { customers } = useData()

  const getStatusColor = (status: string) => {

    switch (status) {

      case "Aktif":
        return "bg-green-100 text-green-700"

      case "Belum Bayar":
        return "bg-yellow-100 text-yellow-700"

      case "Jatuh Tempo":
        return "bg-orange-100 text-orange-700"

      case "Nunggak":
        return "bg-red-100 text-red-700"

      case "Tidak Aktif":
        return "bg-gray-100 text-gray-700"

      default:
        return "bg-blue-100 text-blue-700"

    }

  }

  return (

    <div
      className="
        w-full
        p-4
        md:p-8
        space-y-6
      "
    >

      {/* Header */}

      <div>

        <h1
          className="
            text-2xl
            md:text-3xl
            font-bold
            text-slate-800
          "
        >
          Semua Pelanggan
        </h1>

        <p
          className="
            text-sm
            text-slate-500
            mt-1
          "
        >
          Manajemen data pelanggan MD Network
        </p>
{/* Ringkasan */}

<div className="grid grid-cols-2 md:grid-cols-4 gap-4">

  <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-100">

    <p className="text-sm text-slate-500">
      Total
    </p>

    <h2 className="text-3xl font-bold text-slate-800 mt-2">
      {customers.length}
    </h2>

  </div>

  <div className="bg-green-50 rounded-2xl shadow-sm p-4 border border-green-100">

    <p className="text-sm text-green-700">
      Aktif
    </p>

    <h2 className="text-3xl font-bold text-green-700 mt-2">
      {customers.filter(c => c.status === "Aktif").length}
    </h2>

  </div>

  <div className="bg-yellow-50 rounded-2xl shadow-sm p-4 border border-yellow-100">

    <p className="text-sm text-yellow-700">
      Belum Bayar
    </p>

    <h2 className="text-3xl font-bold text-yellow-700 mt-2">
      {customers.filter(c => c.status === "Belum Bayar").length}
    </h2>

  </div>

  <div className="bg-red-50 rounded-2xl shadow-sm p-4 border border-red-100">

    <p className="text-sm text-red-700">
      Nunggak
    </p>

    <h2 className="text-3xl font-bold text-red-700 mt-2">
      {customers.filter(c => c.status === "Nunggak").length}
    </h2>

  </div>

</div>
      </div>

      {/* MOBILE */}

      <div className="grid gap-4 md:hidden">

        {customers.map((c) => (

          <div
            key={c.id}
            className="
              bg-white
              rounded-2xl
              border
              border-slate-200
              shadow-sm
              p-4
            "
          >

            <div className="flex justify-between items-start">

              <div>

                <h2 className="font-bold text-lg text-slate-800">
                  {c.name}
                </h2>

                <p className="text-xs text-slate-500">
                  ID : {c.id}
                </p>

              </div>

              <span
                className={`
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-semibold
                  ${getStatusColor(c.status)}
                `}
              >
                {c.status}
              </span>

            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-600">

              <p>📱 {c.wa}</p>

              <p>📡 {c.pkg}</p>

            </div>

          </div>

        ))}

      </div>

      {/* DESKTOP */}

      <div
        className="
          hidden
          md:block
          bg-white
          rounded-2xl
          border
          border-slate-200
          overflow-hidden
          shadow-sm
        "
      >

        <table className="w-full text-sm">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">ID</th>

              <th className="p-4 text-left">Nama</th>

              <th className="p-4 text-left">WhatsApp</th>

              <th className="p-4 text-left">Paket</th>

              <th className="p-4 text-left">Status</th>

            </tr>

          </thead>

          <tbody>

            {customers.map((c) => (

              <tr
                key={c.id}
                className="
                  border-t
                  hover:bg-slate-50
                  transition
                "
              >

                <td className="p-4">
                  {c.id}
                </td>

                <td className="p-4 font-semibold">
                  {c.name}
                </td>

                <td className="p-4">
                  {c.wa}
                </td>

                <td className="p-4">
                  {c.pkg}
                </td>

                <td className="p-4">

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-semibold
                      ${getStatusColor(c.status)}
                    `}
                  >
                    {c.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  )

}