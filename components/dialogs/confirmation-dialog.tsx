"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import type { PendingAction } from "@/types/inventory"

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pendingAction: PendingAction | null
  onConfirm: () => void
}

export function ConfirmationDialog({ open, onOpenChange, pendingAction, onConfirm }: ConfirmationDialogProps) {
  if (!pendingAction) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-blue-600" />
            Confirmar {pendingAction.type === "use" ? "Uso" : "Compra"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-gray-900">Resumen:</h3>
            {pendingAction.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.productName}</span>
                <span className="font-medium">{item.quantity}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total de productos:</span>
                <span>{pendingAction.total}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 text-lg py-6">
              Cancelar
            </Button>
            <Button onClick={onConfirm} className="flex-1 text-lg py-6">
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
