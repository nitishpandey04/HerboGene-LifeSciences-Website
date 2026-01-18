"use client";
import { useCartStore } from "../store/useCartStore";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";

export default function AddToCartButton({ product, className }) {
    const { addToCart, openCart } = useCartStore();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart(product);
        setIsAdded(true);
        openCart();
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-2 transition-all duration-300 ${className} ${isAdded
                    ? "bg-green-600 text-white"
                    : "bg-primary text-white hover:bg-green-800"
                }`}
        >
            <ShoppingCart size={20} />
            {isAdded ? "Added to Cart" : "Add to Cart"}
        </button>
    );
}
