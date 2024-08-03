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
      <div className="flex flex-col gap-y-8 md:w-2/3">
        <p>
          HerboGene LifeSciences Pvt. Ltd. is a registered MSME, certified
          manufacturer, and exporter of premium quality herbal and nutraceutical
          medicines, health supplements, proprietary food products, and
          healthcare products. We hold certifications including cGMP, ISO
          9001:2015 + HACCP, and ISO 22000:2018 from the British Standards
          Institution, UK.
        </p>
        <p>
          We have successfully established one of the most popular trademark and
          copyright brands, Petoo-G, which includes digestive tablets, snacks,
          superfoods (millets), candies, and more. Our excellent dealer network
          spans over eight states in India, including Uttar Pradesh, Delhi,
          Haryana, Madhya Pradesh, West Bengal, Maharashtra, and Rajasthan. We
          are continuously working to expand our reach to more states across
          India.
        </p>
        <p>
          We are confident that we will successfully launch our products in
          Chattisgarh, Jharkhand, and Bihar by the end of the current fiscal
          year 2023-2024 (i.e., by the end of March 2024).
        </p>
        <p>
          Our international client base is rapidly growing, with customers in
          countries such as Nigeria, Sudan, South Africa, Russia, the UK, the
          Middle East, Afghanistan, Sri Lanka, Nepal, Vietnam, the Philippines,
          Bangladesh, and the UAE.
        </p>
        <p>
          HerboGene is enriched with over 30 years of experience in the
          manufacturing of nutraceuticals, health supplements, proprietary food
          products, and healthcare products.
        </p>
        <p>
          Since our commencement, we have been confident that our introduced and
          planned products will address health issues effectively and be
          well-received by the market and people of India and overseas
          countries.
        </p>
        <p>
          Our supplements represent a unique approach to developing
          nutraceuticals designed to impact targeted functions, promoting a
          healthier mind and body.
        </p>
      </div>
    </div>
  );
}
