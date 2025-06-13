import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, HeartPulse } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation();

    const NavItem = ({ to, label }) => {
        const isActive = pathname === to;

        return (
            <Link
                to={to}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-semibold transition duration-300 pb-1 ${
                    isActive
                        ? "text-[#B3404A] border-b-2 border-b-[#B3404A]"
                        : "text-[#fc4848] hover:text-[#d13636] border-b-2 border-b-transparent hover:border-b-[#d13636]"
                }`}
            >
                {label}
            </Link>
        );
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-lg shadow-lg">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center py-4">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center text-white text-2xl font-bold"
                >
                    <HeartPulse className="mr-2 text-[#fb4673] drop-shadow-[0_0_2px_#ff7c7c]" />
                    <span className="text-[#28bca9] drop-shadow-[0_0_1.5px_#2ee8d5]">
                        BloodConnection
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-8 drop-shadow-[0_0_2px_#ff7c7c]">
                    <NavItem to="/user-dashboard" label="Home" />
                    <NavItem to="/about" label="About" />
                    <NavItem to="/contact" label="Contact" />
                    <NavItem to="/events" label="Events" />

                    <Link to="/find-donor">
                        <button className="ml-4 bg-[#fb4673] hover:bg-[#28bca9] text-white px-4 py-2 rounded-lg transition duration-300">
                            Find Donor
                        </button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white"
                    aria-label="Toggle navigation menu"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={30} /> : <Menu size={30} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="md:hidden bg-white/10 backdrop-blur-lg text-white flex flex-col items-center space-y-4 py-4 drop-shadow-[0_0_2px_#ff7c7c]"
                >
                    <NavItem to="/user-dashboard" label="Home" />
                    <NavItem to="/about" label="About" />
                    <NavItem to="/contact" label="Contact" />
                    <NavItem to="/events" label="Events" />
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;
