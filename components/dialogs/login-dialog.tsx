"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogin: (password: string) => Promise<boolean>
}

export function LoginDialog({ open, onOpenChange, onLogin }: LoginDialogProps) {
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    if (!password.trim()) {
      setError("Por favor ingresa una contraseña")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const success = await onLogin(password)
      if (success) {
        setPassword("")
        onOpenChange(false)
      } else {
        setError("Contraseña incorrecta")
      }
    } catch (err) {
      setError("Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl">Iniciar Sesión como Administrador</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="password" className="text-base">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingresar contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-lg py-6 mt-2"
              disabled={isLoading}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
          <Button onClick={handleLogin} disabled={isLoading} className="w-full text-lg py-6">
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
