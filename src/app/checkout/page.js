"use client";
import { useCartStore } from "../../store/useCartStore";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Lock } from "lucide-react";

export default function Checkout() {
    const { cart, cartTotal, clearCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setIsSuccess(true);
            clearCart();
        }, 1500);
    };

    if (!mounted) return null;

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-600 w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-primary mb-4">Order Placed!</h1>
                    <p className="text-text-muted mb-8">
                        Thank you for your order. We have received your details and will process your shipment shortly.
                    </p>
                    <Link href="/" className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-green-800 transition-colors">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-text-main mb-4">Your cart is empty</h1>
                <Link href="/products" className="text-primary hover:underline flex items-center gap-2">
                    <ArrowLeft size={20} />
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-serif font-bold text-primary mb-8 px-4">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                    {/* Order Summary */}
                    <div className="order-2 lg:order-1 lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <h2 className="text-xl font-bold text-text-main mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="relative h-16 w-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                            <Image src={item.image_path} alt={item.name} fill className="object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-sm text-text-main line-clamp-1">{item.name}</h3>
                                            <p className="text-text-muted text-xs">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-text-main">₹{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-2">
                                <div className="flex justify-between text-text-muted">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal()}</span>
                                </div>
                                <div className="flex justify-between text-text-muted">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-primary pt-2 border-t border-gray-100 mt-2">
                                    <span>Total</span>
                                    <span>₹{cartTotal()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Form */}
                    <div className="order-1 lg:order-2 lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <h2 className="text-xl font-bold text-text-main mb-6">Shipping Details</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-main mb-1">First Name</label>
                                        <input required type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-main mb-1">Last Name</label>
                                        <input required type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-main mb-1">Email Address</label>
                                    <input required type="email" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-main mb-1">Address</label>
                                    <input required type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Street Address" />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-main mb-1">City</label>
                                        <input required type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-main mb-1">Pincode</label>
                                        <input required type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3 text-text-muted text-sm border border-gray-200">
                                    <Lock size={16} />
                                    <span>Payment will be collected securely on delivery (COD) or via payment link.</span>
                                </div>

                                <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-green-800 transition-colors shadow-lg hover:shadow-xl transform active:scale-99 duration-200">
                                    Confirm Order
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
