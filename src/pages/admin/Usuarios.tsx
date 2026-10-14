export default function Usuarios() {
  return (
    <div className="mx-auto max-w-7xl">

      {/* Encabezado */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Administración
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Usuarios
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Gestión de cuentas del personal de vigilancia.
          </p>
        </div>

        <button
          type="button"
          disabled
          title="Disponible cuando implementemos la creación de usuarios"
          className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white opacity-50 cursor-not-allowed"
        >
          + Nuevo usuario
        </button>
      </div>

      {/* Información */}
      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
        <p className="text-sm text-blue-800">
          La administración de cuentas estará disponible
          cuando integremos los endpoints de usuarios de la API.
        </p>
      </div>

      {/* Tabla de usuarios */}
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-bold text-slate-900">
            Personal registrado
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Cuentas de acceso al sistema.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Usuario</th>
                <th className="px-5 py-4">Nombre completo</th>
                <th className="px-5 py-4">Rol</th>
                <th className="px-5 py-4">Estado</th>
                <th className="px-5 py-4">Acciones</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center">
                  <p className="font-medium text-slate-600">
                    No hay usuarios disponibles
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Las cuentas aparecerán cuando se conecte
                    la API del sistema.
                  </p>
                </td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>

    </div>
  )
}