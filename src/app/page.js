import Image from "next/image";
import Link from "next/link";
import Hero from "../components/Hero";
import SectionTitle from "../components/SectionTitle";
import { CheckCircle, Globe, Award, Leaf } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-20">
      <Hero />
      <ProductRange />
      <USP />
      <FocusRange />
      <Certifications />
      <CallToAction />
    </div>
  );
}

function ProductRange() {
  const products = product_range.map((product) => (
    <Link href="/products" key={product.id} className="group cursor-pointer">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
        <div className="relative h-48 w-full bg-gray-50 p-4">
          <Image
            src={product.image_path}
            alt={product.title}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4 text-center">
          <h3 className="text-lg font-semibold text-text-main group-hover:text-primary transition-colors">{product.title}</h3>
        </div>
      </div>
    </Link>
  ));

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <SectionTitle title="Our Product Range" subtitle="Natural Solutions" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products}
      </div>
    </section>
  );
}

function FocusRange() {
  const focus = focus_range.map((item) => (
    <div key={item.id} className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-24 w-24 mb-4">
        <Image src={item.image_path} alt={item.title} fill className="object-contain rounded-full border-2 border-secondary/20 p-1" />
      </div>
      <p className="font-medium text-text-main text-center">{item.title}</p>
    </div>
  ));

  return (
    <section className="bg-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <SectionTitle title="Holistic Health Focus" subtitle="Area of Expertise" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {focus}
        </div>
      </div>
    </section>
  );
}

function USP() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <SectionTitle title="Why Choose Us?" subtitle="Our Commitment" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="p-4 bg-green-50 rounded-full text-primary mb-4">
            <Award size={32} />
          </div>
          <h3 className="text-xl font-bold text-text-main mb-2">Trusted Brand</h3>
          <p className="text-text-muted">
            Well-established brand &quot;Petoo-G&quot; across 8 states in India, built on decades of reliability.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="p-4 bg-amber-50 rounded-full text-secondary mb-4">
            <Leaf size={32} />
          </div>
          <h3 className="text-xl font-bold text-text-main mb-2">30 Years Expertise</h3>
          <p className="text-text-muted">
            Blending traditional Ayurvedic wisdom with modern innovation for effective health solutions.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="p-4 bg-blue-50 rounded-full text-blue-600 mb-4">
            <Globe size={32} />
          </div>
          <h3 className="text-xl font-bold text-text-main mb-2">Global Reach</h3>
          <p className="text-text-muted">
            Growing international presence in Nigeria, South Africa, and Russia reflecting global trust.
          </p>
        </div>

      </div>
    </section>
  );
}

function Certifications() {
  const certifications = certificates.map((cert) => (
    <div key={cert.id} className="relative h-24 w-24 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
      <Image src={cert.image_path} alt={cert.title} fill className="object-contain" />
    </div>
  ));

  return (
    <section className="bg-white py-12 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-8">
          <p className="text-lg font-medium text-gray-500">Certified Excellence</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
          {certifications}
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-10">
      <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Ready to start your wellness journey?</h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto text-lg">
            Explore our range of natural products or get in touch with our experts for guidance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/products" className="bg-white text-primary px-8 py-3 rounded-full font-bold hover:bg-secondary hover:text-white transition-colors">
              View Products
            </Link>
            <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
        {/* Background Decorative Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  );
}

const product_range = [
  { title: "Nutraceuticals", image_path: "/nutraceuticals.webp", id: 1 },
  { title: "Health Supplements", image_path: "/health_supplements_2.webp", id: 2 },
  { title: "Proprietary Food", image_path: "/proprietary_food_products.jpg", id: 3 },
  { title: "Dietary Supplements", image_path: "/dietary_supplements.webp", id: 4 },
];

const focus_range = [
  { title: "Liver Care", image_path: "/liver_care.png", id: 1 },
  { title: "Heart Care", image_path: "/heart_care.jpg", id: 2 },
  { title: "Muscle Gainer", image_path: "/muscle_gainer.jpg", id: 3 },
  { title: "Energy Booster", image_path: "/energy_booster_2.jpg", id: 4 },
  { title: "Child Care", image_path: "/child_care.png", id: 5 },
  { title: "Women Care", image_path: "/women_care.png", id: 6 },
  { title: "Senior Care", image_path: "/senior_citizen_care.png", id: 7 },
];

const certificates = [
  { title: "ISO 9001", image_path: "/iso_9001.jpg", id: 1 },
  { title: "IEC", image_path: "/iec.png", id: 2 },
  { title: "FSSAI", image_path: "/fssai.png", id: 3 },
  { title: "ISO 22000", image_path: "/iso_22000.jpg", id: 4 },
  { title: "cGMP", image_path: "/cgmp.jpg", id: 5 },
];
