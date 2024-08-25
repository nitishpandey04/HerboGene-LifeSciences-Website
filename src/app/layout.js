import "./globals.css";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "HerboGene LifeSciences",
  description: "Company Portfolio Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <div className="m-4">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}

function NavItem(name, method) {
  return (
    <Link href={"/" + method} prefetch={true}>
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
    <div className="flex flex-col md:flex-row justify-between items-center shadow-sm shadow-gray-200 pb-2">
      <div className="w-1/2 md:w-1/5 my-6 mx-8">
        <Link href="/">
          <Image
            src="/herbogene_logo.png"
            height={1000}
            width={1000}
            alt="logo"
            className=""
          />
        </Link>
      </div>
      <div className="flex flex-row justify-around md:w-1/2 w-full">
        <NavItems />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="text-center my-24 mb-10">
      <p>© HerboGene LifeSciences Pvt. Ltd.</p>
      {/* <br /> */}
      <p className="text-gray-500">
        Premium Quality Herbal/Nutraceutical Medicines & Health Supplements
        Manufacturer & Exporter
      </p>
    </div>
  );
}

// function Footer() {
//   return (
//     <footer className="flex flex-col m-2 gap-y-6 text-gray-500">
//       <div className="flex flex-col items-center gap-y-6">
//         <Image
//           className="w-1/2 my-4"
//           src="/herbo logo.jpg"
//           alt="logo"
//           height={1000}
//           width={1000}
//         />
//         <div className="flex flex-col">
//           <div className="grid"></div>
//           <div className="flex flex-col gap-y-2 items-center">
//             <div>+91 8750-44-33-11</div>
//             <div>+91 8750-44-22-11</div>
//             <div>herbogenelifesciences@gmail.com</div>
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-col justify-between items-center gap-y-4">
//         <div>© HerboGene LifeSciences Pvt. Ltd.</div>
//         <div className="flex gap-x-8 mb-16">
//           <Link
//             href="https://in.linkedin.com/in/herbogene-lifesciences"
//             prefetch={true}
//           >
//             <Image
//               src="/social/linkedin.svg"
//               alt="linkedin.com"
//               height={30}
//               width={30}
//             />
//           </Link>
//           <Link href="https://x.com/HerboGene" prefetch={true}>
//             <Image src="/social/x.svg" alt="x.com" height={30} width={30} />
//           </Link>
//           <Link href="https://www.instagram.com/petoooog/" prefetch={true}>
//             <Image
//               src="/social/instagram.svg"
//               alt="instagram.com"
//               height={30}
//               width={30}
//             />
//           </Link>
//         </div>
//       </div>
//     </footer>
//   );
// }
