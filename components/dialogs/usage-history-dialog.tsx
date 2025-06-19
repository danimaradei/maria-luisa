"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Package } from "lucide-react"
import type { DailyUsageGroup } from "@/types/inventory"

interface UsageHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usageGroup: DailyUsageGroup | null
}

export function UsageHistoryDialog({ open, onOpenChange, usageGroup }: UsageHistoryDialogProps) {
  if (!usageGroup) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateString === today.toISOString().split("T")[0]) {
      return "Hoy"
    } else if (dateString === yesterday.toISOString().split("T")[0]) {
      return "Ayer"
    } else {
      return date.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Productos Usados
          </DialogTitle>
          <p className="text-sm text-gray-600">{formatDate(usageGroup.date)}</p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-800">Total de productos diferentes:</span>
              <Badge variant="default" className="bg-blue-600">
                {usageGroup.totalProducts}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-blue-800">Total de unidades usadas:</span>
              <Badge variant="default" className="bg-blue-600">
                {usageGroup.totalQuantity}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Detalle por producto:
            </h4>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {usageGroup.items
                .sort((a, b) => b.quantity - a.quantity)
                .map((item, index) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded"
                  >
                    <span className="text-sm font-medium text-gray-900 flex-1 truncate">{item.productName}</span>
                    <Badge variant="outline" className="ml-2">
                      {item.quantity} {item.quantity === 1 ? "unidad" : "unidades"}
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
