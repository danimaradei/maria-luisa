"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { LoginDialog } from "@/components/dialogs/login-dialog"
import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog"
import { SearchInput } from "@/components/search-input"
import { ProductListItem } from "@/components/product-list-item"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useInventory } from "@/hooks/use-inventory"
import { useAuth } from "@/hooks/use-auth"
import { Minus, Plus } from "lucide-react"
import type { PendingAction } from "@/types/inventory"

export default function UsagePage() {
  const router = useRouter()
  const { products, confirmUsage } = useInventory()
  const { isAdmin, login, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Estado local para contadores de uso
  const [usageCounters, setUsageCounters] = useState<Record<string, number>>({})

  const handleLogin = async (email: string, password: string) => {
    return await login(email, password)
  }


  // Filtrar productos por búsqueda
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const updateCounter = (productId: string, change: number) => {
    setUsageCounters((prev) => {
      const current = prev[productId] || 0
      const product = products.find((p) => p.id === productId)
      const maxUsage = product?.quantity || 0
      const newValue = Math.max(0, Math.min(maxUsage, current + change))

      if (newValue === 0) {
        const { [productId]: removed, ...rest } = prev
        return rest
      }

      return { ...prev, [productId]: newValue }
    })
  }

  const handleConfirmUsage = () => {
    const items = Object.entries(usageCounters)
      .filter(([_, quantity]) => quantity > 0)
      .map(([productId, quantity]) => {
        const product = products.find((p) => p.id === productId)
        return {
          productId,
          productName: product?.name || "",
          quantity,
        }
      })

    if (items.length === 0) return

    const total = items.reduce((sum, item) => sum + item.quantity, 0)

    setPendingAction({
      type: "use",
      items,
      total,
    })
    setShowConfirmDialog(true)
  }

  const executeConfirmation = () => {
    if (pendingAction) {
      confirmUsage(pendingAction.items)
      setUsageCounters({})
      setShowConfirmDialog(false)
      setPendingAction(null)
    }
  }

  const hasItems = Object.values(usageCounters).some((count) => count > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isAdmin={isAdmin}
        onLoginClick={() => setShowLogin(true)}
        onLogout={logout}
        showBackButton
        onBackClick={() => router.push("/")}
        title="Productos Usados"
      />

      <div className="p-4">
        <div className="max-w-md mx-auto space-y-4">
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Buscar productos para registrar..." />

          {searchQuery && (
            <div className="text-sm text-gray-500">
              {filteredProducts.length === 0
                ? `No se encontraron productos que coincidan con "${searchQuery}"`
                : `${filteredProducts.length} ${filteredProducts.length === 1 ? "producto encontrado" : "productos encontrados"}`}
            </div>
          )}

          {filteredProducts.length > 0 ? (
            <>
              <Card className="divide-y divide-gray-100">
                {filteredProducts.map((product) => {
                  const counter = usageCounters[product.id] || 0
                  const maxUsage = product.quantity
                  const isOutOfStock = product.quantity === 0

                  return (
                    <ProductListItem
                      key={product.id}
                      product={product}
                      rightContent={
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCounter(product.id, -1)}
                            disabled={counter === 0}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-lg font-bold min-w-[2rem] text-center">{counter}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCounter(product.id, 1)}
                            disabled={counter >= maxUsage || isOutOfStock}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      }
                    />
                  )
                })}
              </Card>

              {hasItems && (
                <div className="sticky bottom-4 pt-4">
                  <Button onClick={handleConfirmUsage} className="w-full text-lg py-6" size="lg">
                    Confirmar Uso de Productos ({Object.values(usageCounters).reduce((sum, count) => sum + count, 0)})
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 text-base">
                {searchQuery ? "No se encontraron productos" : "No hay productos disponibles"}
              </p>
            </div>
          )}
        </div>
      </div>

      <LoginDialog open={showLogin} onOpenChange={setShowLogin} onLogin={handleLogin} />

      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        pendingAction={pendingAction}
        onConfirm={executeConfirmation}
      />
    </div>
  )
}
