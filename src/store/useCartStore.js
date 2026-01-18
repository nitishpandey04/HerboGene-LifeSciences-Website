import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
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
                    set({
                        cart: cart.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        ),
                        isOpen: true,
                    });
                } else {
                    set({
                        cart: [...cart, { ...product, quantity }],
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
                set({
                    cart: get().cart.map((item) =>
                        item.id === productId ? { ...item, quantity } : item
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
        }),
        {
            name: 'cart-storage', // name of the item in the storage (must be unique)
        }
    )
);
