"use client";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "../store/useCartStore";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function ProductCard({ product }) {
    const { addToCart } = useCartStore();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent navigation if clicked on card link
        e.stopPropagation();
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000); // Reset after 2s
    };

    return (
        <Link href={`/products/${product.id}`} className="group block h-full">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full relative">
                <div className="relative h-64 w-full bg-gray-50 p-6 overflow-hidden">
                    <Image
                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                        src={product.image_path}
                        fill
                        alt={product.name}
                    />
                    <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        {product.category || "PREMIUM"}
                    </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-text-main font-serif group-hover:text-primary transition-colors">
                            {product.name}
                        </h3>
                        <span className="font-bold text-primary">₹{product.price}</span>
                    </div>
                    <p className="text-text-muted text-sm flex-grow line-clamp-3">
                        {product.description}
                    </p>

                    <button
                        onClick={handleAddToCart}
                        className={`mt-4 w-full py-3 rounded-lg font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${isAdded
                                ? "bg-green-600 text-white"
                                : "bg-white border border-primary text-primary hover:bg-primary hover:text-white"
                            }`}
                    >
                        <ShoppingCart size={16} />
                        {isAdded ? "Added to Cart" : "Add to Cart"}
                    </button>
                </div>
            </div>
        </Link>
    );
}
