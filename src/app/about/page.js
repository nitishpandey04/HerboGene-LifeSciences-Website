import Image from "next/image";
import SectionTitle from "../../components/SectionTitle";

export default function About() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="About HerboGene" subtitle="Our Story & Vision" />

        <div className="flex flex-col lg:flex-row gap-12 items-center mb-20">
          <div className="w-full lg:w-1/2 relative">
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/mission_vision.png"
                alt="HerboGene Vision"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white p-4">
                <p className="font-bold text-xl">Innovating for Health</p>
                <p className="text-sm opacity-90">Since 1993</p>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary rounded-full -z-10 opacity-20 hidden lg:block"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary rounded-full -z-10 opacity-20 hidden lg:block"></div>
          </div>

          <div className="w-full lg:w-1/2 space-y-6 text-lg text-text-muted leading-relaxed">
            <p>
              <strong className="text-primary font-serif text-xl block mb-2">A Legacy of Quality</strong>
              HerboGene LifeSciences Pvt. Ltd. is an <span className="font-semibold text-text-main">ISO 9001:2015 + HACCP and ISO 22000:2018 Certified</span> manufacturing company. With over 30 years of experience, we specialize in manufacturing Nutraceuticals, Health Supplements, and Proprietary Food Products, leveraging state-of-the-art infrastructure and skilled professionals.
            </p>
            <p>
              We have successfully established one of the most popular brands, <span className="font-semibold text-secondary">Petoo-G</span>, featuring digestive tablets, snacks, superfoods (millets), and candies. Our dealer network spans over eight states in India, including Uttar Pradesh, Delhi, Haryana, Madhya Pradesh, West Bengal, Maharashtra, and Rajasthan.
            </p>
            <p>
              Since our inception, we have been committed to delivering high-quality products that address health issues effectively. Our international client base is rapidly growing, with customers in 10+ countries, reflecting global trust in our mission.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 text-center">
          <h3 className="text-2xl font-serif font-bold text-primary mb-4">Our Mission</h3>
          <p className="text-text-muted text-lg max-w-4xl mx-auto italic">
            &quot;To combine unique approaches in developing nutraceuticals designed to impact targeted functions, promoting a healthier mind and body for every human being.&quot;
          </p>
        </div>

      </div>
    </div>
  );
}
