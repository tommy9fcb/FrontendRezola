import { useState } from 'react'
import AdminDashboard from './AdminDashboard'
import MonitoreoAccesos from './MonitoreoAccesos'
import Usuarios from './Usuarios'
import Reportes from './Reportes'

type AdminPageProps = {
  onLogout: () => void
}

type VistaAdmin =
  | 'dashboard'
  | 'monitoreo'
  | 'usuarios'
  | 'reportes'

export default function AdminPage({
  onLogout,
}: AdminPageProps) {
  const [vista, setVista] = useState<VistaAdmin>('dashboard')
  const [menuMovil, setMenuMovil] = useState(false)

  function cambiarVista(nuevaVista: VistaAdmin) {
    setVista(nuevaVista)
    setMenuMovil(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* =========================
          MENÚ LATERAL - PC
      ========================== */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#0d1f3c] lg:flex">

        {/* Marca */}
        <div className="border-b border-white/10 px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
            Control y Monitoreo de Acceso y Aforo
          </p>

          <h1 className="mt-2 text-lg font-bold text-white">
            Administración
          </h1>

          <p className="mt-1 text-xs text-slate-400">
            Hospital Regional Rezola
          </p>
        </div>

        {/* Navegación */}
        <nav className="flex-1 space-y-2 p-4">
          <AdminMenuButton
            active={vista === 'dashboard'}
            onClick={() => cambiarVista('dashboard')}
            icon={<DashboardIcon />}
          >
            Dashboard
          </AdminMenuButton>

          <AdminMenuButton
            active={vista === 'monitoreo'}
            onClick={() => cambiarVista('monitoreo')}
            icon={<MonitorIcon />}
          >
            Monitoreo de accesos
          </AdminMenuButton>

          <AdminMenuButton
            active={vista === 'usuarios'}
            onClick={() => cambiarVista('usuarios')}
            icon={<UsersIcon />}
          >
            Usuarios
          </AdminMenuButton>

          <AdminMenuButton
            active={vista === 'reportes'}
            onClick={() => cambiarVista('reportes')}
            icon={<ReportIcon />}
          >
            Reportes
          </AdminMenuButton>
        </nav>

        {/* Usuario administrador */}
        <div className="border-t border-white/10 p-4">
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              A
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                Administrador
              </p>

              <p className="text-xs text-slate-400">
                Administración
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
                  Administración
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
              <AdminMenuButton
                active={vista === 'dashboard'}
                onClick={() => cambiarVista('dashboard')}
                icon={<DashboardIcon />}
              >
                Dashboard
              </AdminMenuButton>

              <AdminMenuButton
                active={vista === 'monitoreo'}
                onClick={() => cambiarVista('monitoreo')}
                icon={<MonitorIcon />}
              >
                Monitoreo de accesos
              </AdminMenuButton>

              <AdminMenuButton
                active={vista === 'usuarios'}
                onClick={() => cambiarVista('usuarios')}
                icon={<UsersIcon />}
              >
                Usuarios
              </AdminMenuButton>

              <AdminMenuButton
                active={vista === 'reportes'}
                onClick={() => cambiarVista('reportes')}
                icon={<ReportIcon />}
              >
                Reportes
              </AdminMenuButton>
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

        {/* Cabecera */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

            <div className="flex items-center gap-3">
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
                  Panel de Administración
                </p>
              </div>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
              ADMIN
            </span>
          </div>
        </header>

        {/* Pantallas */}
        <main className="p-4 sm:p-6 lg:p-8">
          {vista === 'dashboard' && <AdminDashboard />}

          {vista === 'monitoreo' && <MonitoreoAccesos />}

          {vista === 'usuarios' && <Usuarios />}

          {vista === 'reportes' && <Reportes />}
        </main>
      </div>
    </div>
  )
}

/* =====================================================
   COMPONENTES AUXILIARES
===================================================== */

type AdminMenuButtonProps = {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}

function AdminMenuButton({
  active,
  onClick,
  icon,
  children,
}: AdminMenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
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

function PantallaTemporal({
  titulo,
  descripcion,
}: {
  titulo: string
  descripcion: string
}) {
  return (
    <div className="mx-auto max-w-7xl">
      <p className="text-sm font-medium text-blue-600">
        Administración
      </p>

      <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
        {titulo}
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        {descripcion}
      </p>

      <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <p className="font-semibold text-slate-700">
          Módulo en construcción
        </p>

        <p className="mt-2 text-sm text-slate-400">
          Aquí construiremos esta interfaz.
        </p>
      </div>
    </div>
  )
}

/* =====================================================
   ICONOS
===================================================== */

function DashboardIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function MonitorIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" strokeLinecap="round" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21v-2a7 7 0 0114 0v2" />
      <path d="M16 4a4 4 0 010 8" />
    </svg>
  )
}

function ReportIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 20V10" strokeLinecap="round" />
      <path d="M10 20V4" strokeLinecap="round" />
      <path d="M16 20v-7" strokeLinecap="round" />
      <path d="M22 20H2" strokeLinecap="round" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M4 6h16M4 12h16M4 18h16"
        strokeLinecap="round"
      />
    </svg>
  )
}