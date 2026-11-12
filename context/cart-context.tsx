'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem, Product } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    selectedFrameSize: string,
    selectedBattery: { label: string; capacityWh: number; priceDelta: number },
    selectedColor: { name: string; hex: string },
    quantity?: number
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean; // always false: the cart is the full checkout page, there is no slide-out drawer
  lastAdded: { name: string; key: number } | null;
  dismissToast: () => void;
  setIsCartDrawerOpen: (open: boolean) => void;
  isCryptoDiscountApplied: boolean;
  setIsCryptoDiscountApplied: (applied: boolean) => void;
  promoCode: string;
  setPromoCode: (code: string) => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  // Calculations
  totalItemsCount: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  vatAmount: number; // 19% German MwSt included
  finalTotal: number;
  isMinOrderMet: boolean;
  minOrderThreshold: number;
  minOrderRemaining: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  isFreeShipping: boolean;
}

const MIN_ORDER_THRESHOLD = 500; // 500 Euro
const FREE_SHIPPING_THRESHOLD = 1000; // 1,000 Euro
const STANDARD_SHIPPING_FEE = 49; // Insured heavy freight

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('efs_cart_items');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCryptoDiscountApplied, setIsCryptoDiscountApplied] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('efs_crypto_applied') === 'true';
    } catch {
      return false;
    }
  });

  // WebForge cart pattern: no drawer. Opening the cart goes to the full checkout page; "Add to cart" only shows a toast.
  const router = useRouter();
  const isCartDrawerOpen = false;
  const setIsCartDrawerOpen = (open: boolean) => {
    if (open) router.push('/checkout');
  };
  const [lastAdded, setLastAdded] = useState<{ name: string; key: number } | null>(null);
  const dismissToast = () => setLastAdded(null);
  const [promoCode, setPromoCode] = useState('');

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('efs_cart_items', JSON.stringify(items));
      localStorage.setItem('efs_crypto_applied', isCryptoDiscountApplied ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, [items, isCryptoDiscountApplied]);

  const addToCart = (
    product: Product,
    selectedFrameSize: string,
    selectedBattery: { label: string; capacityWh: number; priceDelta: number },
    selectedColor: { name: string; hex: string },
    quantity = 1
  ) => {
    const unitPrice = product.price + (selectedBattery.priceDelta || 0);
    const cartItemId = `${product.id}-${selectedFrameSize}-${selectedBattery.capacityWh}-${selectedColor.name}`;

    setItems((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          product,
          selectedFrameSize,
          selectedBattery,
          selectedColor,
          quantity,
          unitPrice
        }
      ];
    });

    setLastAdded({ name: product.name, key: Date.now() });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyPromoCode = (code: string) => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned === 'CRYPTO10' || cleaned === 'KRYPTO10' || cleaned === 'EBIKE10') {
      setIsCryptoDiscountApplied(true);
      setPromoCode(cleaned);
      return { success: true, message: '10% Krypto-Rabatt erfolgreich aktiviert!' };
    }
    return { success: false, message: 'Ungültiger Gutscheincode. Nutzen Sie CRYPTO10 für 10% Rabatt.' };
  };

  // Totals calculations
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const isMinOrderMet = subtotal >= MIN_ORDER_THRESHOLD;
  const minOrderRemaining = Math.max(0, MIN_ORDER_THRESHOLD - subtotal);

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingFee = items.length === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;

  // 10% crypto discount on subtotal
  const discountAmount = isCryptoDiscountApplied ? subtotal * 0.10 : 0;
  const discountedSubtotal = subtotal - discountAmount;

  const finalTotal = discountedSubtotal + shippingFee;
  // German standard actual tax: 19% VAT included in gross total
  // Net = Gross / 1.19, MwSt = Gross - Net
  const vatAmount = finalTotal > 0 ? finalTotal - finalTotal / 1.19 : 0;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        lastAdded,
        dismissToast,
        isCryptoDiscountApplied,
        setIsCryptoDiscountApplied,
        promoCode,
        setPromoCode,
        applyPromoCode,
        totalItemsCount,
        subtotal,
        discountAmount,
        shippingFee,
        vatAmount,
        finalTotal,
        isMinOrderMet,
        minOrderThreshold: MIN_ORDER_THRESHOLD,
        minOrderRemaining,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingRemaining,
        isFreeShipping
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
