import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Image
        src="/boy_character.jpg"
        alt="petoo-g character"
        width={700}
        height={700}
        className="my-8"
      />
      <div className="flex flex-col items-center gap-y-4">
        <div className="text-center">
          We made a mini-dessert that aids digestion and tastes like a treat. In
          7 unique flavours. So, just pop it and lip-smack it.
        </div>
        <Link href="#">
          <button className="bg-red-600 text-center text-lg text-white rounded-md p-2">
            Shop Now
          </button>
        </Link>
      </div>
    </div>
  );
}
