"use client"

import { useState, useEffect } from "react"
import type { Product, DailyUsage, DailyPurchase, DailyUsageGroup } from "@/types/inventory"

type NewProduct = {
  name: string
  initialQuantity: number
  minQuantity: number
}

export function useInventory() {
  const [products, setProducts] = useState<Product[]>([])
  const [allDailyUsage, setAllDailyUsage] = useState<DailyUsage[]>([])
  const [dailyPurchases, setDailyPurchases] = useState<DailyPurchase[]>([])

  const today = new Date().toISOString().split("T")[0]

  // Cargar datos del localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem("inventory-products")
    const savedUsage = localStorage.getItem("daily-usage")
    const savedPurchases = localStorage.getItem("daily-purchases")

    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts))
      } catch (error) {
        console.error("Error cargando productos:", error)
      }
    }

    if (savedUsage) {
      try {
        const usage = JSON.parse(savedUsage)
        setAllDailyUsage(usage)
      } catch (error) {
        console.error("Error cargando uso diario:", error)
      }
    }

    if (savedPurchases) {
      try {
        const purchases = JSON.parse(savedPurchases)
        setDailyPurchases(purchases.filter((item: DailyPurchase) => item.date === today))
      } catch (error) {
        console.error("Error cargando compras diarias:", error)
      }
    }
  }, [today])

  // Guardar datos en localStorage
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("inventory-products", JSON.stringify(products))
    }
  }, [products])

  useEffect(() => {
    localStorage.setItem("daily-usage", JSON.stringify(allDailyUsage))
  }, [allDailyUsage])

  useEffect(() => {
    localStorage.setItem("daily-purchases", JSON.stringify(dailyPurchases))
  }, [dailyPurchases])

  // Obtener uso diario solo de hoy
  const dailyUsage = allDailyUsage.filter((item) => item.date === today)

  // Agrupar uso por fecha
  const usageHistory: DailyUsageGroup[] = allDailyUsage
    .reduce((groups: DailyUsageGroup[], item) => {
      const existingGroup = groups.find((g) => g.date === item.date)
      if (existingGroup) {
        existingGroup.items.push(item)
        existingGroup.totalQuantity += item.quantity
      } else {
        groups.push({
          date: item.date,
          items: [item],
          totalProducts: 1,
          totalQuantity: item.quantity,
        })
      }
      return groups
    }, [])
    .map((group) => ({
      ...group,
      totalProducts: group.items.length,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const addProduct = (newProduct: NewProduct) => {
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name.trim(),
      quantity: newProduct.initialQuantity,
      minQuantity: newProduct.minQuantity,
    }
    setProducts((prev) => [...prev, product])

    // Agregar a compras de hoy
    const purchase: DailyPurchase = {
      productId: product.id,
      productName: product.name,
      quantity: newProduct.initialQuantity,
      date: today,
    }
    setDailyPurchases((prev) => [...prev, purchase])
  }

  const confirmUsage = (usageItems: Array<{ productId: string; productName: string; quantity: number }>) => {
    // Actualizar inventario
    setProducts((prev) =>
      prev.map((product) => {
        const usage = usageItems.find((item) => item.productId === product.id)
        if (usage) {
          return { ...product, quantity: Math.max(0, product.quantity - usage.quantity) }
        }
        return product
      }),
    )

    // Actualizar uso diario completo
    setAllDailyUsage((prev) => {
      const updated = [...prev]
      usageItems.forEach((item) => {
        const existingIndex = updated.findIndex((u) => u.productId === item.productId && u.date === today)
        if (existingIndex >= 0) {
          updated[existingIndex].quantity += item.quantity
        } else {
          updated.push({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            date: today,
          })
        }
      })
      return updated
    })
  }

  const confirmPurchases = (purchaseItems: Array<{ productId: string; productName: string; quantity: number }>) => {
    // Actualizar inventario
    setProducts((prev) =>
      prev.map((product) => {
        const purchase = purchaseItems.find((item) => item.productId === product.id)
        if (purchase) {
          return { ...product, quantity: product.quantity + purchase.quantity }
        }
        return product
      }),
    )

    // Actualizar compras diarias
    setDailyPurchases((prev) => {
      const updated = [...prev]
      purchaseItems.forEach((item) => {
        const existingIndex = updated.findIndex((p) => p.productId === item.productId)
        if (existingIndex >= 0) {
          updated[existingIndex].quantity += item.quantity
        } else {
          updated.push({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            date: today,
          })
        }
      })
      return updated
    })
  }

  const lowStockItems = products.filter((p) => p.quantity <= p.minQuantity && p.quantity > 0)
  const outOfStockItems = products.filter((p) => p.quantity === 0)

  return {
    products,
    dailyUsage,
    dailyPurchases,
    lowStockItems,
    outOfStockItems,
    usageHistory,
    addProduct,
    confirmUsage,
    confirmPurchases,
  }
}
