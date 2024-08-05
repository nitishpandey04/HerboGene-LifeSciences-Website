import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col md:w-2/3 gap-y-8">
        <div className="">
          <p className="font-bold text-xl text-center">Reach out to us</p>
          <br />
          We at HerboGene LifeSciences Pvt. Ltd. are here to assist you with any
          inquiries or support you may need. Reach out to us through the
          following contact details:
        </div>
        <div className="flex flex-col gap-y-2">
          Phone:
          <br />
          <Link href="tel:+918750443311">
            <div className="flex flex-row gap-x-1">
              📞
              <p className="text-blue-600 underline">+91 8750443311</p>
            </div>
          </Link>
          <Link href="tel:+918750442211">
            <div className="flex flex-row gap-x-1">
              📞
              <p className="text-blue-600 underline">+91 8750442211</p>
            </div>
          </Link>
        </div>

        <div>
          Email:
          <br />
          <Link href="mailto:herbogenelifesciences@gmail.com">
            <div className="flex flex-row gap-x-1">
              📧
              <p className="text-blue-600 underline">
                herbogenelifesciences@gmail.com
              </p>
            </div>
          </Link>
        </div>

        <div>
          Connect with Us: <br />
          <br />
          <div className="flex flex-col gap-y-2 text-blue-600 underline">
            <Link href="https://in.linkedin.com/in/herbogene-lifesciences">
              <div className="flex flex-row gap-x-1">
                <Image
                  src="/social/linkedin.svg"
                  alt="Linkedin Link"
                  height={20}
                  width={20}
                />
                LinkedIn
              </div>
            </Link>
            <div className="flex">
              <Link href="https://x.com/HerboGene">
                <div className="flex flex-row gap-x-1">
                  <Image
                    className="flex flex-row"
                    src="/social/x.svg"
                    alt="X.com Link"
                    height={20}
                    width={20}
                  />
                  <p>X.com (Twitter)</p>
                </div>
              </Link>
            </div>
            <div className="flex gap-x-1">
              <Link href="https://www.facebook.com/HerboGene/">
                <div className="flex flex-row gap-x-1">
                  <Image
                    src="/social/facebook.svg"
                    alt="Facebook Link"
                    height={20}
                    width={20}
                  />
                  <p>Facebook</p>
                </div>
              </Link>
            </div>
            <div className="flex gap-x-1">
              <Link href="https://www.instagram.com/petoooog/">
                <div className="flex flex-row gap-x-1">
                  <Image
                    src="/social/instagram.svg"
                    alt="Instagram Link"
                    height={20}
                    width={20}
                  />
                  <p>Instagram</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <p>
          Feel free to contact us for any product-related queries, partnership
          opportunities, or feedback. We are committed to providing the best
          service and support to our customers.
        </p>
      </div>
    </div>
  );
}
