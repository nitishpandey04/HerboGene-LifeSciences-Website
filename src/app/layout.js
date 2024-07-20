import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HerboGene LifeSciences",
  description: "Company Portfolio Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}

function NavBar() {
  return (
    <div className="">
      <nav className="flex justify-between shadow-sm shadow-gray-200">
        <div className="w-1/6 my-4 mx-6">
          <Image src="/herbo logo.jpg" height={1000} width={1000} alt="logo" />
        </div>
        <div className="flex gap-x-14 items-center mx-16">
          <Link href="/">
            <p className="hover:text-gray-500">Home</p>
          </Link>
          <Link href="/about">
            <p className="hover:text-gray-500">About</p>
          </Link>
          <Link href="/products">
            <p className="hover:text-gray-500">Products</p>
          </Link>
          <Link href="/contact_us">
            <p className="hover:text-gray-500">Contact Us</p>
          </Link>
        </div>
      </nav>
    </div>
  );
}
