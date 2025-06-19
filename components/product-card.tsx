"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Minus, ShoppingCart, Edit3 } from "lucide-react"
import type { Product } from "@/types/inventory"

interface ProductCardProps {
  product: Product
  isAdmin: boolean
  onQuickUse: () => void
  onQuickBuy: () => void
  onCustomUse: () => void
  onCustomBuy: () => void
}

export function ProductCard({ product, isAdmin, onQuickUse, onQuickBuy, onCustomUse, onCustomBuy }: ProductCardProps) {
  return (
    <Card className="shadow-sm">
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
          <div className={isAdmin ? "grid grid-cols-2 gap-3" : "flex gap-3"}>
            {/* Quick Use Button */}
            <Button
              variant="outline"
              size="lg"
              onClick={onQuickUse}
              disabled={product.quantity === 0}
              className="flex-1 text-lg py-6"
            >
              <Minus className="h-5 w-5 mr-2" />
              Usar 1
            </Button>

            {/* Quick Buy Button (Admin Only) */}
            {isAdmin && (
              <Button size="lg" onClick={onQuickBuy} className="flex-1 text-lg py-6">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Comprar 1
              </Button>
            )}
          </div>

          {/* Custom Quantity Row */}
          <div className={isAdmin ? "grid grid-cols-2 gap-3" : "flex gap-3"}>
            {/* Custom Use Button */}
            <Button
              variant="outline"
              size="lg"
              onClick={onCustomUse}
              disabled={product.quantity === 0}
              className="flex-1 py-4"
            >
              <Edit3 className="h-auto mr-2" />
              Usar otra cant.
            </Button>

            {/* Custom Buy Button (Admin Only) */}
            {isAdmin && (
              <Button variant="outline" size="lg" onClick={onCustomBuy} className="flex-1 py-4">
                <Edit3 className="h-auto mr-2" />
                Comprar otra cant.
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
