"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface EmptyStateProps {
  searchQuery: string
  onClearSearch: () => void
  filteredCount: number
}

export function EmptyState({ searchQuery, onClearSearch, filteredCount }: EmptyStateProps) {
  return (
    <div className="text-center py-10">
      <div className="text-gray-400 mb-2">
        <Search className="h-12 w-12 mx-auto" />
      </div>
      <h3 className="text-xl font-medium text-gray-700">No se encontraron productos</h3>
      <p className="text-gray-500 mt-1">
        {searchQuery
          ? `No hay productos que coincidan con "${searchQuery}"`
          : "Tu inventario está vacío. Añade productos para comenzar."}
      </p>
      {searchQuery && (
        <Button variant="outline" className="mt-4 text-base" onClick={onClearSearch}>
          Limpiar búsqueda
        </Button>
      )}
    </div>
  )
}
