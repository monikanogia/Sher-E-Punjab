import { createContext, useContext, useState, useCallback } from "react";

export type DishVariant = "DEFAULT" | "HALF" | "FULL";



<<<<<<< HEAD
=======
export interface CartItem {
  dishId: number;
  name: string;
  price: number;
  quantity: number;
  variant: DishVariant;

}

interface CartContextType {
  items: CartItem[];
  addItem: (dish: {
    id: number; name: string; price: number; variant?: DishVariant;
  }) => void;
  removeItem: (dishId: number, variant: DishVariant) => void;
  updateQuantity: (dishId: number, variant: DishVariant, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((dish: { id: number; name: string; price: number; variant?: DishVariant; }) => {
    const variant: DishVariant = dish.variant ?? "DEFAULT";
    setItems((prev) => {
      const existing = prev.find((i) => i.dishId === dish.id && i.variant === variant);
      if (existing) {
        return prev.map((i) => i.dishId === dish.id && i.variant === variant ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { dishId: dish.id, name: dish.name, price: dish.price, quantity: 1, variant, },
      ];
    });
  }, []);

  const removeItem = useCallback((dishId: number, variant: DishVariant) => {
    setItems((prev) =>
      prev.filter((i) => !(i.dishId === dishId && i.variant === variant))
    );
  }, []);

  const updateQuantity = useCallback(
    (dishId: number, variant: DishVariant, qty: number) => {
      if (qty <= 0) {
        setItems((prev) =>
          prev.filter((i) => !(i.dishId === dishId && i.variant === variant))
        );
      } else {
        setItems((prev) =>
          prev.map((i) =>
            i.dishId === dishId && i.variant === variant
              ? { ...i, quantity: qty }
              : i
          )
        );
      }
    },
    []
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}







/*import { createContext, useContext, useState, useCallback } from "react";

>>>>>>> ffdd1f9be5322a267d773c13075d8820e2070ebe
export interface CartItem {
  dishId: number;
  name: string;
  price: number;
  quantity: number;
  variant: DishVariant;

}

interface CartContextType {
  items: CartItem[];
  addItem: (dish: {
    id: number; name: string; price: number; variant?: DishVariant;
  }) => void;
  removeItem: (dishId: number, variant: DishVariant) => void;
  updateQuantity: (dishId: number, variant: DishVariant, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((dish: { id: number; name: string; price: number; variant?: DishVariant; }) => {
    const variant: DishVariant = dish.variant ?? "DEFAULT";
    setItems((prev) => {
      const existing = prev.find((i) => i.dishId === dish.id && i.variant === variant);
      if (existing) {
        return prev.map((i) => i.dishId === dish.id && i.variant === variant ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { dishId: dish.id, name: dish.name, price: dish.price, quantity: 1, variant, },
      ];
    });
  }, []);

  const removeItem = useCallback((dishId: number, variant: DishVariant) => {
    setItems((prev) =>
      prev.filter((i) => !(i.dishId === dishId && i.variant === variant))
    );
  }, []);

  const updateQuantity = useCallback(
    (dishId: number, variant: DishVariant, qty: number) => {
      if (qty <= 0) {
        setItems((prev) =>
          prev.filter((i) => !(i.dishId === dishId && i.variant === variant))
        );
      } else {
        setItems((prev) =>
          prev.map((i) =>
            i.dishId === dishId && i.variant === variant
              ? { ...i, quantity: qty }
              : i
          )
        );
      }
    },
    []
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}*/
