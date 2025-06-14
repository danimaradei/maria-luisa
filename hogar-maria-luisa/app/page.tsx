"use client"

import {Alert, AlertDescription} from '@/components/ui/alert';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
    AlertTriangle, CheckCircle, Edit3, LogOut, Minus, Package, Plus, Search, ShoppingCart, User, X,
} from 'lucide-react';
import {useEffect, useState} from 'react';

interface Product {
  id: string
  name: string
  quantity: number
  minQuantity: number
}

interface PendingAction {
  product: Product
  type: "buy" | "consume"
  quantity: number
}

export default function InventoryApp() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showQuantityDialog, setShowQuantityDialog] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [quantityDialogType, setQuantityDialogType] = useState<"buy" | "consume">("buy")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [customQuantity, setCustomQuantity] = useState(1)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem("inventory-products")
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts))
      } catch (error) {
        console.error("Error cargando los productos guardados:", error)
        // If there's an error, use default products
      }
    }
  }, [])

  // Save products to localStorage whenever products change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("inventory-products", JSON.stringify(products))
    }
  }, [products])

  const [newProduct, setNewProduct] = useState({ name: "", quantity: 0, minQuantity: 1 })

  const lowStockItems = products.filter((p) => p.quantity <= p.minQuantity)
  const outOfStockItems = products.filter((p) => p.quantity === 0)

  // Filter products based on search query
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const executeAction = (action: PendingAction) => {
    if (action.type === "consume") {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === action.product.id ? { ...p, quantity: Math.max(0, p.quantity - action.quantity) } : p,
        ),
      )
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === action.product.id ? { ...p, quantity: p.quantity + action.quantity } : p)),
      )
    }
  }

  const confirmAction = (product: Product, type: "buy" | "consume", quantity: number) => {
    // Validate consume action
    if (type === "consume" && quantity > product.quantity) {
      alert(`No se puede usar ${quantity} unidades del producto. Solo quedan ${product.quantity} unidades en stock.`)
      return
    }

    setPendingAction({ product, type, quantity })
    setShowConfirmDialog(true)
  }

  const handleConfirmAction = () => {
    if (pendingAction) {
      executeAction(pendingAction)
      setShowConfirmDialog(false)
      setPendingAction(null)
    }
  }

  const openQuantityDialog = (product: Product, type: "buy" | "consume") => {
    setSelectedProduct(product)
    setQuantityDialogType(type)
    setCustomQuantity(type === "buy" ? 1 : 1)
    setShowQuantityDialog(true)
  }

  const handleQuantityAdjustment = () => {
    if (selectedProduct && customQuantity > 0) {
      // Validate consume action
      if (quantityDialogType === "consume" && customQuantity > selectedProduct.quantity) {
        alert(`No se puede usar ${customQuantity} unidades del producto. Solo quedan ${selectedProduct.quantity} unidades en stock.`)
        return
      }

      confirmAction(selectedProduct, quantityDialogType, customQuantity)
      setShowQuantityDialog(false)
      setSelectedProduct(null)
      setCustomQuantity(1)
    }
  }

  const addProduct = () => {
    if (newProduct.name.trim()) {
      const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name.trim(),
        quantity: newProduct.quantity,
        minQuantity: newProduct.minQuantity,
      }
      setProducts((prev) => [...prev, product])
      setNewProduct({ name: "", quantity: 0, minQuantity: 1 })
      setShowAddProduct(false)
    }
  }

  const handleLogin = () => {
    setIsAdmin(true)
    setShowLogin(false)
  }

  const clearAllData = () => {
    if (confirm("¿Estás seguro que quieres eliminar todos los datos del inventario? Esto no se puede deshacer.")) {
      localStorage.removeItem("inventory-products")
      setProducts([])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <Button variant="outline" size="sm" onClick={() => setIsAdmin(false)} className="text-base">
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowLogin(true)} className="text-base">
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

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 py-6 text-lg w-full"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Search Stats */}
        {searchQuery && (
          <div className="text-sm text-gray-500">
            Se encontraron {filteredProducts.length} {filteredProducts.length === 1 ? "producto" : "productos"} que coinciden con &quot;
            {searchQuery}&quot;
          </div>
        )}

        {/* Notifications */}
        {(outOfStockItems.length > 0 || lowStockItems.length > 0) && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                Alertas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {outOfStockItems.map((item) => (
                <Alert key={item.id} className="border-red-200 bg-red-50">
                  <AlertDescription className="text-base text-red-800">
                    <strong>{item.name}</strong> Está fuera de stock!
                  </AlertDescription>
                </Alert>
              ))}
              {lowStockItems
                .filter((item) => item.quantity > 0)
                .map((item) => (
                  <Alert key={item.id} className="border-yellow-200 bg-yellow-50">
                    <AlertDescription className="text-base text-yellow-800">
                      <strong>Quedan pocas unidades de {item.name}</strong>({item.quantity} {item.quantity === 1 ? "unidad restante" : "unidades restantes"})
                    </AlertDescription>
                  </Alert>
                ))}
            </CardContent>
          </Card>
        )}

        {/* Admin Actions */}
        {isAdmin && (
          <div className="space-y-3">
            <Button onClick={() => setShowAddProduct(true)} className="w-full text-lg py-6" size="lg">
              <Plus className="h-6 w-6 mr-2" />
              Añadir nuevo producto
            </Button>
            <Button
              onClick={clearAllData}
              variant="outline"
              className="w-full text-lg py-6 border-red-200 text-red-600 hover:bg-red-50"
              size="lg"
            >
              Eliminar todos los datos
            </Button>
          </div>
        )}

        {/* Products List */}
        <div className="space-y-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Card key={product.id} className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-lg text-gray-600">
                        Cantidad:{" "}
                        <span
                          className={`font-bold ${
                            product.quantity === 0
                              ? "text-red-600"
                              : product.quantity <= product.minQuantity
                                ? "text-orange-600"
                                : "text-green-600"
                          }`}
                        >
                          {product.quantity}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Quick Actions Row */}
                    <div className={isAdmin ? "grid grid-cols-2 gap-3": "flex gap-3"}>
                      {/* Quick Use Button */}
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => confirmAction(product, "consume", 1)}
                        disabled={product.quantity === 0}
                        className="flex-1 text-lg py-6"
                      >
                        <Minus className="h-5 w-5 mr-2" />
                        Usar 1
                      </Button>

                      {/* Quick Buy Button (Admin Only) */}
                      {isAdmin && (
                        <Button
                          size="lg"
                          onClick={() => confirmAction(product, "buy", 1)}
                          className="flex-1 text-lg py-6"
                        >
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          Comprar 1
                        </Button>
                      )}
                    </div>

                    {/* Custom Quantity Row */}
                    <div className={isAdmin ? "grid grid-cols-2 gap-3": "flex gap-3"}>
                      {/* Custom Use Button */}
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => openQuantityDialog(product, "consume")}
                        disabled={product.quantity === 0}
                        className="flex-1 py-4"
                      >
                        <Edit3 className="h-auto mr-2" />
                        Usar otra cant.
                      </Button>

                      {/* Custom Buy Button (Admin Only) */}
                      {isAdmin && (
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => openQuantityDialog(product, "buy")}
                          className="flex-1 py-4"
                        >
                          <Edit3 className="h-auto mr-2" />
                          Comprar otra cant.
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <div className="text-gray-400 mb-2">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-700">No se encontraron productos.</h3>
              <p className="text-gray-500 mt-1">
                {searchQuery
                  ? `No hay productos que coincidan con "${searchQuery}"`
                  : "Tu inventario está vacío. Añade productos para comenzar."}
              </p>
              {searchQuery && (
                <Button variant="outline" className="mt-4 text-base" onClick={() => setSearchQuery("")}>
                  Limpiar búsqueda.
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-blue-600" />
                Confirmar Acción
              </DialogTitle>
            </DialogHeader>
            {pendingAction && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-lg font-medium text-gray-900">{pendingAction.product.name}</p>
                  <p className="text-base text-gray-600">
                    Cantidad actual: <span className="font-bold">{pendingAction.product.quantity}</span>
                  </p>
                  <p className="text-base text-gray-600">
                    Acción:{" "}
                    <span className="font-bold text-blue-600">
                      {pendingAction.type === "buy" ? "Comprar" : "Usar"} {pendingAction.quantity}
                    </span>
                  </p>
                  <p className="text-base text-gray-600">
                    Nueva cantidad restante:{" "}
                    <span className="font-bold text-green-600">
                      {pendingAction.type === "buy"
                        ? pendingAction.product.quantity + pendingAction.quantity
                        : Math.max(0, pendingAction.product.quantity - pendingAction.quantity)}
                    </span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowConfirmDialog(false)} className="flex-1 text-lg py-6">
                    Cancelar
                  </Button>
                  <Button onClick={handleConfirmAction} className="flex-1 text-lg py-6">
                    Confirmar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Custom Quantity Dialog */}
        <Dialog open={showQuantityDialog} onOpenChange={setShowQuantityDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {quantityDialogType === "buy" ? "Buy" : "Use"} {selectedProduct?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="customQuantity" className="text-base">
                  {quantityDialogType === "buy" ? "Cantidad a comprar" : "Cantidad a usar"}
                </Label>
                <Input
                  id="customQuantity"
                  type="number"
                  min="1"
                  max={quantityDialogType === "consume" ? selectedProduct?.quantity : undefined}
                  value={customQuantity}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value) || 1
                    if (quantityDialogType === "consume" && selectedProduct) {
                      setCustomQuantity(Math.min(value, selectedProduct.quantity))
                    } else {
                      setCustomQuantity(value)
                    }
                  }}
                  onFocus={(e) => e.target.select()}
                  className="text-lg py-6 mt-2"
                />
                {quantityDialogType === "consume" && selectedProduct && (
                  <p className="text-sm text-gray-500 mt-1">Disponibles: {selectedProduct.quantity}</p>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowQuantityDialog(false)} className="flex-1 text-lg py-6">
                  Cancelar
                </Button>
                <Button onClick={handleQuantityAdjustment} className="flex-1 text-lg py-6">
                  Continuar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Login Dialog */}
        <Dialog open={showLogin} onOpenChange={setShowLogin}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-xl">Iniciar Sesión como Administrador</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-base">
                  Contraseña
                </Label>
                <Input id="password" type="password" placeholder="Ingresar contraseña" className="text-lg py-6 mt-2" />
              </div>
              <Button onClick={handleLogin} className="w-full text-lg py-6">
                Iniciar Sesión
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Product Dialog */}
        <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-xl">Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="productName" className="text-base">
                  Product Name
                </Label>
                <Input
                  id="productName"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                  className="text-lg py-6 mt-2"
                />
              </div>
              <div>
                <Label htmlFor="quantity" className="text-base">
                  Initial Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) =>
                    setNewProduct((prev) => ({ ...prev, quantity: Number.parseInt(e.target.value) || 0 }))
                  }
                  onFocus={(e) => e.target.select()}
                  className="text-lg py-6 mt-2"
                />
              </div>
              <div>
                <Label htmlFor="minQuantity" className="text-base">
                  Cantidad Mínima (Nivel de Alerta)
                </Label>
                <Input
                  id="minQuantity"
                  type="number"
                  value={newProduct.minQuantity}
                  onChange={(e) =>
                    setNewProduct((prev) => ({ ...prev, minQuantity: Number.parseInt(e.target.value) || 1 }))
                  }
                  onFocus={(e) => e.target.select()}
                  className="text-lg py-6 mt-2"
                />
              </div>
              <Button onClick={addProduct} className="w-full text-lg py-6">
                Add Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
