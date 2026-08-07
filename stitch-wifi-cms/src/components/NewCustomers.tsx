import { useData } from "../context/DataContext"

export default function NewCustomers() {

  const { customers } = useData()

  const newestCustomers = [...customers]
    .reverse()
    .slice(0, 4)

  return (

    <div className="bg-white rounded-3xl shadow-xl p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-lg font-bold text-gray-800">
            Pelanggan Terbaru
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Pelanggan yang baru bergabung
          </p>

        </div>

        <span className="material-symbols-outlined text-4xl text-blue-600">
          group_add
        </span>

      </div>

      <div className="space-y-4">

        {newestCustomers.map((customer) => (

          <div
            key={customer.id}
            className="
              flex
              items-center
              justify-between
              p-4
              rounded-2xl
              border
              border-gray-100
              hover:bg-gray-50
              transition
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-blue-100
                  text-blue-700
                  flex
                  items-center
                  justify-center
                  font-bold
                "
              >
                {customer.initials}
              </div>

              <div>

                <h3 className="font-semibold text-gray-800">
                  {customer.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {customer.pkg}
                </p>

              </div>

            </div>

            <span className="text-xs text-gray-500">
              {customer.joinDate}
            </span>

          </div>

        ))}

      </div>

    </div>

  )

}