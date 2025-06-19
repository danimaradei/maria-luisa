"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Product } from "@/types/inventory"

interface QuantityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  type: "buy" | "consume"
  quantity: number
  onQuantityChange: (quantity: number) => void
  onConfirm: () => void
}

export function QuantityDialog({
  open,
  onOpenChange,
  product,
  type,
  quantity,
  onQuantityChange,
  onConfirm,
}: QuantityDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {type === "buy" ? "Comprar" : "Usar"} {product?.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="customQuantity" className="text-base">
              {type === "buy" ? "Cantidad a comprar" : "Cantidad a usar"}
            </Label>
            <Input
              id="customQuantity"
              type="number"
              min="1"
              max={type === "consume" ? product?.quantity : undefined}
              value={quantity}
              onChange={(e) => {
                const value = Number.parseInt(e.target.value) || 1
                if (type === "consume" && product) {
                  onQuantityChange(Math.min(value, product.quantity))
                } else {
                  onQuantityChange(value)
                }
              }}
              onFocus={(e) => e.target.select()}
              className="text-lg py-6 mt-2"
            />
            {type === "consume" && product && (
              <p className="text-sm text-gray-500 mt-1">Disponibles: {product.quantity}</p>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 text-lg py-6">
              Cancelar
            </Button>
            <Button onClick={onConfirm} className="flex-1 text-lg py-6">
              Continuar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
