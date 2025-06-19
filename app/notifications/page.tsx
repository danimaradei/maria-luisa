"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { LoginDialog } from "@/components/dialogs/login-dialog"
import { SearchInput } from "@/components/search-input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useInventory } from "@/hooks/use-inventory"
import { useAuth } from "@/hooks/use-auth"
import { AlertTriangle, CheckCircle } from "lucide-react"

export default function NotificationsPage() {
  const router = useRouter()
  const { lowStockItems, outOfStockItems } = useInventory()
  const { isAdmin, login, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogin = async (password: string) => {
    return await login(password)
  }

  const allAlerts = [...outOfStockItems, ...lowStockItems.filter((item) => item.quantity > 0)]

  // Filtrar alertas por búsqueda
  const filteredAlerts = allAlerts.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const hasAlerts = allAlerts.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isAdmin={isAdmin}
        onLoginClick={() => setShowLogin(true)}
        onLogout={logout}
        showBackButton
        onBackClick={() => router.push("/")}
        title="Notificaciones"
      />

      <div className="p-4">
        <div className="max-w-md mx-auto space-y-4">
          {hasAlerts && (
            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Buscar en alertas..." />
          )}

          {searchQuery && hasAlerts && (
            <div className="text-sm text-gray-500">
              {filteredAlerts.length === 0
                ? `No se encontraron alertas que coincidan con "${searchQuery}"`
                : `${filteredAlerts.length} ${filteredAlerts.length === 1 ? "alerta encontrada" : "alertas encontradas"}`}
            </div>
          )}

          {hasAlerts ? (
            filteredAlerts.length > 0 ? (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                    <AlertTriangle className="h-5 w-5" />
                    Alertas de Inventario ({filteredAlerts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {filteredAlerts.map((item) => {
                    const isOutOfStock = item.quantity === 0
                    return (
                      <Alert
                        key={item.id}
                        className={isOutOfStock ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50"}
                      >
                        <AlertDescription className={`text-base ${isOutOfStock ? "text-red-800" : "text-yellow-800"}`}>
                          <strong>{item.name}</strong>{" "}
                          {isOutOfStock
                            ? "está completamente fuera de stock"
                            : `tiene stock bajo (${item.quantity === 1 ? "queda 1 unidad" : `quedan ${item.quantity} unidades`})`}
                        </AlertDescription>
                      </Alert>
                    )
                  })}
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 text-base">No se encontraron alertas que coincidan con la búsqueda</p>
              </div>
            )
          ) : (
            <div className="text-center py-10">
              <div className="text-green-600 mb-4">
                <CheckCircle className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">¡Todo en orden!</h3>
              <p className="text-gray-500 text-sm">No hay alertas de inventario en este momento</p>
            </div>
          )}
        </div>
      </div>

      <LoginDialog open={showLogin} onOpenChange={setShowLogin} onLogin={handleLogin} />
    </div>
  )
}
