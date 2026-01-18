import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Linkedin, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-primary text-white pt-16 pb-8 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="relative h-10 w-10 bg-white rounded-full p-1">
                                <Image src="/herbogene_logo.png" alt="HerboGene Logo" fill className="object-contain p-1" />
                            </div>
                            <span className="font-serif font-bold text-2xl">HerboGene</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed mb-6">
                            Combining ancient Ayurvedic wisdom with modern science to deliver premium health solutions. Certified ISO 9001:2015 & HACCP manufacturer.
                        </p>
                        <div className="flex space-x-4">
                            <SocialIcon href="https://www.facebook.com/HerboGene/" icon={<Facebook size={20} />} />
                            <SocialIcon href="https://www.instagram.com/petoooog/" icon={<Instagram size={20} />} />
                            <SocialIcon href="https://x.com/HerboGene" icon={<Twitter size={20} />} />
                            <SocialIcon href="https://in.linkedin.com/in/herbogene-lifesciences" icon={<Linkedin size={20} />} />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-secondary font-bold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <FooterLink href="/">Home</FooterLink>
                            <FooterLink href="/about">About Us</FooterLink>
                            <FooterLink href="/products">Our Products</FooterLink>
                            <FooterLink href="/contact">Contact Support</FooterLink>
                        </ul>
                    </div>

                    {/* Products */}
                    <div>
                        <h3 className="text-secondary font-bold text-lg mb-4">Our Focus</h3>
                        <ul className="space-y-2">
                            <li className="text-gray-300 text-sm">Liver Care</li>
                            <li className="text-gray-300 text-sm">Heart Care</li>
                            <li className="text-gray-300 text-sm">Women&apos;s Health</li>
                            <li className="text-gray-300 text-sm">Child Care</li>
                            <li className="text-gray-300 text-sm">Immunity Boosters</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-secondary font-bold text-lg mb-4">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-secondary mt-1 flex-shrink-0" size={18} />
                                <span className="text-gray-300 text-sm">New Delhi, India</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-secondary flex-shrink-0" size={18} />
                                <div className="flex flex-col">
                                    <a href="tel:+918750443311" className="text-gray-300 hover:text-white text-sm">+91 8750443311</a>
                                    <a href="tel:+918750442211" className="text-gray-300 hover:text-white text-sm">+91 8750442211</a>
                                </div>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-secondary flex-shrink-0" size={18} />
                                <a href="mailto:herbogenelifesciences@gmail.com" className="text-gray-300 hover:text-white text-sm">herbogenelifesciences@gmail.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-green-800 mt-12 pt-8 text-center text-sm text-gray-400">
                    <p>© {new Date().getFullYear()} HerboGene LifeSciences Pvt. Ltd. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ href, icon }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-800 p-2 rounded-full hover:bg-secondary hover:text-white transition-colors duration-300"
        >
            {icon}
        </a>
    );
}

function FooterLink({ href, children }) {
    return (
        <li>
            <Link href={href} className="text-gray-300 hover:text-secondary transition-colors text-sm">
                {children}
            </Link>
        </li>
    );
}
