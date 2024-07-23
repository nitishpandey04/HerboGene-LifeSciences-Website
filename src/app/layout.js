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
      <body className="{inter.className} px-2">
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

function NavBar() {
  return (
    <header className="">
      <nav className="flex justify-between shadow-sm shadow-gray-200">
        <div className="w-1/6 my-4 mx-6">
          <Link href="/">
            <Image
              src="/herbo logo.jpg"
              height={1000}
              width={1000}
              alt="logo"
            />
          </Link>
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
    </header>
  );
}

function Footer() {
  return (
    <footer className="flex-col">
      <div className="flex">
        <div>image</div>
        <div className="flex-col">
          <div>links</div>
          <div className="flex">
            <div className="flex-col">
              <div>offce address</div>
              <div>toll free number</div>
            </div>
            <div className="flex-col">
              <div>phone number 1</div>
              <div>phone number 2</div>
              <div>email id</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex">
        <div>copyright</div>
        <div>social</div>
      </div>
    </footer>
  );
}
