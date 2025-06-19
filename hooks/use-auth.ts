"use client"

import { useState, useEffect } from "react"

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar estado de sesión al inicializar
  useEffect(() => {
    const savedAdminState = localStorage.getItem("admin-session")
    if (savedAdminState === "true") {
      setIsAdmin(true)
    }
    setIsLoading(false)
  }, [])

  // Guardar estado de sesión cuando cambie
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("admin-session", isAdmin.toString())
    }
  }, [isAdmin, isLoading])

  const login = async (password: string) => {
    // TODO: Integrar con Firestore para validar credenciales
    // Por ahora, cualquier contraseña funciona
    setIsAdmin(true)
    return true
  }

  const logout = () => {
    setIsAdmin(false)
    localStorage.removeItem("admin-session")
  }

  return {
    isAdmin,
    isLoading,
    login,
    logout,
  }
}
