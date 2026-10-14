export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl">

      {/* Encabezado */}
      <div>
        <p className="text-sm font-medium text-blue-600">
          Administración
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Dashboard
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Resumen general del control de accesos del hospital.
        </p>
      </div>
      
      <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
        <p className="text-sm text-blue-800">
            Los indicadores estarán disponibles cuando se conecte
            el módulo con la API del sistema.
        </p>
      </div>

      {/* Indicadores principales */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <TarjetaIndicador
          titulo="Personas dentro"
          valor="—"
          descripcion="Actualmente en el hospital"
        />

        <TarjetaIndicador
          titulo="Entradas de hoy"
          valor="—"
          descripcion="Ingresos registrados"
        />

        <TarjetaIndicador
          titulo="Salidas de hoy"
          valor="—"
          descripcion="Salidas registradas"
        />

        <TarjetaIndicador
          titulo="Permanencia promedio"
          valor="—"
          descripcion="Tiempo promedio de permanencia"
        />

      </div>

      {/* Contenido inferior */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

        <SeccionDashboard
          titulo="Movimientos por hora"
          descripcion="Distribución de entradas y salidas durante el día."
        />

        <SeccionDashboard
          titulo="Accesos por destino"
          descripcion="Principales áreas de destino registradas."
        />

      </div>

      <div className="mt-6">
        <SeccionDashboard
          titulo="Actividad reciente"
          descripcion="Últimos movimientos registrados en el sistema."
        />
      </div>

    </div>
  )
}

function TarjetaIndicador({
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

function SeccionDashboard({
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