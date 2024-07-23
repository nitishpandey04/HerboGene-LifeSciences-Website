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
        <NavBarDropDown />
        {/* <Footer /> */}
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
          <NavItems />
        </div>
      </nav>
    </header>
  );
}

function NavBarDropDown() {
  return (
    <div>
      <label for="cars"></label>
      <select name="cars" id="cars">
        <option value="volvo"></option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
      </select>
    </div>
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
