import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <div className="relative bg-background overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-background sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">

                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                            <span className="block text-secondary font-semibold tracking-wide uppercase text-sm mb-2">
                                Ancient Wisdom, Modern Wellness
                            </span>
                            <h1 className="text-4xl tracking-tight font-extrabold text-primary sm:text-5xl md:text-6xl font-serif">
                                <span className="block xl:inline">Natural Healing for</span>{" "}
                                <span className="block text-secondary xl:inline">a Better You</span>
                            </h1>
                            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                HerboGene LifeSciences combines traditional Ayurvedic knowledge with modern scientific research to create effective, natural health solutions. Certified organic and trusted globally.
                            </p>
                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                                <div className="rounded-md shadow">
                                    <Link
                                        href="/products"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-green-800 md:py-4 md:text-lg transition-all"
                                    >
                                        Exlpore Products
                                    </Link>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3">
                                    <Link
                                        href="/about"
                                        className="w-full flex items-center justify-center px-8 py-3 border-2 border-primary text-base font-medium rounded-md text-primary bg-transparent hover:bg-green-50 md:py-4 md:text-lg transition-all"
                                    >
                                        About Us
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-50">
                <div className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full relative">
                    <Image
                        src="/petoo-g-home.png"
                        alt="Natural Health"
                        fill
                        className="object-contain p-8"
                    />
                </div>
            </div>
        </div>
    );
}
