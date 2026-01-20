import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      isOpen: false,

      // Actions
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addToCart: (product, quantity = 1) => {
        const { cart } = get();
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
          // Check stock limit if available
          const maxQty = product.stock_quantity || 99;
          const newQuantity = Math.min(existingItem.quantity + quantity, maxQty);

          set({
            cart: cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: newQuantity }
                : item
            ),
            isOpen: true,
          });
        } else {
          set({
            cart: [...cart, {
              id: product.id,
              name: product.name,
              price: product.price,
              image_path: product.image_path,
              category: product.category,
              stock_quantity: product.stock_quantity,
              quantity
            }],
            isOpen: true,
          });
        }
      },

      removeFromCart: (productId) => {
        set({
          cart: get().cart.filter((item) => item.id !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;

        const { cart } = get();
        const item = cart.find((i) => i.id === productId);

        // Check stock limit if available
        const maxQty = item?.stock_quantity || 99;
        const newQuantity = Math.min(quantity, maxQty);

        set({
          cart: cart.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      // Selectors (derived state)
      cartTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      cartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Validate cart items against current stock/prices
      validateCart: async () => {
        const { cart } = get();
        if (cart.length === 0) return { valid: true, items: [], errors: [] };

        try {
          const response = await fetch('/api/cart/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
              }))
            })
          });

          const data = await response.json();

          if (data.success) {
            // Update cart with validated data
            set({
              cart: data.items.map(item => ({
                ...cart.find(c => c.id === item.id),
                price: item.price,
                stock_quantity: item.stock_quantity
              }))
            });
          }

          return data;
        } catch (error) {
          console.error('Cart validation failed:', error);
          return { valid: true, items: cart, errors: [] };
        }
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;

// Named export for backward compatibility
export { useCartStore };
