import { useState } from 'react'
import ControlAccesoPage from './pages/ControlAccesoPage'
import LoginPage, { type RolUsuario } from './pages/LoginPage'
import AdminPage from './pages/admin/AdminPage'

export default function App() {
  const [rolUsuario, setRolUsuario] =
    useState<RolUsuario | null>(null)

  function handleLogin(rol: RolUsuario) {
    setRolUsuario(rol)
  }

  function handleLogout() {
    setRolUsuario(null)
  }

  if (rolUsuario === 'ADMIN') {
    return <AdminPage onLogout={handleLogout} />
  }

  if (rolUsuario === 'VIGILANTE') {
    return <ControlAccesoPage onLogout={handleLogout} />
  }

  return <LoginPage onLogin={handleLogin} />
}