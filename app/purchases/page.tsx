"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { LoginDialog } from "@/components/dialogs/login-dialog"
import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog"
import { AddProductDialog } from "@/components/dialogs/add-product-dialog"
import { SearchInput } from "@/components/search-input"
import { ProductListItem } from "@/components/product-list-item"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useInventory } from "@/hooks/use-inventory"
import { useAuth } from "@/hooks/use-auth"
import { Minus, Plus } from "lucide-react"
import type { PendingAction, NewProduct } from "@/types/inventory"

export default function PurchasesPage() {
  const router = useRouter()
  const { products, confirmPurchases, addProduct } = useInventory()
  const { isAdmin, login, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Estado local para contadores de compra
  const [purchaseCounters, setPurchaseCounters] = useState<Record<string, number>>({})
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    initialQuantity: 0,
    minQuantity: 1,
  })

  const handleLogin = async (email: string, password: string) => {
    return await login(email, password)
  }


  // Filtrar productos por búsqueda
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const updateCounter = (productId: string, change: number) => {
    setPurchaseCounters((prev) => {
      const current = prev[productId] || 0
      const newValue = Math.max(0, current + change)

      if (newValue === 0) {
        const { [productId]: removed, ...rest } = prev
        return rest
      }

      return { ...prev, [productId]: newValue }
    })
  }

  const handleConfirmPurchases = () => {
    const items = Object.entries(purchaseCounters)
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
      type: "buy",
      items,
      total,
    })
    setShowConfirmDialog(true)
  }

  const executeConfirmation = () => {
    if (pendingAction) {
      confirmPurchases(pendingAction.items)
      setPurchaseCounters({})
      setShowConfirmDialog(false)
      setPendingAction(null)
    }
  }

  const handleAddProduct = () => {
  if (newProduct.name.trim()) {
    const addedProduct = addProduct(newProduct)

    // Esperar que `addProduct` devuelva el producto con `id`
    if (addedProduct && addedProduct.id) {
      setPurchaseCounters((prev) => ({
        ...prev,
        [addedProduct.id]: newProduct.initialQuantity,
      }))
    }

    setNewProduct({ name: "", initialQuantity: 0, minQuantity: 1 })
    setShowAddProduct(false)
  }
}


  const hasItems = Object.values(purchaseCounters).some((count) => count > 0)

  // Redirigir si no es admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          isAdmin={isAdmin}
          onLoginClick={() => setShowLogin(true)}
          onLogout={logout}
          showBackButton
          onBackClick={() => router.push("/")}
          title="Acceso Restringido"
        />

        <div className="p-4">
          <div className="max-w-md mx-auto text-center py-10">
            <p className="text-gray-500 text-base mb-4">Esta página requiere permisos de administrador</p>
            <Button onClick={() => setShowLogin(true)} className="text-lg py-6 px-8">
              Iniciar Sesión como Administrador
            </Button>
          </div>
        </div>

        <LoginDialog open={showLogin} onOpenChange={setShowLogin} onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isAdmin={isAdmin}
        onLoginClick={() => setShowLogin(true)}
        onLogout={logout}
        showBackButton
        onBackClick={() => router.push("/")}
        title="Productos Comprados"
      />

      <div className="p-4">
        <div className="max-w-md mx-auto space-y-4">
          <Button onClick={() => setShowAddProduct(true)} className="w-full text-base py-4" variant="outline">
            + Crear Producto Nuevo
          </Button>

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
                  const counter = purchaseCounters[product.id] || 0

                  return (
                    <ProductListItem
                      key={product.id}
                      product={product}
                      isNew={product.quantity === 0 && counter > 0}
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
                  <Button onClick={handleConfirmPurchases} className="w-full text-lg py-6" size="lg">
                    Confirmar Compra de Productos (
                    {Object.values(purchaseCounters).reduce((sum, count) => sum + count, 0)})
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

      <AddProductDialog
        open={showAddProduct}
        onOpenChange={setShowAddProduct}
        newProduct={newProduct}
        onProductChange={setNewProduct}
        onAddProduct={handleAddProduct}
      />
    </div>
  )
}
