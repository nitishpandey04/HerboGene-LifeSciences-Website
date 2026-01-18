import Image from "next/image";
import Link from "next/link";
import SectionTitle from "../../components/SectionTitle";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Contact() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Get in Touch" subtitle="We're Here to Help" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-lg mb-8">
              <Image
                src="/contact_us_3.png"
                alt="Contact Us"
                fill
                className="object-cover"
              />
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-primary mb-6 border-b border-gray-100 pb-4">Contact Information</h3>

              <div className="space-y-6">
                <ContactItem
                  icon={<Phone className="text-secondary" />}
                  title="Call Us"
                  content={
                    <div className="flex flex-col">
                      <a href="tel:+918750443311" className="hover:text-primary transition-colors">+91 8750443311</a>
                      <a href="tel:+918750442211" className="hover:text-primary transition-colors">+91 8750442211</a>
                    </div>
                  }
                />

                <ContactItem
                  icon={<Mail className="text-secondary" />}
                  title="Email Us"
                  content={
                    <a href="mailto:herbogenelifesciences@gmail.com" className="hover:text-primary transition-colors">
                      herbogenelifesciences@gmail.com
                    </a>
                  }
                />

                <ContactItem
                  icon={<MapPin className="text-secondary" />}
                  title="Visit Us"
                  content="New Delhi, India"
                />
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-primary mb-6 border-b border-gray-100 pb-4">Follow Us</h3>
              <div className="flex gap-4">
                <SocialButton href="https://in.linkedin.com/in/herbogene-lifesciences" icon={<Linkedin />} label="LinkedIn" />
                <SocialButton href="https://x.com/HerboGene" icon={<Twitter />} label="Twitter" />
                <SocialButton href="https://www.facebook.com/HerboGene/" icon={<Facebook />} label="Facebook" />
                <SocialButton href="https://www.instagram.com/petoooog/" icon={<Instagram />} label="Instagram" />
              </div>
            </div>
          </div>

          {/* Contact Form (Visual Only for now) */}
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border-t-4 border-secondary">
            <h3 className="text-2xl font-serif font-bold text-primary mb-2">Send us a Message</h3>
            <p className="text-text-muted mb-8">Fill out the form below and we&apos;ll get back to you shortly.</p>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Full Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="John Doe" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">Phone Number</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Subject</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white">
                  <option>Product Inquiry</option>
                  <option>Partnership Opportunity</option>
                  <option>General Support</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Message</label>
                <textarea rows="4" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
              </div>

              <button type="button" className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-green-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

function ContactItem({ icon, title, content }) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-background p-3 rounded-full text-secondary">
        {icon}
      </div>
      <div>
        <p className="font-bold text-text-main">{title}</p>
        <div className="text-text-muted mt-1">{content}</div>
      </div>
    </div>
  )
}

function SocialButton({ href, icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-12 h-12 rounded-full bg-background text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
      aria-label={label}
    >
      {icon}
    </a>
  )
}
