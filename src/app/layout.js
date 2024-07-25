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
      </body>
    </html>
  );
}

function NavItem(name, method) {
  return (
    <Link href={"/" + method}>
      <p className="hover:text-gray-500">{name}</p>
    </Link>
  );
}

function NavItems() {
  return [
    NavItem("Home", ""),
    NavItem("About", "about"),
    NavItem("Products", "products"),
    NavItem("Contact Us", "contact"),
  ];
}

function NavBar() {
  return (
    <header className="">
      <nav className="flex-col shadow-sm shadow-gray-200">
        <Link href="/">
          <Image
            src="/herbo logo.jpg"
            height={1000}
            width={1000}
            alt="logo"
            className="w-1/2 mx-auto my-6"
          />
        </Link>
        <div className="flex flex-row justify-around">
          <NavItems />
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
