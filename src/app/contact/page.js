import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <div className="flex flex-col gap-y-8">
      <div>
        <p className="font-bold text-xl text-center">Reach out to us</p>
        <br />
        We at HerboGene LifeSciences Pvt. Ltd. are here to assist you with any
        inquiries or support you may need. Reach out to us through the following
        contact details:
      </div>
      <p>
        Phone:
        <br />
        <Link href="tel:+918750443311">📞 +91 8750443311</Link>
        <br />
        <Link href="tel:+918750442211">📞 +91 8750442211</Link>
        <br />
      </p>

      <p>
        Email:
        <br />
        <Link href="mailto:herbogenelifesciences@gmail.com">
          📧 herbogenelifesciences@gmail.com
        </Link>
      </p>

      <div>
        Connect with Us: <br />
        <br />
        <div className="flex flex-col gap-y-2">
          <div className="flex gap-x-1">
            <p>
              <Link
                href="https://in.linkedin.com/in/herbogene-lifesciences"
                prefetch={true}
              >
                <Image
                  src="/social/linkedin.svg"
                  alt="Linkedin Link"
                  height={20}
                  width={20}
                />
              </Link>
            </p>
            <p>LinkedIn</p>
          </div>
          <div className="flex gap-x-1">
            <p>
              <Link href="https://x.com/HerboGene" prefetch={true}>
                <Image
                  src="/social/x.svg"
                  alt="X.com Link"
                  height={20}
                  width={20}
                />
              </Link>
            </p>
            <p>X.com (Twitter)</p>
          </div>
          <div className="flex gap-x-1">
            <p>
              <Link href="https://www.facebook.com/HerboGene/" prefetch={true}>
                <Image
                  src="/social/facebook.svg"
                  alt="Facebook Link"
                  height={20}
                  width={20}
                />
              </Link>
            </p>
            <p>Facebook</p>
          </div>
          <div className="flex gap-x-1">
            <p>
              <Link href="https://www.instagram.com/petoooog/" prefetch={true}>
                <Image
                  src="/social/instagram.svg"
                  alt="Instagram Link"
                  height={20}
                  width={20}
                />
              </Link>
            </p>
            <p>Instagram</p>
          </div>
        </div>
      </div>

      <p>
        Feel free to contact us for any product-related queries, partnership
        opportunities, or feedback. We are committed to providing the best
        service and support to our customers.
      </p>

      <div className="text-center">
        <b>HerboGene LifeSciences Pvt. Ltd.</b>
        <br />
        <p className="text-gray-500">
          Premium Quality Herbal/Nutraceutical Medicines & Health Supplements
          Manufacturer & Exporter
        </p>
      </div>
    </div>
  );
}
