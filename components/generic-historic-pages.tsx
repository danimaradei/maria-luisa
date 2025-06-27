"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, ChevronRight } from "lucide-react"
import { Header } from "@/components/layout/header"
import { SearchInput } from "@/components/search-input"
import { Card, CardContent } from "@/components/ui/card"
import { LoginDialog } from "@/components/dialogs/login-dialog"

interface HistoryPageTemplateProps<T> {
  title: string
  data: T[]
  getDate: (item: T) => string
  getSearchStrings: (item: T) => string[]
  renderBadges?: (item: T) => React.ReactNode
  renderDialog: (selected: T | null, open: boolean, onOpenChange: (open: boolean) => void) => React.ReactNode
  onLogin: (email: string, password: string) => Promise<boolean>
  isAdmin: boolean
  onLogout: () => void
}

export function HistoryPageTemplate<T>({
  title,
  data,
isAdmin,
  getDate,
  getSearchStrings,
  renderBadges,
  renderDialog,
  onLogin,
  onLogout,
}: HistoryPageTemplateProps<T>) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [showLogin, setShowLogin] = useState(false)
  const [selectedItem, setSelectedItem] = useState<T | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  const filteredData = data.filter((group) =>
    getSearchStrings(group).some((s) =>
      s.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateString === today.toISOString().split("T")[0]) return "Hoy"
    if (dateString === yesterday.toISOString().split("T")[0]) return "Ayer"
    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isAdmin={isAdmin}
        onLoginClick={() => setShowLogin(true)}
        onLogout={onLogout}
        showBackButton
        onBackClick={() => router.push("/")}
        title={title}
      />

      <div className="p-4">
        <div className="max-w-md mx-auto space-y-4">
          {data.length > 0 && (
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar productos en historial..."
            />
          )}

          {searchQuery && (
            <div className="text-sm text-gray-500">
              {filteredData.length === 0
                ? `No se encontraron registros que coincidan con "${searchQuery}"`
                : `${filteredData.length} ${
                    filteredData.length === 1 ? "día encontrado" : "días encontrados"
                  }`}
            </div>
          )}

          {filteredData.length > 0 ? (
            <div className="space-y-3">
              {filteredData.map((group, idx) => {
                const date = getDate(group)
                return (
                  <Card
                    key={date + idx}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setSelectedItem(group)
                      setShowDialog(true)
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-base">
                              {formatDate(date)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {formatFullDate(date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {renderBadges?.(group)}
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {searchQuery
                  ? "No se encontraron registros"
                  : "Sin historial de usos"}
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

      <LoginDialog open={showLogin} onOpenChange={setShowLogin} onLogin={onLogin} />
      {renderDialog(selectedItem, showDialog, setShowDialog)}
    </div>
  )
}
