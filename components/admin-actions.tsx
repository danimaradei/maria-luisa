"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface AdminActionsProps {
  onAddProduct: () => void
  onClearData: () => void
}

export function AdminActions({ onAddProduct, onClearData }: AdminActionsProps) {
  return (
    <div className="space-y-3">
      <Button onClick={onAddProduct} className="w-full text-lg py-6" size="lg">
        <Plus className="h-6 w-6 mr-2" />
        Añadir nuevo producto
      </Button>
      <Button
        onClick={onClearData}
        variant="outline"
        className="w-full text-lg py-6 border-red-200 text-red-600 hover:bg-red-50"
        size="lg"
      >
        Eliminar todos los datos
      </Button>
    </div>
  )
}
