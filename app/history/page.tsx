"use client"
import { useAuth } from "@/hooks/use-auth"
import { useInventory } from "@/hooks/use-inventory"
import { UsageHistoryDialog } from "@/components/dialogs/usage-history-dialog"
import { HistoryPageTemplate } from "@/components/generic-historic-pages"
import type { DailyUsageGroup } from "@/types/inventory"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"

export default function UsageHistoryPage() {
  const { usageHistory } = useInventory()
  const { isAdmin, login, logout } = useAuth()

  return (
    <HistoryPageTemplate<DailyUsageGroup>
      title="Historial de Consumos"
      data={usageHistory}
      getDate={(g) => g.date}
      getSearchStrings={(g) => g.items.map((i) => i.productName)}
      isAdmin={isAdmin}
      onLogin={login}
      onLogout={logout}
      renderBadges={(g) => (
        <div className="text-right">
          <div className="flex items-center gap-1 mb-1">
            <Package className="h-3 w-3 text-gray-400" />
            <Badge variant="outline" className="text-xs">
              {g.totalProducts}
            </Badge>
          </div>
          <Badge variant="secondary" className="text-xs">
            {g.totalQuantity} unidades
          </Badge>
        </div>
      )}
      renderDialog={(selected, open, setOpen) => (
        <UsageHistoryDialog open={open} onOpenChange={setOpen} usageGroup={selected} />
      )}
    />
  )
}
