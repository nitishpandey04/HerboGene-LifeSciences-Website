import Image from "next/image";
import SectionTitle from "../../components/SectionTitle";

export default function Products() {
  const products = productsInfo.map((productInfo) => (
    <ProductCard productInfo={productInfo} key={productInfo.id} />
  ));

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Our Premium Product Range"
          subtitle="Crafted for Wellness"
        />
        <div className="text-center max-w-3xl mx-auto mb-16 text-text-muted">
          <p>
            At HerboGene LifeSciences, we pride ourselves on offering a diverse range of premium quality herbal and nutraceutical medicines. Each product is crafted with the utmost care and precision, adhering to the highest standards of quality and safety.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ productInfo }) {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
      <div className="relative h-64 w-full bg-gray-50 p-6 overflow-hidden">
        <Image
          className="object-contain group-hover:scale-110 transition-transform duration-500"
          src={productInfo.image_path}
          fill
          alt={productInfo.name}
        />
        <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          PREMIUM
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-text-main mb-2 font-serif group-hover:text-primary transition-colors">
          {productInfo.name}
        </h3>
        <p className="text-text-muted text-sm flex-grow">
          {productInfo.description}
        </p>
        <button className="mt-4 w-full py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium text-sm">
          View Details
        </button>
      </div>
    </div>
  );
}

const productsInfo = [
  {
    id: 1,
    name: "Petoo-G Regular",
    description: "Expertly formulated digestive tablets for daily gut health and comfort.",
    image_path: "/products/regular.jpg",
  },
  {
    id: 2,
    name: "Petoo-G Pudina",
    description: "Refreshing mint-flavored digestive aid that soothes the stomach instantly.",
    image_path: "/products/pudina.jpg",
  },
  {
    id: 3,
    name: "Petoo-G Mango",
    description: "Tangy mango-flavored tablets that make digestion a delicious experience.",
    image_path: "/products/mango.jpg",
  },
  {
    id: 4,
    name: "Petoo-G Imli",
    description: "Traditional tamarind zest combined with digestive herbs for tangy relief.",
    image_path: "/products/imli.jpg",
  },
  {
    id: 5,
    name: "Petoo-G Hing Goli",
    description: "Classic Hing (Asafoetida) formulation for gas relief and improved digestion.",
    image_path: "/products/hing_goli.jpg",
  },
  {
    id: 6,
    name: "Petoo-G Chand Tare",
    description: "Unique star-shaped digestive treats loved by children and adults alike.",
    image_path: "/products/chaand_tare.jpg",
  },
  {
    id: 7,
    name: "Petoo-G Anardana",
    description: "Rich pomegranate seeds blended with spices for a sweet and sour digestive treat.",
    image_path: "/products/anardana.jpg",
  },
  {
    id: 8,
    name: "Petoo-G Jal Jeera",
    description: "Cooling cumin spice blend that aids digestion and refreshes the body.",
    image_path: "/products/jal_jeera.jpg",
  },
  {
    id: 9,
    name: "Petoo-G Gol Gappe",
    description: "The authentic spicy taste of street food in a healthy digestive tablet form.",
    image_path: "/products/gol_gappe.jpg",
  },
  {
    id: 10,
    name: "Petoo-G Candy",
    description: "Sweet digestive candies that combine taste with health benefits.",
    image_path: "/products/candy.jpg",
  },
  {
    id: 11,
    name: "Petoo-G Chatters Pudina",
    description: "Crunchy mint snacks that are light on the stomach and big on flavor.",
    image_path: "/products/chatters_pudina.jpg",
  },
  {
    id: 12,
    name: "Petoo-G Chatters Tomato",
    description: "Tangy tomato snacks made with wholesome ingredients for guilt-free munching.",
    image_path: "/products/chatters_tomato.jpg",
  },
  {
    id: 13,
    name: "Petoo-G Chips Onion",
    description: "Savory onion flavored chips that are baked for a healthier snacking option.",
    image_path: "/products/chips_onion.jpg",
  },
  {
    id: 14,
    name: "Petoo-G Chips Tomato",
    description: "Classic tomato chips with a unique herbal twist for better digestion.",
    image_path: "/products/chips_tomato.jpg",
  },
];
