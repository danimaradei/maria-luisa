"use client"

import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10 py-6 text-lg w-full"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
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
          Se encontraron {0} productos que coinciden con &quot;{searchQuery}&quot;
        </div>
      )}
    </>
  )
}
