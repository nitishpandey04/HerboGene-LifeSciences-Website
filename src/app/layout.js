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
      <body className="">
        <NavBar />
        <div className="m-8">{children}</div>
        <Footer />
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
    <footer className="flex flex-col m-2 gap-y-6 text-gray-500">
      <div className="flex flex-col items-center gap-y-6">
        <Image
          className="w-1/2 my-4"
          src="/herbo logo.jpg"
          alt="logo"
          height={1000}
          width={1000}
        />
        <div className="flex flex-col">
          <div className="grid"></div>
          <div className="flex flex-col gap-y-2 items-center">
            <div>+91 8750-44-33-11</div>
            <div>+91 8750-44-22-11</div>
            <div>herbogenelifesciences@gmail.com</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between items-center gap-y-4">
        <div>© HerboGene LifeSciences Pvt. Ltd.</div>
        <div className="flex gap-x-8 mb-16">
          <Link
            href="https://in.linkedin.com/in/herbogene-lifesciences"
            prefetch={true}
          >
            <Image
              src="/social/linkedin.svg"
              alt="linkedin.com"
              height={30}
              width={30}
            />
          </Link>
          <Link href="https://x.com/HerboGene" prefetch={true}>
            <Image src="/social/x.svg" alt="x.com" height={30} width={30} />
          </Link>
          <Link href="https://www.instagram.com/petoooog/" prefetch={true}>
            <Image
              src="/social/instagram.svg"
              alt="instagram.com"
              height={30}
              width={30}
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
