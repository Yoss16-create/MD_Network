export default function NetworkStatus() {

  const status = [
    {
      title: "Router Core",
      value: "Online",
      icon: "router",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "OLT",
      value: "Online",
      icon: "lan",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Internet",
      value: "Normal",
      icon: "public",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Server",
      value: "Online",
      icon: "dns",
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ]

  return (

    <div className="bg-white rounded-3xl shadow-xl p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-lg font-bold text-gray-800">
            Status Jaringan
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Monitoring perangkat utama MD Network
          </p>

        </div>

        <span className="material-symbols-outlined text-4xl text-blue-600">
          settings_input_antenna
        </span>

      </div>

      <div className="space-y-4">

        {status.map((item) => (

          <div
            key={item.title}
            className="
              flex
              justify-between
              items-center
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
                className={`
                  w-12
                  h-12
                  rounded-full
                  flex
                  items-center
                  justify-center
                  ${item.bg}
                `}
              >

                <span
                  className={`
                    material-symbols-outlined
                    ${item.color}
                  `}
                >
                  {item.icon}
                </span>

              </div>

              <div>

                <h3 className="font-semibold text-gray-800">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500">
                  Perangkat Utama
                </p>

              </div>

            </div>

            <span className="text-green-600 font-bold">
              ● {item.value}
            </span>

          </div>

        ))}

      </div>

    </div>

  )

}