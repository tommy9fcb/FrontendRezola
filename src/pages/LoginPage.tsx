import { useState, useEffect } from 'react'
import hospitalImage from '../assets/hospital-portada.png'
import logoRezola from '../assets/hospital-icon.jpg'

export type RolUsuario = 'ADMIN' | 'VIGILANTE'

type LoginPageProps = {
  onLogin: (rol: RolUsuario) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password) {
      setError('Por favor, complete todos los campos.')
      return
    }
    setLoading(true)

    setTimeout(() => {
      setLoading(false)

      if (username === 'admin' && password === 'admin123') {
        onLogin('ADMIN')
        return
      }

      if (
        username === 'vigilante' && password === 'vigilante123') {
        onLogin('VIGILANTE')
        return
      }

      setError(
        'Credenciales incorrectas. Verificar usuario y contraseña.',
      )
    }, 1500)
  }

  const dateStr = time.toLocaleDateString('es-AR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  })

return (
  <div
    className="min-h-screen flex items-center justify-center bg-slate-100 p-4 sm:p-6"
    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
  >
    {/* Tarjeta principal */}
    <div className="w-full max-w-5xl min-h-[620px] flex overflow-hidden rounded-2xl bg-white shadow-2xl">

      {/* ── PANEL IZQUIERDO ── */}
      <div
        className="relative hidden w-[48%] flex-col justify-between overflow-hidden p-12 lg:flex"
        style={{
          backgroundImage: `url(${hospitalImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Capa azul transparente */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(150deg, rgba(13,31,60,0.94) 0%, rgba(18,34,72,0.90) 45%, rgba(29,78,216,0.82) 100%)',
          }}
        />

        {/* Textura */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Brillo decorativo */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Contenido superior */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div
              className="h-px w-8"
              style={{ background: '#38bdf8' }}
            />

            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{
                color: '#38bdf8',
                fontSize: 11,
              }}
            >
              Sistema Hospitalario
            </span>
          </div>

          <h1
            className="font-extrabold leading-[1.05]"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: '#ffffff',
            }}
          >
            Sistema de{' '}
            <span style={{ color: '#38bdf8' }}>
              Control
            </span>
            <br />
            de Accesos
          </h1>
        </div>

        {/* Parte inferior */}
        <div className="relative z-10">
          <p
            className="text-xs"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            © {time.getFullYear()} Hospital Rezola Cañete
          </p>
        </div>
      </div>

      {/* ── PANEL DERECHO ── */}
      <div className="flex-1 flex flex-col bg-white">

        {/* Barra superior */}
        <div
          className="flex items-center justify-between px-6 sm:px-10 py-4 border-b"
          style={{ borderColor: '#e2e8f0' }}
        >
          {/* Hospital */}
          <div className="flex items-center gap-3">
            <img
              src={logoRezola}
              alt="Logo del Hospital Regional Rezola"
              className="w-10 h-10 object-contain"
            />

            <div>
              <div
                className="text-sm font-bold leading-tight"
                style={{ color: '#1e293b' }}
              >
                Hospital Regional
              </div>

              <div
                className="text-xs"
                style={{ color: '#64748b' }}
              >
                Rezola — Cañete
              </div>
            </div>
          </div>

          {/* Reloj */}
          <div className="text-right hidden sm:block">
            <div
              className="text-xs font-semibold tabular-nums"
              style={{ color: '#1e293b' }}
            >
              {time.toLocaleTimeString('es-PE', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </div>

            <div
              className="text-xs capitalize"
              style={{
                color: '#94a3b8',
                fontSize: 10,
              }}
            >
              {dateStr}
            </div>
          </div>
        </div>

        {/* Área del formulario */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10">
          <div className="w-full max-w-[400px]">

            {/* Título */}
            <div className="mb-8">
              <h2
                className="text-3xl font-bold mb-1.5"
                style={{ color: '#1e293b' }}
              >
                Bienvenido
              </h2>

              <div className="flex items-center gap-2 mb-1">
                <div
                  className="h-0.5 w-8 rounded"
                  style={{ background: '#1d4ed8' }}
                />

                <p
                  className="text-sm"
                  style={{ color: '#64748b' }}
                >
                  Ingresa tus credenciales para comenzar tu turno
                </p>
              </div>
            </div>

            {/* Formulario */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              noValidate
            >

              {/* Usuario */}
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                  style={{
                    color: '#475569',
                    fontSize: 11,
                  }}
                >
                  Nombre de usuario
                </label>

                <div className="relative">
                  <div
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: '#94a3b8' }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>

                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ingrese su usuario"
                    autoComplete="username"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded outline-none transition-all"
                    style={{
                      background: '#f8fafc',
                      border: '1.5px solid',
                      borderColor: username
                        ? '#1d4ed8'
                        : '#e2e8f0',
                      color: '#1e293b',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor =
                        '#1d4ed8')
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor =
                        username
                          ? '#1d4ed8'
                          : '#e2e8f0')
                    }
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                  style={{
                    color: '#475569',
                    fontSize: 11,
                  }}
                >
                  Contraseña
                </label>

                <div className="relative">
                  <div
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: '#94a3b8' }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                      />

                      <path
                        d="M7 11V7a5 5 0 0110 0v4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Ingrese su contraseña"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-12 py-3 text-sm rounded outline-none transition-all"
                    style={{
                      background: '#f8fafc',
                      border: '1.5px solid',
                      borderColor: password
                        ? '#1d4ed8'
                        : '#e2e8f0',
                      color: '#1e293b',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor =
                        '#1d4ed8')
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor =
                        password
                          ? '#1d4ed8'
                          : '#e2e8f0')
                    }
                  />

                  {/* Mostrar / ocultar contraseña */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#94a3b8' }}
                  >
                    {showPassword ? (
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                          strokeLinecap="round"
                        />
                        <line
                          x1="1"
                          y1="1"
                          x2="23"
                          y2="23"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Recordar + Soporte */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <button
                    type="button"
                    onClick={() =>
                      setRemember(!remember)
                    }
                    className="w-10 h-6 rounded-full relative transition-colors shrink-0"
                    style={{
                      background: remember
                        ? '#1d4ed8'
                        : '#e2e8f0',
                    }}
                  >
                    <span
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform"
                      style={{
                        left: 4,
                        transform: remember
                          ? 'translateX(16px)'
                          : 'translateX(0)',
                      }}
                    />
                  </button>

                  <span
                    className="text-sm"
                    style={{ color: '#64748b' }}
                  >
                    Recordar sesión
                  </span>
                </label>

                <button
                  type="button"
                  className="flex items-center gap-1.5 text-sm font-medium"
                  style={{ color: '#1d4ed8' }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 18v-6a9 9 0 0118 0v6" />
                    <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
                  </svg>

                  Soporte
                </button>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="flex items-start gap-2.5 px-4 py-3 rounded text-sm"
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="shrink-0 mt-0.5"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                    />
                    <line
                      x1="12"
                      y1="8"
                      x2="12"
                      y2="12"
                      strokeLinecap="round"
                    />
                    <line
                      x1="12"
                      y1="16"
                      x2="12.01"
                      y2="16"
                      strokeLinecap="round"
                    />
                  </svg>

                  {error}
                </div>
              )}

              {/* Botón iniciar sesión */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 text-sm font-semibold rounded flex items-center justify-center gap-2 transition-all"
                style={{
                  background: loading
                    ? '#2563eb'
                    : '#1d4ed8',
                  color: '#ffffff',
                  opacity: loading ? 0.85 : 1,
                  cursor: loading
                    ? 'not-allowed'
                    : 'pointer',
                  boxShadow: loading
                    ? 'none'
                    : '0 4px 14px rgba(29,78,216,0.35)',
                }}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        d="M21 12a9 9 0 11-6.219-8.56"
                        strokeLinecap="round"
                      />
                    </svg>

                    Verificando…
                  </>
                ) : (
                  <>
                    Iniciar sesión

                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        d="M5 12h14M12 5l7 7-7 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Pie */}
            <div
              className="mt-8 pt-6 border-t flex flex-col items-center gap-1.5"
              style={{ borderColor: '#e2e8f0' }}
            >
              <div
                className="flex items-center gap-2 text-xs"
                style={{ color: '#94a3b8' }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: '#22c55e',
                    boxShadow: '0 0 4px #22c55e',
                  }}
                />

                Conexión segura · Datos protegidos
              </div>

              <p
                className="text-xs text-center"
                style={{ color: '#cbd5e1' }}
              >
                Sistema desarrollado por el Área de Informática
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)
}
