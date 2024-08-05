import Image from "next/image";

export default function About() {
  return (
    <div className="flex flex-col items-center">
      <Image
        className="my-8 mb-16 md:w-1/3"
        src="/petoo-g_characters.jpg"
        alt="Petoo-G Characters"
        width={1000}
        height={1000}
      />
      <div className="flex flex-col gap-y-8 md:w-3/4">
        <p>
          HerboGene LifeSciences Pvt. Ltd., is an ISO 9001:2015 + HACCP, ISO
          22000:2018 Certified manufacturing Company enriched with over 30 years
          of experience, in the arena of manufacturing Nutraceuticals, Health
          Supplement, Proprietary Food Products, leveraging state-of-the-art
          infrastructure, skilled professionals, and un-compromised commitment
          towards quality and innovation.
        </p>
        <p>
          We have successfully established one of the most popular trademark and
          copyright brand, Petoo-G, which includes digestive tablets, snacks,
          superfoods (millets), candies, and more. Our excellent dealer network
          spans over eight states in India, including Uttar Pradesh, Delhi,
          Haryana, Madhya Pradesh, West Bengal, Maharashtra, and Rajasthan. We
          are continuously working to expand our reach to more states across
          India.
        </p>
        <p>
          Since our commencement, we have been confident that our expertise in
          delivering high quality products will address health issues
          effectively and be well-received by the market and people of India and
          overseas countries. Our international client base is rapidly growing,
          with customers in 10 countries.
        </p>
        <p>
          Our supplements represents an unique approach to developing
          neutraceuticals designed to impact targeted functions, promoting a
          healthier mind and body of human being.
        </p>
      </div>
    </div>
  );
}
