import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-20">
      <Title />
      <ProductRange />
      <FocusRange />
      <USP />
      <Certifications />
      <ContactUs />
    </div>
  );
}

function Title() {
  return (
    <div className="flex flex-col md:flex-row-reverse md:justify-center md:items-center gap-y-6">
      <div className="h-52 w-full md:w-2/5 md:h-96 relative">
        <Image
          src="/petoo-g-home.png"
          fill={true}
          objectFit="contain"
          alt="petoo-g character"
        />
      </div>
      <div className="flex flex-col text-center md:text-left gap-y-4 md:w-1/4">
        <p>
          HerboGene LifeSciences is a certified manufacturer and exporter of
          high-quality organic, proprietary food products, health supplements,
          ayurvedic medicines and nutraceuticals.
        </p>
        <div className="hidden md:block">
          <Link href="/about">
            <button className="bg-red-500 text-white font-semibold p-2 rounded-md">
              About Us
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProductRange() {
  const products = product_range.map((product) => (
    <Item
      title={product.title}
      image_path={product.image_path}
      key={product.id}
    />
  ));
  return (
    <div className="flex flex-col gap-y-2 md:gap-y-4 pt-4 text-center">
      <p className="text-xl">Our Product Range</p>
      <div className="flex flex-col md:flex-row gap-y-4 items-center border-2 md:border-0 border-gray-200 p-2 rounded-md">
        {products}
      </div>
    </div>
  );
}

function FocusRange() {
  const focus = focus_range.map((product) => (
    <Item
      title={product.title}
      image_path={product.image_path}
      key={product.id}
    />
  ));
  return (
    <div className="flex flex-col gap-y-2 pt-4 text-center">
      <p className="text-xl">Our Focus is All Round Health</p>
      <div className="md:border-0 border-2 border-gray-200 rounded-md">
        <div className="flex flex-col md:flex-row gap-y-4 items-center p-2">
          {focus.slice(0, 4)}
        </div>
        <div className="flex flex-col md:flex-row gap-y-4 items-center p-2">
          {focus.slice(4)}
        </div>
      </div>
    </div>
  );
}

function USP() {
  return (
    <div className="flex flex-col gap-y-4 justify-center">
      <p className="text-xl text-center">Why Us?</p>
      <div className="flex flex-col md:flex-row gap-y-4 justify-center">
        <div className="flex flex-row h-80 w-full md:w-1/4 relative justify-start">
          <Image
            src="/usp__1.png"
            alt="unique selling proposition"
            fill={true}
            objectFit="contain"
            className=""
          />
        </div>
        <div className="flex flex-col md:w-2/5 md:justify-center mx-4 gap-y-4 md:gap-y-10">
          <div className="">
            <p className="font-bold">Trusted Brand</p>
            <p>
              Our Brand Petoo-G, is well-established across 8 states in India,
              known for reliability and customer trust
            </p>
          </div>
          <div className="">
            <p className="font-bold">30 Years of Expertise</p>
            <p>
              With decades of experience, we blend traditional wisdom with
              modern innovation to create effective health solutions{" "}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row-reverse gap-y-4 justify-center">
        <div className="h-80 w-full md:w-1/4 relative">
          <Image
            src="/usp_2.png"
            alt="unique selling proposition"
            fill={true}
            objectFit="contain"
            className=""
          />
        </div>
        <div className="flex flex-col md:w-2/5 md:justify-center mx-4 gap-y-4 md:gap-y-10">
          <div className="">
            <p className="font-bold">Holistic Health Solutions</p>
            <p>
              We offer a comprehensive product range that addresses nutritional
              deficiencies and chronic health issues naturally
            </p>
          </div>
          <div className="">
            <p className="font-bold">Global Reach</p>
            <p>
              We have a growing international presence in countries like
              Nigeria, South Africa and Russia, reflecting global confidence in
              our products
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Certifications() {
  const certifications = certificates.map((cert) => (
    <Item title={cert.title} image_path={cert.image_path} key={cert.id} />
  ));
  return (
    <div className="flex flex-col gap-y-4 items-center">
      <p className="text-xl text-center">Certifications</p>
      <div className="flex flex-col md:flex-row md:gap-x-14 gap-y-4 items-center w-4/5">
        {certifications}
      </div>
    </div>
  );
}

function ContactUs() {
  return (
    <div className="flex justify-center text-center">
      <div className="flex flex-col md:w-1/4">
        <p className="text-xl">Let Us Get in Touch</p>
        <p>
          We would love to hear from you! Kindly reach out to us by visiting
          our&nbsp;
          <Link href="/contact" className="text-blue-700 underline">
            Contact Page
          </Link>
        </p>
      </div>
    </div>
  );
}

function Item({ title, image_path }) {
  return (
    <div className="flex flex-col w-11/12 text-center">
      <div className="h-52 w-full relative">
        <Image
          src={image_path}
          alt="item image"
          fill={true}
          className="rounded-lg"
          objectFit="contain"
        />
      </div>
      <p className="">{title}</p>
    </div>
  );
}

const product_range = [
  { title: "Nutraceuticals", image_path: "/nutraceuticals.webp", id: 1 },
  {
    title: "Health Supplements",
    image_path: "/health_supplements_2.webp",
    id: 2,
  },
  {
    title: "Propreitary Food Products",
    image_path: "/proprietary_food_products.jpg",
    id: 3,
  },
  {
    title: "Dietary Supplements",
    image_path: "/dietary_supplements.webp",
    id: 4,
  },
];

const focus_range = [
  {
    title: "Liver Care",
    image_path: "/liver_care.png",
    id: 1,
  },
  {
    title: "Heart Care",
    image_path: "/heart_care.jpg",
    id: 2,
  },
  {
    title: "Muscle Gainer",
    image_path: "/muscle_gainer.jpg",
    id: 3,
  },
  {
    title: "Energy Booster",
    image_path: "/energy_booster_2.jpg",
    id: 4,
  },
  {
    title: "Child Care",
    image_path: "/child_care.png",
    id: 5,
  },
  {
    title: "Women Care",
    image_path: "/women_care.png",
    id: 6,
  },
  {
    title: "Senior Citizen Care",
    image_path: "/senior_citizen_care.png",
    id: 7,
  },
];

const certificates = [
  {
    title: "ISO 9001 : 2015 & HACCP",
    image_path: "/iso_9001.jpg",
    id: 1,
  },
  {
    title: "IEC",
    image_path: "/iec.png",
    id: 2,
  },
  {
    title: "FSSAI",
    image_path: "/fssai.png",
    id: 3,
  },
  {
    title: "ISO 22000 : 2018",
    image_path: "/iso_22000.jpg",
    id: 4,
  },
  {
    title: "cGMP",
    image_path: "/cgmp.jpg",
    id: 5,
  },
];
