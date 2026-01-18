import Image from "next/image";
import Link from "next/link";
import { products } from "../../../data/products";
import { ArrowLeft, CheckCircle } from "lucide-react";
import AddToCartButton from "../../../components/AddToCartButton";

export async function generateStaticParams() {
    return products.map((product) => ({
        id: product.id.toString(),
    }));
}

export default function ProductDetail({ params }) {
    const product = products.find((p) => p.id.toString() === params.id);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text-main">
                <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
                <Link href="/products" className="text-primary hover:underline">
                    Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen py-10 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Back Button */}
                <Link href="/products" className="inline-flex items-center text-text-muted hover:text-primary mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Range
                </Link>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">

                        {/* Image Section */}
                        <div className="relative h-[400px] md:h-[600px] bg-gray-50 p-8 flex items-center justify-center">
                            <div className="relative h-full w-full">
                                <Image
                                    src={product.image_path}
                                    alt={product.name}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <span className="text-secondary font-bold tracking-wide uppercase text-sm mb-2">
                                {product.category}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-4">
                                {product.name}
                            </h1>
                            <p className="text-2xl font-bold text-text-main mb-6">
                                ₹{product.price}
                            </p>

                            <div className="prose prose-stone text-text-muted mb-8">
                                <p className="text-lg leading-relaxed">{product.details}</p>
                            </div>

                            {product.ingredients && (
                                <div className="mb-8 p-6 bg-background rounded-xl border border-secondary/20">
                                    <h3 className="font-bold text-text-main mb-2">Key Ingredients</h3>
                                    <p className="text-text-muted">{product.ingredients}</p>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                                <AddToCartButton
                                    product={product}
                                    className="flex-1 px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transform active:scale-95"
                                />
                            </div>

                            <div className="mt-6 flex items-center gap-2 text-green-600 text-sm font-medium">
                                <CheckCircle size={16} />
                                <span>In Stock - Ready to Ship</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
