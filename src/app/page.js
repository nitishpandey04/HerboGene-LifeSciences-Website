import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center mx-4 my-12">
      <div className="flex-col content-center space-y-8 w-1/4">
        <div className="font-bold font-sans text-red-600 text-4xl">Petoo-G</div>
        <div className="">
          We made a mini-dessert that aids digestion and tastes like a treat. In
          7 unique flavours. So, just pop it and lip-smack it.
        </div>
        <div className="bg-red-600 w-1/3 text-center text-lg text-white h-10 content-center rounded-md">
          <Link href="#">
            <button>Shop Now</button>
          </Link>
        </div>
      </div>
      <div>
        <Image
          src="/boy_character.jpg"
          alt="petoo-g character"
          width={700}
          height={700}
        />
      </div>
    </div>
  );
}
