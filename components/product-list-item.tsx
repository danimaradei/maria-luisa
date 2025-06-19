"use client"

import type React from "react"
import type { Product } from "@/types/inventory"

interface ProductListItemProps {
  product: Product
  rightContent?: React.ReactNode
  showStock?: boolean
  className?: string
}

export function ProductListItem({ product, rightContent, showStock = true, className = "" }: ProductListItemProps) {
  const isOutOfStock = product.quantity === 0
  const isLowStock = product.quantity <= product.minQuantity && product.quantity > 0

  const getStockText = () => {
    if (isOutOfStock) return "Sin stock"
    if (product.quantity === 1) return "Queda 1 unidad"
    return `Quedan ${product.quantity} unidades`
  }

  const getStockColor = () => {
    if (isOutOfStock) return "text-red-600"
    if (isLowStock) return "text-orange-600"
    return "text-green-600"
  }

  return (
    <div
      className={`flex items-center justify-between py-3 px-4 border-b border-gray-100 last:border-b-0 ${isOutOfStock ? "opacity-50 bg-gray-50" : "bg-white"} ${className}`}
    >
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium text-base truncate ${isOutOfStock ? "text-gray-500" : "text-gray-900"}`}>
          {product.name}
        </h3>
        {showStock && <p className={`text-sm ${getStockColor()}`}>{getStockText()}</p>}
      </div>
      {rightContent && <div className="flex-shrink-0 ml-4">{rightContent}</div>}
    </div>
  )
}
