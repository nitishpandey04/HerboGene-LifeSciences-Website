import Image from "next/image";

export default function About() {
  const products = productsInfo.map((productInfo) => (
    <Product productInfo={productInfo} key={productInfo.id} />
  ));
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col md:w-3/4 gap-y-8">
        <p className="text-xl text-center">Our Product Range</p>
        <p>
          At HerboGene LifeSciences Pvt. Ltd., we pride ourselves on offering a
          diverse range of premium quality herbal and nutraceutical medicines,
          health supplements, proprietary food products, and healthcare
          products. Each product is crafted with the utmost care and precision,
          adhering to the highest standards of quality and safety. Our extensive
          experience and commitment to excellence ensure that you receive the
          best products designed to support a healthier mind and body.
        </p>
        <p>
          Explore our wide array of products below, each accompanied by detailed
          description and image to help you find the perfect fit for your health
          and wellness needs.
        </p>
        <div className="">
          <div className="flex flex-col items-center md:grid md:grid-cols-2 md:justify-items-center gap-y-4">
            {products}
          </div>
        </div>
      </div>
    </div>
  );
}

function Product({ productInfo }) {
  return (
    <div className="flex flex-col items-center text-center shadow-md rounded-md p-4 gap-y-3 w-2/3 md:w-1/2">
      <Image
        className="w-2/3"
        src={productInfo.image_path}
        height={1000}
        width={1000}
        alt={productInfo.name}
      />
      <p className="text-xl">{productInfo.name}</p>
      <p className="text-gray-400">{productInfo.description}</p>
    </div>
  );
}

const productsInfo = [
  {
    id: 1,
    name: "Petoo-G Regular",
    description: "Petoo-G khao khoob pachao",
    image_path: "/products/regular.jpg",
  },
  {
    id: 2,
    name: "Petoo-G Pudina",
    description: "Petoo-G khao khoob pachao",
    image_path: "/products/pudina.jpg",
  },
  {
    id: 3,
    name: "Petoo-G Mango",
    description: "Petoo-G khao khoob pachao",
    image_path: "/products/mango.jpg",
  },
  {
    id: 4,
    name: "Petoo-G Imli",
    description: "Petoo-G khao khoob pachao",
    image_path: "/products/imli.jpg",
  },
  {
    id: 5,
    name: "Petoo-G Hing Goli",
    description: "Petoo-G khao khoob pachao",
    image_path: "/products/hing_goli.jpg",
  },
  {
    id: 6,
    name: "Petoo-G Chand Tare",
    description: "Petoo-G khao khoob pachao",
    image_path: "/products/chaand_tare.jpg",
  },
  {
    id: 7,
    name: "Petoo-G Anardana",
    description: "Petoo-G khao khoob pachao",
    image_path: "/products/anardana.jpg",
  },
  {
    id: 8,
    name: "Petoo-G Jal Jeera",
    description: "Petoo-G khao khoob pachao",
    image_path: "/products/jal_jeera.jpg",
  },
  {
    id: 9,
    name: "Petoo-G Gol Gappe",
    description: "Petoo-G khao khoob pachao",
    image_path: "/products/gol_gappe.jpg",
  },
  {
    id: 10,
    name: "Petoo-G Candy",
    description: "Petoo-G khao khoob pachao",
    image_path: "/products/candy.jpg",
  },
  {
    id: 11,
    name: "Petoo-G Chatters Pudina",
    description: "Petoo-G khao khoob pachao",
    image_path: "/products/chatters_pudina.jpg",
  },
  {
    id: 12,
    name: "Petoo-G Chatters Tomato",
    description: "Petoo-G khao khoob pachao",
    image_path: "/products/chatters_tomato.jpg",
  },
  {
    id: 13,
    name: "Petoo-G Chips Onion",
    description: "Petoo-G khao khoob pachao",
    image_path: "/products/chips_onion.jpg",
  },
  {
    id: 14,
    name: "Petoo-G Chips Tomato",
    description: "Petoo-G khao khoob pachao",
    image_path: "/products/chips_tomato.jpg",
  },
];
