"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { NewProduct } from "@/types/inventory"

interface AddProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newProduct: NewProduct
  onProductChange: (product: NewProduct) => void
  onAddProduct: () => void
}

export function AddProductDialog({
  open,
  onOpenChange,
  newProduct,
  onProductChange,
  onAddProduct,
}: AddProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl">Crear Nuevo Producto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="productName" className="text-base">
              Nombre del Producto
            </Label>
            <Input
              id="productName"
              value={newProduct.name}
              onChange={(e) => onProductChange({ ...newProduct, name: e.target.value })}
              placeholder="Nombre del producto"
              className="text-lg py-6 mt-2"
            />
          </div>
          <div>
            <Label htmlFor="initialQuantity" className="text-base">
              Inventario Inicial Comprado
            </Label>
            <Input
              id="initialQuantity"
              type="number"
              min="0"
              value={newProduct.initialQuantity}
              onChange={(e) =>
                onProductChange({ ...newProduct, initialQuantity: Number.parseInt(e.target.value) || 0 })
              }
              onFocus={(e) => e.target.select()}
              className="text-lg py-6 mt-2"
            />
          </div>
          <div>
            <Label htmlFor="minQuantity" className="text-base">
              Cantidad Mínima (Alerta)
            </Label>
            <Input
              id="minQuantity"
              type="number"
              min="1"
              value={newProduct.minQuantity}
              onChange={(e) => onProductChange({ ...newProduct, minQuantity: Number.parseInt(e.target.value) || 1 })}
              onFocus={(e) => e.target.select()}
              className="text-lg py-6 mt-2"
            />
          </div>
          <Button onClick={onAddProduct} className="w-full text-lg py-6">
            Crear Producto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
