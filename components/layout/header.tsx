"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, User, LogOut, ArrowLeft } from "lucide-react"

interface HeaderProps {
  isAdmin: boolean
  onLoginClick: () => void
  onLogout: () => void
  showBackButton?: boolean
  onBackClick?: () => void
  title?: string
}

export function Header({
  isAdmin,
  onLoginClick,
  onLogout,
  showBackButton = false,
  onBackClick,
  title = "Inventario",
}: HeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton && onBackClick && (
              <Button variant="ghost" size="sm" onClick={onBackClick}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-xs px-2 py-1">
                  Administrador
                </Badge>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={onLoginClick}>
                <User className="h-4 w-4 mr-1" />
                <span className="text-sm">Admin</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
