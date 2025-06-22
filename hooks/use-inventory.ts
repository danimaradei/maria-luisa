"use client"

import { useEffect, useState } from "react"
import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Product, DailyUsage, DailyPurchase, DailyUsageGroup } from "@/types/inventory"

type NewProduct = {
  name: string
  initialQuantity: number
  minQuantity: number
}

export function useInventory() {
  const [products, setProducts] = useState<Product[]>([])
  const [usageHistory, setUsageHistory] = useState<DailyUsageGroup[]>([])
  const [dailyPurchases, setDailyPurchases] = useState<DailyPurchase[]>([])

  const today = new Date().toISOString().split("T")[0]

  // Cargar productos desde Firestore en tiempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const items: Product[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product))
      setProducts(items)
    })
    return () => unsubscribe()
  }, [])

  // Cargar historial de uso agrupado por fecha
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "usage"), (snapshot) => {
      const allUsage: DailyUsage[] = snapshot.docs.map((doc) => doc.data() as DailyUsage)

      const grouped = allUsage.reduce((groups: DailyUsageGroup[], item) => {
        const existing = groups.find((g) => g.date === item.date)
        if (existing) {
          existing.items.push(item)
          existing.totalQuantity += item.quantity
        } else {
          groups.push({
            date: item.date,
            items: [item],
            totalProducts: 1,
            totalQuantity: item.quantity,
          })
        }
        return groups
      }, []).map(group => ({
        ...group,
        totalProducts: group.items.length,
      })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      setUsageHistory(grouped)
    })
    return () => unsubscribe()
  }, [])

  // Cargar compras del día actual
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "purchases"), where("date", "==", today)),
      (snapshot) => {
        const items: DailyPurchase[] = snapshot.docs.map((doc) => doc.data() as DailyPurchase)
        setDailyPurchases(items)
      }
    )
    return () => unsubscribe()
  }, [today])

  const addProduct = async (newProduct: NewProduct): Promise<Product> => {
    const productRef = doc(collection(db, "inventory"))
    const newDoc: Product = {
      id: productRef.id,
      name: newProduct.name.trim(),
      quantity: 0,
      minQuantity: newProduct.minQuantity,
    }

    await setDoc(productRef, newDoc)

    // Registrar compra inicial
    await addDoc(collection(db, "purchases"), {
      productId: productRef.id,
      productName: newDoc.name,
      quantity: newProduct.initialQuantity,
      date: today,
      timestamp: serverTimestamp(),
    })

    // Actualizar inventario
    await updateDoc(productRef, {
      quantity: newProduct.initialQuantity,
    })

    return newDoc
  }

  const confirmUsage = async (usageItems: Array<{ productId: string; productName: string; quantity: number }>) => {
    for (const item of usageItems) {
      const productRef = doc(db, "inventory", item.productId)

      // Obtener producto actual
      const snapshot = await getDoc(productRef)
      if (!snapshot.exists()) continue

      const current = snapshot.data() as Product
      const newQuantity = Math.max(0, current.quantity - item.quantity)

      // Actualizar inventario
      await updateDoc(productRef, { quantity: newQuantity })

      // Agregar a colección de uso
      await addDoc(collection(db, "usage"), {
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        date: today,
        timestamp: serverTimestamp(),
      })
    }
  }

  const confirmPurchases = async (purchaseItems: Array<{ productId: string; productName: string; quantity: number }>) => {
    for (const item of purchaseItems) {
      const productRef = doc(db, "inventory", item.productId)

      const snapshot = await getDoc(productRef)
      if (!snapshot.exists()) continue

      const current = snapshot.data() as Product
      const newQuantity = current.quantity + item.quantity

      await updateDoc(productRef, { quantity: newQuantity })

      await addDoc(collection(db, "purchases"), {
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        date: today,
        timestamp: serverTimestamp(),
      })
    }
  }

  const dailyUsage = usageHistory.find((g) => g.date === today)?.items || []
  const lowStockItems = products.filter((p) => p.quantity <= p.minQuantity && p.quantity > 0)
  const outOfStockItems = products.filter((p) => p.quantity === 0)

  return {
    products,
    dailyUsage,
    dailyPurchases,
    usageHistory,
    lowStockItems,
    outOfStockItems,
    addProduct,
    confirmUsage,
    confirmPurchases,
  }
}
