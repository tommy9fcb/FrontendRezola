import { useEffect, useRef, useState } from 'react'
import EscanerDocumento from '../components/acceso/EscanerDocumento'

type ControlAccesoPageProps = {
  onLogout: () => void
}

type MensajeOperacion = {
  tipo: 'entrada' | 'salida'
  titulo: string
  descripcion: string
}

type Vista =
  | 'inicio'
  | 'entrada'
  | 'personas'
  | 'historial'

export default function ControlAccesoPage({
  onLogout,
}: ControlAccesoPageProps) {
  const [vista, setVista] = useState<Vista>('inicio')
  const [dni, setDni] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [registros, setRegistros] = useState<RegistroAcceso[]>([])
  const [salidaPendiente, setSalidaPendiente] = useState<RegistroAcceso | null>(null)
  const [time, setTime] = useState(new Date())
  const [menuMovil, setMenuMovil] = useState(false)
  const [mensajeOperacion, setMensajeOperacion] = useState<MensajeOperacion | null>(null)
  const [reinicioAcceso, setReinicioAcceso] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!mensajeOperacion) {
      return
    }

    const timer = window.setTimeout(() => {
      setMensajeOperacion(null)
    }, 3500)

    return () => {
      window.clearTimeout(timer)
    }
  }, [mensajeOperacion])

  function cambiarVista(nuevaVista: Vista) {
    setVista(nuevaVista)
    setMenuMovil(false)
  }

  function handleDniChange(value: string) {
    const documentoLimpio = value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 12)

    setDni(documentoLimpio)
  }

  function handleRegistrarEntrada(registro: {
    persona: Persona
    destino: string
    motivo: string
    pacienteVisitado?: string
  }) {
    const yaEstaDentro = registros.some(
      (registroActual) =>
        registroActual.persona.dni === registro.persona.dni &&
        registroActual.estado === 'DENTRO',
    )

    if (yaEstaDentro) {
      setDni('')
      setVista('personas')
      return
    }

    const nuevoRegistro: RegistroAcceso = {
      id: Date.now(),
      persona: registro.persona,
      destino: registro.destino,
      motivo: registro.motivo,
      pacienteVisitado: registro.pacienteVisitado,
      horaEntrada: new Date(),
      horaSalida: null,
      estado: 'DENTRO',
    }

    setRegistros((registrosActuales) => [
      nuevoRegistro,
      ...registrosActuales,
    ])

    setMensajeOperacion({
      tipo: 'entrada',
      titulo: 'Entrada registrada',
      descripcion: `${registro.persona.nombres} ${registro.persona.apellidos} ingresó correctamente.`,
    })

    setDni('')
    setReinicioAcceso((valor) => valor + 1)
    setVista('entrada')
  }

  function handleSolicitarSalida(registroId: number) {
    const registro = registros.find(
      (registroActual) =>
        registroActual.id === registroId &&
        registroActual.estado === 'DENTRO',
    )

    if (!registro) {
      return
    }

    setSalidaPendiente(registro)
  }

  function handleRegistrarSalida(registroId: number) {
    const registro = registros.find(
      (registroActual) =>
        registroActual.id === registroId &&
        registroActual.estado === 'DENTRO',
    )

    if (!registro) {
      return
    }

    const horaSalida = new Date()

    setRegistros((registrosActuales) =>
      registrosActuales.map((registroActual) =>
        registroActual.id === registroId
          ? {
              ...registroActual,
              horaSalida,
              estado: 'SALIO' as const,
            }
          : registroActual,
      ),
    )

    setMensajeOperacion({
      tipo: 'salida',
      titulo: 'Salida registrada',
      descripcion: `${registro.persona.nombres} ${registro.persona.apellidos} salió correctamente.`,
    })

    setSalidaPendiente(null)
    setDni('')
    setReinicioAcceso((valor) => valor + 1)
    setVista('entrada')
  }

  const fecha = time.toLocaleDateString('es-PE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const hora = time.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* =========================
          MENÚ LATERAL - PC
      ========================== */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#0d1f3c] lg:flex">

        {/* Marca */}
        <div className="border-b border-white/10 px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
            Sistema Hospitalario
          </p>

          <h1 className="mt-2 text-lg font-bold text-white">
            Control de Accesos
          </h1>

          <p className="mt-1 text-xs text-slate-400">
            Hospital Regional Rezola
          </p>
        </div>

        {/* Navegación */}
        <nav className="flex-1 space-y-2 p-4">

          <MenuButton
            active={vista === 'inicio'}
            onClick={() => cambiarVista('inicio')}
            icon={<HomeIcon />}
          >
            Inicio
          </MenuButton>

          <MenuButton
            active={vista === 'entrada'}
            onClick={() => cambiarVista('entrada')}
            icon={<EntryIcon />}
          >
            Registrar acceso
          </MenuButton>

          <MenuButton
            active={vista === 'personas'}
            onClick={() => cambiarVista('personas')}
            icon={<PeopleIcon />}
          >
            Personas dentro
          </MenuButton>

          <MenuButton
            active={vista === 'historial'}
            onClick={() => cambiarVista('historial')}
            icon={<HistoryIcon />}
          >
            Historial
          </MenuButton>
        </nav>

        {/* Usuario */}
        <div className="border-t border-white/10 p-4">
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              V
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                Vigilancia
              </p>

              <p className="text-xs text-slate-400">
                Portería
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-full rounded-lg border border-white/10 px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* =========================
          MENÚ MÓVIL
      ========================== */}
      {menuMovil && (
        <div className="fixed inset-0 z-50 lg:hidden">

          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => setMenuMovil(false)}
          />

          <aside className="relative flex h-full w-72 flex-col bg-[#0d1f3c] shadow-2xl">
            <div className="flex items-start justify-between border-b border-white/10 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-sky-400">
                  Hospital Rezola
                </p>

                <p className="mt-1 font-bold text-white">
                  Control de Accesos
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMenuMovil(false)}
                className="text-2xl text-slate-300"
              >
                ×
              </button>
            </div>

            <nav className="flex-1 space-y-2 p-4">
              <MenuButton
                active={vista === 'inicio'}
                onClick={() => cambiarVista('inicio')}
                icon={<HomeIcon />}
              >
                Inicio
              </MenuButton>

              <MenuButton
                active={vista === 'entrada'}
                onClick={() => cambiarVista('entrada')}
                icon={<EntryIcon />}
              >
                Registrar acceso
              </MenuButton>

              <MenuButton
                active={vista === 'personas'}
                onClick={() => cambiarVista('personas')}
                icon={<PeopleIcon />}
              >
                Personas dentro
              </MenuButton>

              <MenuButton
                active={vista === 'historial'}
                onClick={() => cambiarVista('historial')}
                icon={<HistoryIcon />}
              >
                Historial
              </MenuButton>
            </nav>

            <div className="border-t border-white/10 p-4">
              <button
                type="button"
                onClick={onLogout}
                className="w-full rounded-lg border border-white/10 px-4 py-3 text-left text-sm text-slate-300"
              >
                Cerrar sesión
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* =========================
          CONTENIDO PRINCIPAL
      ========================== */}
      <div className="lg:pl-64">

        {/* CABECERA */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

            <div className="flex items-center gap-3">
              {/* Hamburguesa móvil */}
              <button
                type="button"
                onClick={() => setMenuMovil(true)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 lg:hidden"
                aria-label="Abrir menú"
              >
                <MenuIcon />
              </button>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Hospital Regional Rezola
                </p>

                <p className="hidden text-xs text-slate-500 sm:block">
                  Módulo de Vigilancia y Control de Accesos
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold tabular-nums text-slate-800">
                {hora}
              </p>

              <p className="hidden text-xs capitalize text-slate-400 sm:block">
                {fecha}
              </p>
            </div>
          </div>
        </header>

        {/* CONTENIDO */}
        <main className="p-4 sm:p-6 lg:p-8">

          {vista === 'inicio' && (
            <Inicio
              registros={registros}
              onEntrada={() => cambiarVista('entrada')}
              onPersonas={() => cambiarVista('personas')}
              onHistorial={() => cambiarVista('historial')}
            />
          )}

          {vista === 'entrada' && (
            <RegistrarEntrada
              key={reinicioAcceso}
              dni={dni}
              registros={registros}
              onDniChange={handleDniChange}
              onConfirmarEntrada={handleRegistrarEntrada}
              onConfirmarSalida={handleSolicitarSalida}
            />
          )}

          {vista === 'personas' && (
            <PersonasDentro
              busqueda={busqueda}
              onBusquedaChange={setBusqueda}
              registros={registros}
              onRegistrarSalida={handleSolicitarSalida}
            />
          )}

          {vista === 'historial' && (
            <Historial registros={registros} />
          )}
        </main>
        
        {/* MENSAJE DE OPERACIÓN EXITOSA */}
        {mensajeOperacion && (
          <div className="fixed bottom-5 left-4 right-4 z-[110] sm:left-auto sm:right-6 sm:w-[390px]">
            <div
              className={`rounded-xl border bg-white p-4 shadow-xl ${
                mensajeOperacion.tipo === 'entrada'
                  ? 'border-emerald-200'
                  : 'border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    mensajeOperacion.tipo === 'entrada'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  <CheckIcon />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900">
                    {mensajeOperacion.titulo}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {mensajeOperacion.descripcion}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMensajeOperacion(null)}
                  aria-label="Cerrar mensaje"
                  className="text-xl leading-none text-slate-400 transition hover:text-slate-700"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {salidaPendiente && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmar-salida-titulo"
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="p-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                <ExitIcon />
              </div>

              <div className="mt-5 text-center">
                <h3
                  id="confirmar-salida-titulo"
                  className="text-xl font-bold text-slate-900"
                >
                  ¿Registrar salida?
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Confirma que la persona está saliendo del hospital.
                </p>
              </div>

              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-bold text-slate-900">
                  {salidaPendiente.persona.nombres}{' '}
                  {salidaPendiente.persona.apellidos}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  DNI {salidaPendiente.persona.dni}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-200 pt-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Entrada
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {formatearHora(salidaPendiente.horaEntrada)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Permanencia
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {calcularPermanencia(salidaPendiente.horaEntrada)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setSalidaPendiente(null)}
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleRegistrarSalida(salidaPendiente.id)
                  }
                  className="flex-1 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
                >
                  Sí, registrar salida
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

      </div>
    </div>
  )
}

/* =====================================================
   INICIO
===================================================== */
type InicioProps = {
  registros: RegistroAcceso[]
  onEntrada: () => void
  onPersonas: () => void
  onHistorial: () => void
}

type MovimientoReciente = {
  id: string
  tipo: 'ENTRADA' | 'SALIDA'
  fecha: Date
  registro: RegistroAcceso
}

function Inicio({
  registros,
  onEntrada,
  onPersonas,
  onHistorial,
}: InicioProps) {
  const ahora = new Date()

  function esHoy(fecha: Date) {
    return (
      fecha.getFullYear() === ahora.getFullYear() &&
      fecha.getMonth() === ahora.getMonth() &&
      fecha.getDate() === ahora.getDate()
    )
  }

  // Personas que actualmente continúan dentro.
  const personasDentro = registros.filter(
    (registro) => registro.estado === 'DENTRO',
  ).length

  // Entradas realizadas durante el día de hoy.
  const ingresosHoy = registros.filter((registro) =>
    esHoy(registro.horaEntrada),
  ).length

  // Salidas realizadas durante el día de hoy.
  const registrosConSalidaHoy = registros.filter(
    (registro) =>
      registro.horaSalida !== null &&
      esHoy(registro.horaSalida),
  )

  const salidasHoy = registrosConSalidaHoy.length

  // Permanencia promedio únicamente de accesos que ya finalizaron hoy.
  const duracionesFinalizadas = registrosConSalidaHoy.map(
    (registro) => {
      if (!registro.horaSalida) {
        return 0
      }

      return Math.max(
        0,
        registro.horaSalida.getTime() -
          registro.horaEntrada.getTime(),
      )
    },
  )

  const promedioMs =
    duracionesFinalizadas.length > 0
      ? duracionesFinalizadas.reduce(
          (total, duracion) => total + duracion,
          0,
        ) / duracionesFinalizadas.length
      : 0

  const promedioMinutos = Math.floor(promedioMs / 60000)

  function formatearPromedio(
    minutosTotales: number,
    cantidadSalidas: number,
  ) {
    if (cantidadSalidas === 0) {
      return '—'
    }

    if (minutosTotales < 1) {
      return '< 1 min'
    }

    const horas = Math.floor(minutosTotales / 60)
    const minutos = minutosTotales % 60

    if (horas === 0) {
      return `${minutos} min`
    }

    if (minutos === 0) {
      return `${horas} h`
    }

    return `${horas} h ${minutos} min`
  }

  // Creamos movimientos independientes para entrada y salida.
  const movimientos: MovimientoReciente[] = []

  registros.forEach((registro) => {
    if (esHoy(registro.horaEntrada)) {
      movimientos.push({
        id: `entrada-${registro.id}`,
        tipo: 'ENTRADA',
        fecha: registro.horaEntrada,
        registro,
      })
    }

    if (registro.horaSalida && esHoy(registro.horaSalida)) {
      movimientos.push({
        id: `salida-${registro.id}`,
        tipo: 'SALIDA',
        fecha: registro.horaSalida,
        registro,
      })
    }
  })

  // Los más recientes primero y mostramos como máximo 5.
  const actividadReciente = movimientos
    .sort(
      (a, b) =>
        b.fecha.getTime() - a.fecha.getTime(),
    )
    .slice(0, 5)

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <p className="text-sm font-medium text-blue-600">
          Portería
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Control de acceso
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Registra y supervisa el ingreso y salida de personas.
        </p>
      </div>

      {/* INDICADORES */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Personas dentro"
          value={String(personasDentro)}
          description="Aforo actual"
        />

        <StatCard
          label="Ingresos hoy"
          value={String(ingresosHoy)}
          description="Desde las 00:00"
        />

        <StatCard
          label="Salidas hoy"
          value={String(salidasHoy)}
          description="Registradas"
        />

        <StatCard
          label="Permanencia promedio"
          value={formatearPromedio(promedioMinutos, salidasHoy)}
          description={
            salidasHoy > 0
              ? 'Accesos finalizados hoy'
              : 'Sin salidas registradas'
          }
        />
      </div>

      {/* ACCIONES PRINCIPALES */}
      <div className="mt-8">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
          Acciones rápidas
        </h3>

        <div className="grid gap-4 md:grid-cols-3">
          <ActionCard
            title="Registrar acceso"
            description="Identificar un documento y registrar rápidamente una entrada o salida."
            buttonText="Nuevo acceso"
            onClick={onEntrada}
            icon={<EntryIconLarge />}
          />

          <ActionCard
            title="Personas dentro"
            description="Buscar personas que actualmente permanecen dentro."
            buttonText="Ver personas"
            onClick={onPersonas}
            icon={<PeopleIconLarge />}
          />

          <ActionCard
            title="Historial"
            description="Consulta los movimientos registrados recientemente."
            buttonText="Ver historial"
            onClick={onHistorial}
            icon={<HistoryIconLarge />}
          />
        </div>
      </div>

      {/* ACTIVIDAD RECIENTE */}
      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="font-bold text-slate-800">
              Actividad reciente
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Últimos movimientos registrados hoy
            </p>
          </div>

          {actividadReciente.length > 0 && (
            <button
              type="button"
              onClick={onHistorial}
              className="shrink-0 text-sm font-semibold text-blue-700 transition hover:text-blue-800"
            >
              Ver historial
            </button>
          )}
        </div>

        {actividadReciente.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <HistoryIconLarge />
            </div>

            <p className="mt-4 font-semibold text-slate-700">
              Sin actividad registrada
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Las entradas y salidas de hoy aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {actividadReciente.map((movimiento) => {
              const registro = movimiento.registro

              return (
                <div
                  key={movimiento.id}
                  className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        movimiento.tipo === 'ENTRADA'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {movimiento.tipo === 'ENTRADA' ? (
                        <EntryIcon />
                      ) : (
                        <ExitIcon />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-900">
                          {registro.persona.nombres}{' '}
                          {registro.persona.apellidos}
                        </p>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            movimiento.tipo === 'ENTRADA'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {movimiento.tipo}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        DNI {registro.persona.dni}
                        {' · '}
                        {obtenerNombreDestino(registro.destino)}
                      </p>

                      {registro.pacienteVisitado && (
                        <p className="mt-1 text-xs text-amber-700">
                          Visita a: {registro.pacienteVisitado}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 sm:text-right">
                    <p className="font-semibold tabular-nums text-slate-700">
                      {formatearHora(movimiento.fecha)}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {obtenerNombreMotivo(registro.motivo)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

/* =====================================================
    REGISTRAR ACCESO
===================================================== */

type TipoDocumento = 'DNI' | 'CE'
type EstadoAcceso = 'identificar' | 'entrada' | 'salida'

type RegistrarEntradaProps = {
  dni: string
  registros: RegistroAcceso[]
  onDniChange: (value: string) => void

  onConfirmarEntrada: (registro: {
    persona: Persona
    destino: string
    motivo: string
    pacienteVisitado?: string
  }) => void

  onConfirmarSalida: (registroId: number) => void
}

type Persona = {
  dni: string
  nombres: string
  apellidos: string
  tipoDocumento?: TipoDocumento
}

type PacienteHospitalizado = {
  id: number
  dni: string
  nombres: string
  apellidos: string
  servicio: string
  habitacion: string
}

type RegistroAcceso = {
  id: number
  persona: Persona
  destino: string
  motivo: string
  pacienteVisitado?: string
  horaEntrada: Date
  horaSalida: Date | null
  estado: 'DENTRO' | 'SALIO'
}

function RegistrarEntrada({
  dni,
  registros,
  onDniChange,
  onConfirmarEntrada,
  onConfirmarSalida,
}: RegistrarEntradaProps) {
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>('DNI')
  const [estadoAcceso, setEstadoAcceso] =
    useState<EstadoAcceso>('identificar')
  const [buscando, setBuscando] = useState(false)
  const [personaEncontrada, setPersonaEncontrada] =
    useState<Persona | null>(null)
  const [registroActivo, setRegistroActivo] =
    useState<RegistroAcceso | null>(null)
  const [destino, setDestino] = useState('')
  const [motivo, setMotivo] = useState('')
  const [busquedaPaciente, setBusquedaPaciente] = useState('')
  const [pacienteSeleccionado, setPacienteSeleccionado] =
    useState<PacienteHospitalizado | null>(null)
  const [mostrarManualMovil, setMostrarManualMovil] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const documentoInputRef = useRef<HTMLInputElement>(null)
  const [camaraAbierta, setCamaraAbierta] = useState(false)

  // SIMULACIÓN TEMPORAL.
  // Cuando exista el backend, esta lista y el setTimeout se reemplazarán
  // por una llamada a la API del proyecto. El frontend NO se conectará
  // directamente a RENIEC ni a Migraciones.
  const personasPrueba: Persona[] = [
    {
      dni: '72530683',
      nombres: 'Carlos Alberto',
      apellidos: 'Ramírez Soto',
      tipoDocumento: 'DNI',
    },
    {
      dni: '12345678',
      nombres: 'María Elena',
      apellidos: 'Torres López',
      tipoDocumento: 'DNI',
    },
    {
      dni: '98765432',
      nombres: 'Anny',
      apellidos: 'Jauregui Aquino',
      tipoDocumento: 'DNI',
    },
  ]

  const pacientesHospitalizadosPrueba: PacienteHospitalizado[] = [
    {
      id: 1,
      dni: '70123456',
      nombres: 'Camila',
      apellidos: 'Torres García',
      servicio: 'Medicina',
      habitacion: '203',
    },
    {
      id: 2,
      dni: '71234567',
      nombres: 'José Luis',
      apellidos: 'Mendoza Flores',
      servicio: 'Cirugía',
      habitacion: '105',
    },
    {
      id: 3,
      dni: '72345678',
      nombres: 'Rosa Elena',
      apellidos: 'Quispe Ramos',
      servicio: 'Medicina',
      habitacion: '208',
    },
    {
      id: 4,
      dni: '73456789',
      nombres: 'Luis Alberto',
      apellidos: 'Sánchez Pérez',
      servicio: 'Traumatología',
      habitacion: '304',
    },
  ]

  const documentoValido =
    tipoDocumento === 'DNI'
      ? /^\d{8}$/.test(dni)
      : /^[A-Z0-9]{6,12}$/.test(dni)

  const terminoPaciente = busquedaPaciente.trim().toLowerCase()

  const pacientesFiltrados =
    terminoPaciente.length >= 2
      ? pacientesHospitalizadosPrueba.filter((paciente) => {
          const nombreCompleto =
            `${paciente.nombres} ${paciente.apellidos}`.toLowerCase()

          return (
            nombreCompleto.includes(terminoPaciente) ||
            paciente.dni.includes(terminoPaciente)
          )
        })
      : []

  useEffect(() => {
    if (estadoAcceso === 'identificar') {
      const timer = window.setTimeout(() => {
        documentoInputRef.current?.focus()
      }, 50)

      return () => window.clearTimeout(timer)
    }
  }, [estadoAcceso])

  function limpiarResultado() {
    setPersonaEncontrada(null)
    setRegistroActivo(null)
    setDestino('')
    setMotivo('')

    setBusquedaPaciente('')
    setPacienteSeleccionado(null)
    
    setMensaje('')
    setEstadoAcceso('identificar')
  }

  function prepararSiguientePersona() {
    onDniChange('')
    limpiarResultado()

    window.setTimeout(() => {
      documentoInputRef.current?.focus()
    }, 50)
  }

  function handleCambiarTipoDocumento(nuevoTipo: TipoDocumento) {
    setTipoDocumento(nuevoTipo)
    onDniChange('')
    limpiarResultado()
  }

  function handleCambiarDocumento(value: string) {
    const limpio =
      tipoDocumento === 'DNI'
        ? value.replace(/\D/g, '').slice(0, 8)
        : value
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '')
            .slice(0, 12)

    onDniChange(limpio)

    if (
      personaEncontrada ||
      registroActivo ||
      estadoAcceso !== 'identificar'
    ) {
      limpiarResultado()
    }
  }

  function handleBuscarPersona() {
    if (!documentoValido || buscando) {
      return
    }

    setBuscando(true)
    setMensaje('')
    setPersonaEncontrada(null)
    setRegistroActivo(null)

    window.setTimeout(() => {
      // 1. Primero comprobamos si el documento tiene un ingreso activo.
      const ingresoActivo = registros.find(
        (registro) =>
          registro.persona.dni === dni &&
          registro.estado === 'DENTRO',
      )

      if (ingresoActivo) {
        setPersonaEncontrada(ingresoActivo.persona)
        setRegistroActivo(ingresoActivo)
        setEstadoAcceso('salida')
        setBuscando(false)
        return
      }

      // 2. Simulamos la respuesta del servicio de identidad.
      // En producción esto vendrá del backend.
      const persona = personasPrueba.find(
        (personaPrueba) =>
          personaPrueba.dni === dni &&
          (personaPrueba.tipoDocumento ?? 'DNI') === tipoDocumento,
      )

      if (!persona) {
        setMensaje(
          tipoDocumento === 'DNI'
            ? 'No se pudo obtener la identidad en la simulación actual. Cuando se conecte el backend, aquí se consultará el servicio de identidad autorizado.'
            : 'La consulta automática de Carné de Extranjería quedará conectada al servicio que defina el backend. Por ahora no hay datos simulados para este documento.',
        )
        setBuscando(false)
        return
      }

      setPersonaEncontrada(persona)
      setEstadoAcceso('entrada')
      setBuscando(false)
    }, 450)
  }

  function handleKeyDownDocumento(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === 'Enter' && documentoValido) {
      event.preventDefault()
      handleBuscarPersona()
    }
  }

  function handleAbrirCamara() {
    setCamaraAbierta(true)
  }

  function handleConfirmarEntradaRapida() {
    if (!personaEncontrada || !destino || !motivo) {
      return
    }

    if (
      destino === 'hospitalizacion' &&
      motivo === 'visita' &&
      !pacienteSeleccionado
    ) {
      return
    }

    onConfirmarEntrada({
      persona: {
        ...personaEncontrada,
        tipoDocumento,
      },
      destino,
      motivo,

      pacienteVisitado:
        destino === 'hospitalizacion' &&
        motivo === 'visita' &&
        pacienteSeleccionado
          ? `${pacienteSeleccionado.nombres} ${pacienteSeleccionado.apellidos}`
          : undefined,
    })

    prepararSiguientePersona()
  }

  function handleConfirmarSalidaRapida() {
    if (!registroActivo) {
      return
    }

    onConfirmarSalida(registroActivo.id)
  }

  return (
    <div className="mx-auto max-w-5xl">
    
    {camaraAbierta && (
      <EscanerDocumento
        onCerrar={() => setCamaraAbierta(false)}
      />
    )}
    
      <div className="mb-6">
        <p className="text-sm font-medium text-blue-600">
          Control de acceso
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Registrar acceso
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Identifica el documento. El sistema determinará si corresponde
          registrar una entrada o una salida.
        </p>
      </div>

      {/* =================================================
          MÓVIL: ESCÁNER COMO INTERFAZ PRINCIPAL
      ================================================== */}
      <section className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 sm:p-6 lg:hidden">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white">
            <ScanIcon />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                Escanear documento
              </h3>

              <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Principal en móvil
              </span>
            </div>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Escanea el documento para identificar a la persona y continuar
              inmediatamente con su acceso.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <DocumentType label="DNI" />
          <DocumentType label="QR" />
          <DocumentType label="Código de barras" />
        </div>

        <button
          type="button"
          onClick={handleAbrirCamara}
          className="mt-5 w-full rounded-lg bg-[#0d1f3c] px-4 py-4 text-base font-semibold text-white transition hover:bg-[#1a3464]"
        >
          Abrir cámara
        </button>

        <button
          type="button"
          onClick={() => setMostrarManualMovil((actual) => !actual)}
          className="mt-3 w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          {mostrarManualMovil
            ? 'Ocultar ingreso manual'
            : 'Ingresar documento manualmente'}
        </button>
      </section>

      {/* =================================================
          IDENTIFICACIÓN MANUAL
          PC: principal / Móvil: alternativa
      ================================================== */}
      <section
        className={`mt-6 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 lg:mt-0 ${
          mostrarManualMovil ? 'block' : 'hidden lg:block'
        }`}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end">
          <div className="lg:w-48">
            <label
              htmlFor="tipoDocumento"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600"
            >
              Tipo de documento
            </label>

            <select
              id="tipoDocumento"
              value={tipoDocumento}
              onChange={(e) =>
                handleCambiarTipoDocumento(e.target.value as TipoDocumento)
              }
              disabled={buscando}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option value="DNI">DNI</option>
              <option value="CE">Carné de Extranjería</option>
            </select>
          </div>

          <div className="flex-1">
            <label
              htmlFor="documento"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600"
            >
              Número de documento
            </label>

            <input
              ref={documentoInputRef}
              id="documento"
              type="text"
              inputMode={tipoDocumento === 'DNI' ? 'numeric' : 'text'}
              autoComplete="off"
              value={dni}
              onChange={(e) => handleCambiarDocumento(e.target.value)}
              onKeyDown={handleKeyDownDocumento}
              maxLength={tipoDocumento === 'DNI' ? 8 : 12}
              placeholder={
                tipoDocumento === 'DNI'
                  ? 'Ej. 72530683'
                  : 'Número de Carné de Extranjería'
              }
              className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-lg font-semibold tracking-wider outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-2 text-xs text-slate-400">
              {tipoDocumento === 'DNI'
                ? `${dni.length}/8 dígitos · Presiona Enter para continuar`
                : '6 a 12 caracteres · Presiona Enter para continuar'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleBuscarPersona}
            disabled={!documentoValido || buscando}
            className="rounded-lg bg-blue-700 px-7 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {buscando ? 'Consultando...' : 'Identificar'}
          </button>
        </div>
      </section>

      {mensaje && estadoAcceso === 'identificar' && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm leading-6 text-amber-800">
            {mensaje}
          </p>
        </div>
      )}

      {/* =================================================
          ENTRADA: IDENTIDAD + DESTINO + MOTIVO
          Todo en una sola pantalla, sin Paso 1/2/3.
      ================================================== */}
      {estadoAcceso === 'entrada' && personaEncontrada && (
        <section className="mt-6 overflow-hidden rounded-xl border border-emerald-200 bg-white">
          <div className="border-b border-emerald-100 bg-emerald-50 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckIcon />
              </div>

              <div>
                <h3 className="font-bold text-emerald-900">
                  Identidad obtenida
                </h3>

                <p className="mt-1 text-xs text-emerald-700">
                  Completa destino y motivo para registrar la entrada.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="text-lg font-bold text-slate-900">
                    {personaEncontrada.nombres}{' '}
                    {personaEncontrada.apellidos}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {tipoDocumento === 'DNI'
                      ? 'DNI'
                      : 'Carné de Extranjería'}{' '}
                    {personaEncontrada.dni}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  IDENTIFICADO
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="destino"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Destino
                </label>

                <select
                  id="destino"
                  value={destino}
                  onChange={(e) => {
                    setDestino(e.target.value)
                    if (e.target.value !== 'hospitalizacion') {
                      setBusquedaPaciente('')
                      setPacienteSeleccionado(null)
                    }
                  }}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Seleccione un destino</option>
                  <option value="consulta-externa">Consulta externa</option>
                  <option value="hospitalizacion">Hospitalización</option>
                  <option value="emergencia">Emergencia</option>
                  <option value="administracion">Administración</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="motivo"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Motivo
                </label>

                <select
                  id="motivo"
                  value={motivo}
                  onChange={(e) => {
                    setMotivo(e.target.value)
                    if (e.target.value !== 'visita') {
                      setBusquedaPaciente('')
                      setPacienteSeleccionado(null)
                    }
                  }}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Seleccione un motivo</option>
                  <option value="visita">Visita</option>
                  <option value="cita">Cita / atención</option>
                  <option value="tramite">Trámite</option>
                  <option value="acompanamiento">Acompañamiento</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            {destino === 'hospitalizacion' && motivo === 'visita' && (
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
                <div>
                  <p className="text-sm font-bold text-amber-900">
                    Paciente hospitalizado
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    Busca y selecciona al paciente que la persona desea visitar.
                    Solo se podrá registrar la visita a un paciente con
                    hospitalización activa.
                  </p>
                </div>

                {!pacienteSeleccionado ? (
                  <>
                    <div className="relative mt-4">
                      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <SearchIcon />
                      </div>

                      <input
                        id="buscarPaciente"
                        type="text"
                        value={busquedaPaciente}
                        onChange={(e) => setBusquedaPaciente(e.target.value)}
                        placeholder="Buscar por nombre o DNI..."
                        autoComplete="off"
                        className="w-full rounded-lg border border-amber-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {busquedaPaciente.trim().length > 0 &&
                      busquedaPaciente.trim().length < 2 && (
                        <p className="mt-2 text-xs text-amber-700">
                          Escribe al menos 2 caracteres para buscar.
                        </p>
                      )}

                    {busquedaPaciente.trim().length >= 2 && (
                      <div className="mt-3 overflow-hidden rounded-lg border border-amber-200 bg-white">
                        {pacientesFiltrados.length > 0 ? (
                          <div className="divide-y divide-slate-100">
                            {pacientesFiltrados.map((paciente) => (
                              <button
                                key={paciente.id}
                                type="button"
                                onClick={() => {
                                  setPacienteSeleccionado(paciente)
                                  setBusquedaPaciente('')
                                }}
                                className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-blue-50"
                              >
                                <div className="min-w-0">
                                  <p className="font-semibold text-slate-900">
                                    {paciente.nombres} {paciente.apellidos}
                                  </p>

                                  <p className="mt-1 text-xs text-slate-500">
                                    DNI {paciente.dni}
                                  </p>

                                  <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                      {paciente.servicio}
                                    </span>

                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                      Hab. {paciente.habitacion}
                                    </span>
                                  </div>
                                </div>

                                <span className="shrink-0 text-sm font-semibold text-blue-700">
                                  Seleccionar
                                </span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="px-4 py-6 text-center">
                            <p className="font-semibold text-slate-700">
                              No se encontró un paciente hospitalizado
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Verifica el nombre o documento ingresado.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mt-4 rounded-lg border border-emerald-200 bg-white p-4">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-emerald-600">
                            <CheckIcon />
                          </div>

                          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                            Paciente seleccionado
                          </p>
                        </div>

                        <p className="mt-3 font-bold text-slate-900">
                          {pacienteSeleccionado.nombres}{' '}
                          {pacienteSeleccionado.apellidos}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          DNI {pacienteSeleccionado.dni}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {pacienteSeleccionado.servicio}
                          </span>

                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            Hab. {pacienteSeleccionado.habitacion}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setPacienteSeleccionado(null)
                          setBusquedaPaciente('')
                        }}
                        className="shrink-0 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        Cambiar paciente
                      </button>
                    </div>
                  </div>
                )}

                <p className="mt-3 text-xs leading-5 text-amber-700">
                  Datos simulados temporalmente. Posteriormente la búsqueda será
                  proporcionada por el backend con los pacientes que tengan una
                  hospitalización activa.
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={prepararSiguientePersona}
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cambiar documento
              </button>

              <button
                type="button"
                onClick={handleConfirmarEntradaRapida}
                disabled={
                  !destino ||
                  !motivo ||
                  (destino === 'hospitalizacion' &&
                    motivo === 'visita' &&
                    !pacienteSeleccionado)
                }
                className="rounded-lg bg-emerald-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Confirmar entrada
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =================================================
          SALIDA: si el documento ya tiene ingreso activo
      ================================================== */}
      {estadoAcceso === 'salida' &&
        personaEncontrada &&
        registroActivo && (
          <section className="mt-6 overflow-hidden rounded-xl border border-amber-200 bg-white">
            <div className="border-b border-amber-200 bg-amber-50 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                  <PeopleIcon />
                </div>

                <div>
                  <h3 className="font-bold text-amber-900">
                    Persona actualmente dentro
                  </h3>

                  <p className="mt-1 text-xs text-amber-700">
                    El documento tiene un ingreso activo. Corresponde
                    registrar la salida.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-lg font-bold text-slate-900">
                  {personaEncontrada.nombres}{' '}
                  {personaEncontrada.apellidos}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {(personaEncontrada.tipoDocumento ?? tipoDocumento) === 'DNI'
                    ? 'DNI'
                    : 'Carné de Extranjería'}{' '}
                  {personaEncontrada.dni}
                </p>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <DataField
                  label="Entrada"
                  value={formatearHora(registroActivo.horaEntrada)}
                />

                <DataField
                  label="Destino"
                  value={obtenerNombreDestino(registroActivo.destino)}
                />

                <DataField
                  label="Motivo"
                  value={obtenerNombreMotivo(registroActivo.motivo)}
                />

                <DataField
                  label="Permanencia"
                  value={calcularPermanencia(registroActivo.horaEntrada)}
                />
              </div>

              {registroActivo.pacienteVisitado && (
                <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    Paciente visitado
                  </p>

                  <p className="mt-1 font-semibold text-amber-900">
                    {registroActivo.pacienteVisitado}
                  </p>
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={prepararSiguientePersona}
                  className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cambiar documento
                </button>

                <button
                  type="button"
                  onClick={handleConfirmarSalidaRapida}
                  className="rounded-lg bg-red-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Confirmar salida
                </button>
              </div>
            </div>
          </section>
        )}

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-center text-xs leading-5 text-slate-500">
          Flujo rápido: identificar documento → destino y motivo → confirmar
          entrada. Si existe un ingreso activo, el sistema ofrece directamente
          registrar la salida.
        </p>
      </div>
    </div>
  )
}

function calcularPermanencia(horaEntrada: Date) {
  const diferenciaMs = Math.max(
    0,
    new Date().getTime() - horaEntrada.getTime(),
  )

  const minutosTotales = Math.floor(diferenciaMs / 60000)
  const horas = Math.floor(minutosTotales / 60)
  const minutos = minutosTotales % 60

  if (horas === 0) {
    return `${minutos} min`
  }

  return `${horas} h ${minutos} min`
}

function calcularDuracionRegistro(registro: RegistroAcceso) {
  const fechaFinal =
    registro.horaSalida ?? new Date()

  const diferenciaMs = Math.max(
    0,
    fechaFinal.getTime() - registro.horaEntrada.getTime(),
  )

  const minutosTotales = Math.floor(diferenciaMs / 60000)
  const horas = Math.floor(minutosTotales / 60)
  const minutos = minutosTotales % 60

  if (minutosTotales < 1) {
  return '< 1 min'
  }
  if (horas === 0) {
    return `${minutos} min`
  }

  return `${horas} h ${minutos} min`
}

// Convierte los valores internos de destino
// en textos que verá el usuario.
function obtenerNombreDestino(destino: string) {
  const destinos: Record<string, string> = {
    'consulta-externa': 'Consulta externa',
    hospitalizacion: 'Hospitalización',
    emergencia: 'Emergencia',
    administracion: 'Administración',
    otro: 'Otro',
  }

  return destinos[destino] ?? destino
}

// Convierte los valores internos de motivo
// en textos que verá el usuario.
function obtenerNombreMotivo(motivo: string) {
  const motivos: Record<string, string> = {
    visita: 'Visita',
    cita: 'Cita / atención',
    tramite: 'Trámite',
    acompanamiento: 'Acompañamiento',
    otro: 'Otro',
  }

  return motivos[motivo] ?? motivo
}

function formatearHora(fecha: Date) {
  return fecha.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/* =====================================================
   PERSONAS DENTRO
===================================================== */

type PersonasDentroProps = {
  busqueda: string
  onBusquedaChange: (value: string) => void
  registros : RegistroAcceso[]
  onRegistrarSalida: (registroId: number) => void
}

function PersonasDentro({
  busqueda,
  onBusquedaChange,
  registros,
  onRegistrarSalida,
}: PersonasDentroProps) {
  const personasDentro = registros.filter(
    (registro) => registro.estado === 'DENTRO',
  )
  const terminoBusqueda = busqueda.trim().toLowerCase()
    const personasFiltradas = personasDentro.filter((registro) => {
      const nombreCompleto =
        `${registro.persona.nombres} ${registro.persona.apellidos}`.toLowerCase()

      return (
        registro.persona.dni.includes(terminoBusqueda) ||
        nombreCompleto.includes(terminoBusqueda)
      )
    })

  return (
    <div className="mx-auto max-w-7xl">

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Monitoreo
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Personas dentro
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Personas con un ingreso activo.
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 px-5 py-3">
          <p className="text-xs font-medium text-blue-600">
            Aforo actual
          </p>

          <p className="text-2xl font-bold text-blue-800">
            {personasDentro.length}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">

        {/* Buscador */}
        <div className="border-b border-slate-200 p-4">
          <div className="relative max-w-lg">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchIcon />
            </div>

            <input
              type="text"
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              placeholder="Buscar por DNI o nombre..."
              className="w-full rounded-lg border border-slate-300 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div>
            {personasFiltradas.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <PeopleIconLarge />
                </div>

                <h3 className="mt-4 font-bold text-slate-800">
                  {personasDentro.length === 0
                    ? 'No hay personas dentro'
                    : 'No se encontraron resultados'}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {personasDentro.length === 0
                    ? 'Cuando registres una entrada, aparecerá aquí.'
                    : 'Intenta buscar con otro DNI o nombre.'}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                {/* Vista de escritorio */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200">
                        <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Persona
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          DNI
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Destino
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Motivo
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Entrada
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Estado
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Acciones
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {personasFiltradas.map((registro) => (
                        <tr
                          key={registro.id}
                          className="border-b border-slate-100 last:border-b-0"
                        >
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-900">
                              {registro.persona.nombres}{' '}
                              {registro.persona.apellidos}
                            </p>

                            {registro.pacienteVisitado && (
                              <p className="mt-1 text-xs text-slate-500">
                                Visita a: {registro.pacienteVisitado}
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {registro.persona.dni}
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {obtenerNombreDestino(registro.destino)}
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {obtenerNombreMotivo(registro.motivo)}
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {formatearHora(registro.horaEntrada)}
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                              DENTRO
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => onRegistrarSalida(registro.id)}
                              className="whitespace-nowrap rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                            >
                              Registrar salida
                            </button>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Vista móvil */}
                <div className="divide-y divide-slate-100 md:hidden">
                  {personasFiltradas.map((registro) => (
                    <div
                      key={registro.id}
                      className="p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-slate-900">
                            {registro.persona.nombres}{' '}
                            {registro.persona.apellidos}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            DNI {registro.persona.dni}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                          DENTRO
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <DataField
                          label="Destino"
                          value={obtenerNombreDestino(registro.destino)}
                        />

                        <DataField
                          label="Entrada"
                          value={formatearHora(registro.horaEntrada)}
                        />

                        <DataField
                          label="Motivo"
                          value={obtenerNombreMotivo(registro.motivo)}
                        />
                      </div>

                      {registro.pacienteVisitado && (
                        <div className="mt-4 rounded-lg bg-amber-50 p-3">
                          <p className="text-xs font-semibold text-amber-800">
                            Paciente visitado
                          </p>

                          <p className="mt-1 text-sm text-amber-900">
                            {registro.pacienteVisitado}
                          </p>
                        </div>
                      )}

                      {/* BOTÓN DE SALIDA EN MÓVIL */}
                      <button
                        type="button"
                        onClick={() => onRegistrarSalida(registro.id)}
                        className="mt-4 w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                      >
                        Registrar salida
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

type FiltroHistorial = 'hoy' | 'ayer' | 'hace-2-dias'

type HistorialProps = {
  registros: RegistroAcceso[]
}

function Historial({ registros }: HistorialProps) {
  const [filtro, setFiltro] = useState<FiltroHistorial>('hoy')
  const [busquedaHistorial, setBusquedaHistorial] = useState('')

  const ahora = new Date()

  function obtenerFechaFiltro() {
    const fecha = new Date(ahora)

    if (filtro === 'ayer') {
      fecha.setDate(fecha.getDate() - 1)
    }

    if (filtro === 'hace-2-dias') {
      fecha.setDate(fecha.getDate() - 2)
    }

    return fecha
  }

  function esMismoDia(fechaA: Date, fechaB: Date) {
    return (
      fechaA.getFullYear() === fechaB.getFullYear() &&
      fechaA.getMonth() === fechaB.getMonth() &&
      fechaA.getDate() === fechaB.getDate()
    )
  }

  const fechaSeleccionada = obtenerFechaFiltro()
  const termino = busquedaHistorial.trim().toLowerCase()

  const registrosFiltrados = registros
    .filter((registro) =>
      esMismoDia(registro.horaEntrada, fechaSeleccionada),
    )
    .filter((registro) => {
      if (!termino) {
        return true
      }

      const nombreCompleto =
        `${registro.persona.nombres} ${registro.persona.apellidos}`.toLowerCase()

      return (
        registro.persona.dni.toLowerCase().includes(termino) ||
        nombreCompleto.includes(termino) ||
        obtenerNombreDestino(registro.destino)
          .toLowerCase()
          .includes(termino) ||
        obtenerNombreMotivo(registro.motivo)
          .toLowerCase()
          .includes(termino)
      )
    })
    .sort(
      (a, b) =>
        b.horaEntrada.getTime() - a.horaEntrada.getTime(),
    )

  const ingresos = registrosFiltrados.length

  const salidas = registrosFiltrados.filter(
    (registro) => registro.estado === 'SALIO',
  ).length

  const dentro = registrosFiltrados.filter(
    (registro) => registro.estado === 'DENTRO',
  ).length

  function obtenerTituloFecha() {
    if (filtro === 'hoy') {
      return 'Hoy'
    }

    if (filtro === 'ayer') {
      return 'Ayer'
    }

    return 'Hace 2 días'
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <p className="text-sm font-medium text-blue-600">
          Registros
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Historial de accesos
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Consulta las entradas y salidas registradas en el punto de
          acceso.
        </p>
      </div>

      {/* FILTROS POR FECHA */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFiltro('hoy')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            filtro === 'hoy'
              ? 'bg-blue-700 text-white'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          Hoy
        </button>

        <button
          type="button"
          onClick={() => setFiltro('ayer')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            filtro === 'ayer'
              ? 'bg-blue-700 text-white'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          Ayer
        </button>

        <button
          type="button"
          onClick={() => setFiltro('hace-2-dias')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            filtro === 'hace-2-dias'
              ? 'bg-blue-700 text-white'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          Hace 2 días
        </button>
      </div>

      {/* RESUMEN */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Ingresos
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {ingresos}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Salidas
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {salidas}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Permanecen dentro
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {dentro}
          </p>
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4">
        <div className="relative max-w-lg">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon />
          </div>

          <input
            type="text"
            value={busquedaHistorial}
            onChange={(e) =>
              setBusquedaHistorial(e.target.value)
            }
            placeholder="Buscar por DNI, nombre, destino o motivo..."
            className="w-full rounded-lg border border-slate-300 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* HISTORIAL */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-bold text-slate-800">
            {obtenerTituloFecha()}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {registrosFiltrados.length}{' '}
            {registrosFiltrados.length === 1
              ? 'registro encontrado'
              : 'registros encontrados'}
          </p>
        </div>

        {registrosFiltrados.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <HistoryIconLarge />
            </div>

            <h3 className="mt-4 font-semibold text-slate-700">
              No hay registros
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
              No se encontraron movimientos para la fecha y búsqueda
              seleccionadas.
            </p>
          </div>
        ) : (
          <>
            {/* ESCRITORIO */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Persona
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Documento
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Destino
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Entrada
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Salida
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Permanencia
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Estado
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {registrosFiltrados.map((registro) => (
                    <tr
                      key={registro.id}
                      className="border-b border-slate-100 last:border-b-0"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {registro.persona.nombres}{' '}
                          {registro.persona.apellidos}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {obtenerNombreMotivo(registro.motivo)}
                        </p>

                        {registro.pacienteVisitado && (
                          <p className="mt-1 text-xs text-amber-700">
                            Visita a: {registro.pacienteVisitado}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {registro.persona.dni}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {obtenerNombreDestino(registro.destino)}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatearHora(registro.horaEntrada)}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {registro.horaSalida
                          ? formatearHora(registro.horaSalida)
                          : '—'}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {calcularDuracionRegistro(registro)}
                      </td>

                      <td className="px-5 py-4">
                        {registro.estado === 'DENTRO' ? (
                          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                            DENTRO
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                            SALIÓ
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MÓVIL */}
            <div className="divide-y divide-slate-100 md:hidden">
              {registrosFiltrados.map((registro) => (
                <div key={registro.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900">
                        {registro.persona.nombres}{' '}
                        {registro.persona.apellidos}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        DNI {registro.persona.dni}
                      </p>
                    </div>

                    {registro.estado === 'DENTRO' ? (
                      <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                        DENTRO
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        SALIÓ
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <DataField
                      label="Destino"
                      value={obtenerNombreDestino(registro.destino)}
                    />

                    <DataField
                      label="Motivo"
                      value={obtenerNombreMotivo(registro.motivo)}
                    />

                    <DataField
                      label="Entrada"
                      value={formatearHora(registro.horaEntrada)}
                    />

                    <DataField
                      label="Salida"
                      value={
                        registro.horaSalida
                          ? formatearHora(registro.horaSalida)
                          : '—'
                      }
                    />

                    <DataField
                      label="Permanencia"
                      value={calcularDuracionRegistro(registro)}
                    />
                  </div>

                  {registro.pacienteVisitado && (
                    <div className="mt-4 rounded-lg bg-amber-50 p-3">
                      <p className="text-xs font-semibold text-amber-700">
                        Paciente visitado
                      </p>

                      <p className="mt-1 text-sm font-semibold text-amber-900">
                        {registro.pacienteVisitado}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* =====================================================
   COMPONENTES PEQUEÑOS
===================================================== */

function DataField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-semibold text-slate-800">
        {value}
      </p>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path
        d="M5 12l4 4L19 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type MenuButtonProps = {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}

function MenuButton({
  active,
  onClick,
  icon,
  children,
}: MenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-slate-300 hover:bg-white/10 hover:text-white'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}

type StatCardProps = {
  label: string
  value: string
  description: string
}

function StatCard({
  label,
  value,
  description,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  )
}

type ActionCardProps = {
  title: string
  description: string
  buttonText: string
  onClick: () => void
  icon: React.ReactNode
}

function ActionCard({
  title,
  description,
  buttonText,
  onClick,
  icon,
}: ActionCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 min-h-[40px] text-sm leading-5 text-slate-500">
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-5 w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
      >
        {buttonText}
      </button>
    </div>
  )
}

function DocumentType({
  label,
}: {
  label: string
}) {
  return (
    <div className="rounded-lg border border-blue-100 bg-white px-2 py-3 text-xs font-medium text-slate-600">
      {label}
    </div>
  )
}

function FilterButton({
  active = false,
  children,
}: {
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      className={`rounded-lg px-4 py-2 text-sm font-medium ${
        active
          ? 'bg-blue-700 text-white'
          : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  )
}

/* =====================================================
   ICONOS SVG
===================================================== */

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  )
}

function EntryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21v-2a7 7 0 0114 0v2" />
      <path d="M16 4a4 4 0 010 8" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  )
}

function ExitIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M10 17l5-5-5-5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M15 12H3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M14 4h5a2 2 0 012 2v12a2 2 0 01-2 2h-5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  )
}

function DniIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8" cy="11" r="2" />
      <path d="M6 16c.7-2 3.3-2 4 0M13 10h5M13 14h5" strokeLinecap="round" />
    </svg>
  )
}

function ScanIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" strokeLinecap="round" />
      <path d="M7 12h10" strokeLinecap="round" />
    </svg>
  )
}

function ComputerIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" strokeLinecap="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" strokeLinecap="round" />
    </svg>
  )
}

function EntryIconLarge() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  )
}

function PeopleIconLarge() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21v-2a7 7 0 0114 0v2M16 4a4 4 0 010 8" />
    </svg>
  )
}

function HistoryIconLarge() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  )
}