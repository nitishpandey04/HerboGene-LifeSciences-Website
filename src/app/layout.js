import "./globals.css";
import { Inter, Playfair_Display } from 'next/font/google'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
})

export const metadata = {
    title: {
        default: "HerboGene LifeSciences | Premium Ayurvedic Medicines",
        template: "%s | HerboGene LifeSciences",
    },
    description: "Certified manufacturer of high-quality Ayurvedic medicines, nutraceuticals, and health supplements. Combining traditional wisdom with modern science.",
    keywords: ["Ayurveda", "Herbal Medicine", "Nutraceuticals", "Health Supplements", "Petoo-G", "HerboGene", "Digestive Tablets"],
    authors: [{ name: "HerboGene LifeSciences" }],
    creator: "HerboGene LifeSciences",
    openGraph: {
        type: "website",
        locale: "en_IN",
        url: "https://herbogene.com",
        title: "HerboGene LifeSciences | Premium Ayurvedic Medicines",
        description: "Certified manufacturer of high-quality Ayurvedic medicines and health supplements.",
        siteName: "HerboGene LifeSciences",
        images: [
            {
                url: "/herbogene_logo.png", // Assuming this exists or will be main image
                width: 800,
                height: 600,
                alt: "HerboGene LifeSciences Logo",
            },
        ],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${playfair.variable} font-sans bg-background text-text-main`}>
                <Navbar />
                <CartDrawer />
                <main className="min-h-screen pt-20">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
