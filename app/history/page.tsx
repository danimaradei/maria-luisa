"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { LoginDialog } from "@/components/dialogs/login-dialog"
import { UsageHistoryDialog } from "@/components/dialogs/usage-history-dialog"
import { SearchInput } from "@/components/search-input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useInventory } from "@/hooks/use-inventory"
import { useAuth } from "@/hooks/use-auth"
import { Calendar, Package, ChevronRight } from "lucide-react"
import type { DailyUsageGroup } from "@/types/inventory"

export default function HistoryPage() {
  const router = useRouter()
  const { usageHistory } = useInventory()
  const { isAdmin, login, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showUsageDialog, setShowUsageDialog] = useState(false)
  const [selectedUsageGroup, setSelectedUsageGroup] = useState<DailyUsageGroup | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogin = async (email: string, password: string) => {
    return await login(email, password)
  }


  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateString === today.toISOString().split("T")[0]) {
      return "Hoy"
    } else if (dateString === yesterday.toISOString().split("T")[0]) {
      return "Ayer"
    } else {
      return date.toLocaleDateString("es-ES", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    }
  }

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Filtrar historial por búsqueda (buscar en nombres de productos)
  const filteredHistory = usageHistory.filter((group) =>
    group.items.some((item) => item.productName.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleUsageGroupClick = (group: DailyUsageGroup) => {
    setSelectedUsageGroup(group)
    setShowUsageDialog(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isAdmin={isAdmin}
        onLoginClick={() => setShowLogin(true)}
        onLogout={logout}
        showBackButton
        onBackClick={() => router.push("/")}
        title="Historial de Consumos"
      />

      <div className="p-4">
        <div className="max-w-md mx-auto space-y-4">
          {usageHistory.length > 0 && (
            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Buscar productos en historial..." />
          )}

          {searchQuery && (
            <div className="text-sm text-gray-500">
              {filteredHistory.length === 0
                ? `No se encontraron registros que coincidan con "${searchQuery}"`
                : `${filteredHistory.length} ${filteredHistory.length === 1 ? "día encontrado" : "días encontrados"}`}
            </div>
          )}

          {filteredHistory.length > 0 ? (
            <div className="space-y-3">
              {filteredHistory.map((group) => (
                <Card
                  key={group.date}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleUsageGroupClick(group)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base">{formatDate(group.date)}</h3>
                          <p className="text-sm text-gray-600">{formatFullDate(group.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Package className="h-3 w-3 text-gray-400" />
                            <Badge variant="outline" className="text-xs">
                              {group.totalProducts}
                            </Badge>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {group.totalQuantity} unidades
                          </Badge>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {searchQuery ? "No se encontraron registros" : "Sin historial de usos"}
              </h3>
              <p className="text-gray-500 text-sm">
                {searchQuery
                  ? "Intenta con otros términos de búsqueda"
                  : "Los productos que uses aparecerán aquí organizados por fecha"}
              </p>
            </div>
          )}
        </div>
      </div>

      <LoginDialog open={showLogin} onOpenChange={setShowLogin} onLogin={handleLogin} />

      <UsageHistoryDialog open={showUsageDialog} onOpenChange={setShowUsageDialog} usageGroup={selectedUsageGroup} />
    </div>
  )
}
