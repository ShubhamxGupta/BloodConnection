import { Link } from "react-router-dom";
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    HeartPulse,
} from "lucide-react";

const Footer = () => {
    const handleSubscribe = (e) => {
        e.preventDefault();
        const email = e.target.email.value.trim();
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        // Proceed with email handling logic
    };

    return (
        <footer className="bg-gradient-to-r from-[#223634] via-[#1b3a4b] to-[#312450] text-white py-12 md:mt-6">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Logo & About Section */}
                <div>
                    <Link
                        to="/"
                        className="flex items-center text-2xl font-bold"
                    >
                        <HeartPulse className="mr-2 text-[#fb4673]" />
                        <span className="text-[#28bca9]">BloodConnection</span>
                    </Link>
                    <p className="mt-4 text-gray-300">
                        Saving lives through blood & organ donation. Join us and
                        make a difference today!
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold text-[#28bca9]">
                        Quick Links
                    </h3>
                    <ul className="mt-4 space-y-2">
                        <li>
                            <Link to="/" className="hover:text-[#fb4673]">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-[#fb4673]">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact"
                                className="hover:text-[#fb4673]"
                            >
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact Information */}
                <div>
                    <h3 className="text-lg font-semibold text-[#28bca9]">
                        Contact Us
                    </h3>
                    <div className="mt-4 space-y-3">
                        <p className="flex items-center">
                            <Mail className="mr-2 text-[#fb4673]" />{" "}
                            support@bloodconnection.com
                        </p>
                        <p className="flex items-center">
                            <Phone className="mr-2 text-[#fb4673]" /> +91 1234567890
                        </p>
                        <p className="flex items-center">
                            <MapPin className="mr-2 text-[#fb4673]" /> 123
                            Donation Street, Chennai, TN
                        </p>
                    </div>
                </div>
            </div>

            {/* Social Media & Newsletter */}
            <div className="mt-10 text-center border-t border-gray-600 pt-6">
                {/* Social Media Links */}
                <div className="flex justify-center space-x-6">
                    <a
                        href="https://facebook.com/bloodconnection_bob"
                        aria-label="Visit our Facebook"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Facebook
                            className="text-white hover:text-[#fb4673]"
                            size={24}
                        />
                    </a>
                    <a
                        href="https://twitter.com/bloodconnection_bob"
                        aria-label="Visit our Twitter"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Twitter
                            className="text-white hover:text-[#fb4673]"
                            size={24}
                        />
                    </a>
                    <a
                        href="https://instagram.com/bloodconnection_bob"
                        aria-label="Visit our Instagram"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Instagram
                            className="text-white hover:text-[#fb4673]"
                            size={24}
                        />
                    </a>
                    <a
                        href="https://linkedin.com/bloodconnection_bob"
                        aria-label="Visit our Linkedin"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Linkedin
                            className="text-white hover:text-[#fb4673]"
                            size={24}
                        />
                    </a>
                </div>

                {/* Newsletter Subscription */}
                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-[#28bca9]">
                        Get Updates & Emergency Alerts
                    </h2>
                    <p className="text-sm text-gray-200 mt-1">
                        Stay informed with the latest news, articles, and urgent blood donation alerts.
                    </p>
                    <form
                        onSubmit={handleSubscribe}
                        className="mt-3 flex justify-center"
                    >
                        <input
                            type="email"
                            name="email"
                            aria-label="Email for news and emergency alerts"
                            placeholder="Enter your email"
                            className="px-4 py-2 w-64 rounded-l-md focus:outline-none bg-white text-black"
                        />
                        <button
                            type="submit"
                            aria-label="Subscribe to news and emergency alerts"
                            className="bg-[#fb4673] hover:bg-[#28bca9] px-4 py-2 rounded-r-md cursor-pointer"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
                <br />

                {/* Copyright */}
                <p className="mt-6 text-gray-400">
                    &copy; {new Date().getFullYear()} BloodConnection. All Rights
                    Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
