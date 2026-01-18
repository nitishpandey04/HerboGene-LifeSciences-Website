"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Phone, Mail } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="fixed top-0 w-full z-50 glass text-primary shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="relative h-16 w-80">
                                <Image src="/herbogene_logo.png" alt="HerboGene Logo" fill className="object-contain" />
                            </div>

                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink href="/">Home</NavLink>
                        <NavLink href="/about">About Us</NavLink>
                        <NavLink href="/products">Products</NavLink>
                        <NavLink href="/contact">Contact</NavLink>

                        <CartButton />

                        <Link href="/contact" className="bg-primary text-white px-5 py-2 rounded-full hover:bg-green-800 transition-colors shadow-lg hover:shadow-xl font-medium flex items-center gap-2">
                            <Phone size={16} />
                            <span>Get in Touch</span>
                        </Link>
                    </div>

                    <div className="md:hidden flex items-center gap-4">
                        <CartButton />
                        <button onClick={toggleMenu} className="text-primary hover:text-green-800 focus:outline-none">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass border-t border-gray-100 absolute w-full">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <MobileNavLink href="/" onClick={toggleMenu}>Home</MobileNavLink>
                        <MobileNavLink href="/about" onClick={toggleMenu}>About Us</MobileNavLink>
                        <MobileNavLink href="/products" onClick={toggleMenu}>Products</MobileNavLink>
                        <MobileNavLink href="/contact" onClick={toggleMenu}>Contact</MobileNavLink>
                    </div>
                </div>
            )}
        </nav>
    );
}

function NavLink({ href, children }) {
    return (
        <Link
            href={href}
            className="text-text-main hover:text-primary font-medium transition-colors relative group"
        >
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full"></span>
        </Link>
    );
}

import { useCartStore } from "../store/useCartStore";
import { ShoppingBag } from "lucide-react";

function CartButton() {
    const { openCart, cartCount } = useCartStore();
    const [mounted, setMounted] = useState(false);

    // Hydration fix
    useState(() => {
        setMounted(true);
    }, []);

    if (!mounted) return (
        <button className="relative p-2 text-primary hover:bg-green-50 rounded-full transition-colors">
            <ShoppingBag size={24} />
        </button>
    );

    return (
        <button
            onClick={openCart}
            className="relative p-2 text-primary hover:bg-green-50 rounded-full transition-colors group"
        >
            <ShoppingBag size={24} className="group-hover:scale-110 transition-transform" />
            {cartCount() > 0 && (
                <span className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full animate-in zoom-in">
                    {cartCount()}
                </span>
            )}
        </button>
    );
}

function MobileNavLink({ href, onClick, children }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="block px-3 py-2 rounded-md text-base font-medium text-text-main hover:text-primary hover:bg-green-50"
        >
            {children}
        </Link>
    );
}
