import { useState } from 'react'

type EstadoFiltro = 'TODOS' | 'DENTRO' | 'SALIO'

export default function MonitoreoAccesos() {
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState<EstadoFiltro>('TODOS')
  const [fecha, setFecha] = useState('')

  return (
    <div className="mx-auto max-w-7xl">
      {/* Encabezado */}
      <div>
        <p className="text-sm font-medium text-blue-600">
          Administración
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Monitoreo de accesos
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Consulta y supervisión de entradas y salidas del hospital.
        </p>
      </div>

      {/* Filtros */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-bold text-slate-900">
          Buscar registros
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="buscar-acceso"
              className="mb-1.5 block text-sm font-medium text-slate-600"
            >
              DNI o nombre
            </label>

            <input
              id="buscar-acceso"
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar persona..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="estado-acceso"
              className="mb-1.5 block text-sm font-medium text-slate-600"
            >
              Estado
            </label>

            <select
              id="estado-acceso"
              value={estado}
              onChange={(e) =>
                setEstado(e.target.value as EstadoFiltro)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="TODOS">Todos</option>
              <option value="DENTRO">Dentro</option>
              <option value="SALIO">Salió</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="fecha-acceso"
              className="mb-1.5 block text-sm font-medium text-slate-600"
            >
              Fecha de entrada
            </label>

            <input
              id="fecha-acceso"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-bold text-slate-900">
            Registros de acceso
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Historial de movimientos registrados.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Documento</th>
                <th className="px-5 py-4">Persona</th>
                <th className="px-5 py-4">Destino</th>
                <th className="px-5 py-4">Entrada</th>
                <th className="px-5 py-4">Salida</th>
                <th className="px-5 py-4">Estado</th>
                <th className="px-5 py-4">Vigilante</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-16 text-center"
                >
                  <p className="font-medium text-slate-600">
                    No hay registros disponibles
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Los accesos aparecerán cuando se conecte
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