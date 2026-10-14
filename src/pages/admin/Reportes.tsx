import { useState } from 'react'

export default function Reportes() {
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')

  return (
    <div className="mx-auto max-w-7xl">

      {/* Encabezado */}
      <div>
        <p className="text-sm font-medium text-blue-600">
          Administración
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Reportes
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Análisis estadístico de entradas y salidas del hospital.
        </p>
      </div>

      {/* Filtros */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-bold text-slate-900">
          Período del reporte
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Selecciona el rango de fechas que deseas consultar.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <div>
            <label
              htmlFor="reporte-inicio"
              className="mb-1.5 block text-sm font-medium text-slate-600"
            >
              Fecha de inicio
            </label>

            <input
              id="reporte-inicio"
              type="date"
              value={fechaInicio}
              max={fechaFin || undefined}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="reporte-fin"
              className="mb-1.5 block text-sm font-medium text-slate-600"
            >
              Fecha de fin
            </label>

            <input
              id="reporte-fin"
              type="date"
              value={fechaFin}
              min={fechaInicio || undefined}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              disabled
              title="Disponible cuando integremos la API de reportes"
              className="w-full cursor-not-allowed rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white opacity-50"
            >
              Generar reporte
            </button>
          </div>

        </div>
      </div>

      {/* Aviso */}
      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
        <p className="text-sm text-blue-800">
          Los indicadores y gráficos estarán disponibles cuando
          integremos los datos de la API del sistema.
        </p>
      </div>

      {/* Indicadores */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaReporte
          titulo="Total de entradas"
          valor="—"
          descripcion="Ingresos en el período"
        />

        <TarjetaReporte
          titulo="Total de salidas"
          valor="—"
          descripcion="Salidas en el período"
        />

        <TarjetaReporte
          titulo="Permanencia promedio"
          valor="—"
          descripcion="Duración promedio de visitas finalizadas"
        />

        <TarjetaReporte
          titulo="Hora de mayor afluencia"
          valor="—"
          descripcion="Horario con más ingresos"
        />
      </div>

      {/* Gráficos */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SeccionReporte
          titulo="Entradas y salidas por día"
          descripcion="Comparación de movimientos durante el período."
        />

        <SeccionReporte
          titulo="Accesos por destino"
          descripcion="Distribución de ingresos por área del hospital."
        />
      </div>

      <div className="mt-6">
        <SeccionReporte
          titulo="Movimientos por hora"
          descripcion="Distribución de ingresos a lo largo del día."
        />
      </div>

    </div>
  )
}

function TarjetaReporte({
  titulo,
  valor,
  descripcion,
}: {
  titulo: string
  valor: string
  descripcion: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {titulo}
      </p>

      <p className="mt-3 text-3xl font-bold text-slate-900">
        {valor}
      </p>

      <p className="mt-2 text-xs text-slate-400">
        {descripcion}
      </p>
    </div>
  )
}

function SeccionReporte({
  titulo,
  descripcion,
}: {
  titulo: string
  descripcion: string
}) {
  return (
    <div className="min-h-64 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-bold text-slate-900">
        {titulo}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {descripcion}
      </p>

      <div className="flex min-h-40 items-center justify-center">
        <p className="text-sm text-slate-400">
          Sin datos disponibles
        </p>
      </div>
    </div>
  )
}