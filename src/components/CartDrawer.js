"use client";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "../store/useCartStore";
import { useEffect, useState } from "react";

export default function CartDrawer() {
    const { cart, isOpen, closeCart, removeFromCart, updateQuantity, cartTotal } = useCartStore();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 transition-opacity"
                    onClick={closeCart}
                />
            )}

            {/* Drawer */}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background z-[60] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">

                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                        <h2 className="text-xl font-bold font-serif text-primary flex items-center gap-2">
                            <ShoppingBag size={20} />
                            Your Cart
                        </h2>
                        <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X size={24} className="text-text-muted" />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <div className="bg-gray-100 p-6 rounded-full">
                                    <ShoppingBag size={48} className="text-gray-300" />
                                </div>
                                <p className="text-lg font-medium text-text-main">Your cart is empty</p>
                                <p className="text-text-muted text-sm">Looks like you haven&apos;t added anything yet.</p>
                                <button onClick={closeCart} className="text-primary font-bold hover:underline">
                                    Continue Shopping
                                </button>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative h-20 w-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                        <Image
                                            src={item.image_path}
                                            alt={item.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-text-main line-clamp-1">{item.name}</h3>
                                            <p className="text-text-muted text-sm">₹{item.price}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {cart.length > 0 && (
                        <div className="p-6 border-t border-gray-100 bg-white space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-text-muted">Subtotal</span>
                                <span className="text-xl font-bold text-primary">₹{cartTotal()}</span>
                            </div>
                            <p className="text-xs text-text-muted text-center">Shipping and taxes calculated at checkout.</p>
                            <Link href="/checkout" onClick={closeCart}>
                                <button className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-green-800 transition-colors shadow-lg hover:shadow-xl transform active:scale-95 duration-200">
                                    Proceed to Checkout
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
