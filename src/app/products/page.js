import Image from "next/image";

export default function About() {
  const products = productsInfo.map((productInfo) => (
    <Product productInfo={productInfo} key={productInfo.id} />
  ));
  return (
    <div>
      <p className="text-xl text-center">Our Product Range</p>
      <br />
      <div className="flex flex-col gap-y-8">{products}</div>
    </div>
  );
}

function Product({ productInfo }) {
  return (
    <div className="flex flex-col items-center shadow-md rounded-md p-4 gap-y-3">
      <Image
        className="w-2/3"
        src={productInfo.image_path}
        height={1000}
        width={1000}
        alt={productInfo.name}
      />
      <p className="text-2xl">{productInfo.name}</p>
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
    name: "Petoo-G Chatters Pudina",
    description: "Petoo-G khao khoob pachao",
    image_path: "/products/chatters_pudina.jpg",
  },
  {
    id: 7,
    name: "Petoo-G Chatters Tomato",
    description: "Petoo-G khao khoob pachao",
    image_path: "/products/chatters_tomato.jpg",
  },
  {
    id: 8,
    name: "Petoo-G Chips Onion",
    description: "Petoo-G khao khoob pachao",
    image_path: "/products/chips_onion.jpg",
  },
  {
    id: 9,
    name: "Petoo-G Chips Tomato",
    description: "Petoo-G khao khoob pachao",
    image_path: "/products/chips_tomato.jpg",
  },
  {
    id: 10,
    name: "Petoo-G Gol Gappe",
    description: "Petoo-G khao khoob pachao",
    image_path: "/products/gol_gappe.jpg",
  },
];
