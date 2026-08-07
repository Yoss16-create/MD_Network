export default function SystemStatus() {

  const systems = [
    {
      title: "Internet",
      status: "Online",
      color: "bg-green-500",
    },
    {
      title: "Server",
      status: "Normal",
      color: "bg-green-500",
    },
    {
      title: "Database",
      status: "Connected",
      color: "bg-green-500",
    },
    {
      title: "Firebase",
      status: "Connected",
      color: "bg-green-500",
    },
  ]

  return (

    <div className="bg-white rounded-3xl shadow-lg p-5">

      <div className="flex items-center justify-between mb-5">

        <h2 className="text-lg font-bold">
          🟢 Status Sistem
        </h2>

        <span className="text-sm text-green-600 font-semibold">
          Sehat
        </span>

      </div>

      <div className="space-y-4">

        {systems.map((item) => (

          <div
            key={item.title}
            className="flex items-center justify-between"
          >

            <span className="text-gray-700 font-medium">
              {item.title}
            </span>

            <div className="flex items-center gap-2">

              <div
                className={`w-3 h-3 rounded-full ${item.color}`}
              />

              <span className="text-sm font-semibold text-gray-700">
                {item.status}
              </span>

            </div>

          </div>

        ))}

      </div>

      <div className="mt-6">

        <div className="flex justify-between text-sm mb-2">

          <span className="text-gray-500">
            Performa Sistem
          </span>

          <span className="font-bold text-green-600">
            96%
          </span>

        </div>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

          <div
            className="h-full bg-green-500 rounded-full"
            style={{ width: "96%" }}
          />

        </div>

      </div>

      <div className="mt-5 flex justify-between text-sm">

        <span className="text-gray-500">
          Uptime
        </span>

        <span className="font-bold text-green-600">
          99.9%
        </span>

      </div>

    </div>

  )

}