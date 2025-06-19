import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import type { Product } from "@/types/inventory"

interface AlertsProps {
  lowStockItems: Product[]
  outOfStockItems: Product[]
}

export function Alerts({ lowStockItems, outOfStockItems }: AlertsProps) {
  if (outOfStockItems.length === 0 && lowStockItems.length === 0) {
    return null
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-5 w-5" />
          Alertas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {outOfStockItems.map((item) => (
          <Alert key={item.id} className="border-red-200 bg-red-50">
            <AlertDescription className="text-base text-red-800">
              <strong>{item.name}</strong> está fuera de stock!
            </AlertDescription>
          </Alert>
        ))}
        {lowStockItems
          .filter((item) => item.quantity > 0)
          .map((item) => (
            <Alert key={item.id} className="border-yellow-200 bg-yellow-50">
              <AlertDescription className="text-base text-yellow-800">
                <strong>Quedan pocas unidades de {item.name}</strong> ({item.quantity}{" "}
                {item.quantity === 1 ? "unidad restante" : "unidades restantes"})
              </AlertDescription>
            </Alert>
          ))}
      </CardContent>
    </Card>
  )
}
