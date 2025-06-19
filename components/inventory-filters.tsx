"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { InventoryFilter } from "@/types/inventory"

interface InventoryFiltersProps {
  activeFilter: InventoryFilter
  onFilterChange: (filter: InventoryFilter) => void
  counts: {
    all: number
    outOfStock: number
    lowStock: number
    normalStock: number
  }
}

export function InventoryFilters({ activeFilter, onFilterChange, counts }: InventoryFiltersProps) {
  const filters = [
    {
      key: "all" as const,
      label: "Todos",
      count: counts.all,
      variant: "outline" as const,
    },
    {
      key: "out-of-stock" as const,
      label: "Sin Stock",
      count: counts.outOfStock,
      variant: "destructive" as const,
    },
    {
      key: "low-stock" as const,
      label: "Stock Bajo",
      count: counts.lowStock,
      variant: "secondary" as const,
    },
    {
      key: "normal-stock" as const,
      label: "Stock Normal",
      count: counts.normalStock,
      variant: "default" as const,
    },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.key}
          variant={activeFilter === filter.key ? filter.variant : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.key)}
          className="flex items-center gap-2"
        >
          {filter.label}
          <Badge variant="secondary" className="bg-white text-xs px-1.5 py-0.5">
            {filter.count}
          </Badge>
        </Button>
      ))}
    </div>
  )
}
