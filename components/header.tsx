"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, User, LogOut } from "lucide-react"

interface HeaderProps {
  isAdmin: boolean
  onAdminToggle: () => void
  onLoginClick: () => void
}

export function Header({ isAdmin, onAdminToggle, onLoginClick }: HeaderProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Button variant="outline" size="sm" onClick={onAdminToggle} className="text-base">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={onLoginClick} className="text-base">
              <User className="h-4 w-4 mr-2" />
              Administrador
            </Button>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="text-center">
        <Badge variant={isAdmin ? "default" : "secondary"} className="text-base px-4 py-2">
          {isAdmin ? "Modo Administrador" : "Modo invitado"}
        </Badge>
      </div>
    </>
  )
}
