"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, HeartPulse, Sparkles } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const NavItem = ({ to, label, icon: Icon }) => {
        const isActive = pathname === to;

        return (
            <Link
                to={to}
                onClick={() => setIsOpen(false)}
                className="group relative"
            >
                <motion.div
                    className={`flex items-center px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                        isActive
                            ? "text-red-400 bg-white/10 backdrop-blur-sm"
                            : "text-white/90 hover:text-white hover:bg-white/5"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {Icon && <Icon className="w-4 h-4 mr-2" />}
                    {label}
                    {isActive && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-xl border border-red-400/30"
                            initial={false}
                            transition={{
                                type: "spring",
                                bounce: 0.2,
                                duration: 0.6,
                            }}
                        />
                    )}
                </motion.div>
            </Link>
        );
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
                scrolled
                    ? "bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-2xl"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center py-4">
                {/* Logo */}
                <Link to="/" className="group flex items-center">
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <HeartPulse className="w-8 h-8 text-red-500 drop-shadow-lg" />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                            }}
                            className="absolute inset-0 bg-red-500/20 rounded-full blur-md"
                        />
                    </motion.div>
                    <div className="ml-3">
                        <motion.span
                            className="text-2xl font-bold bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent"
                            whileHover={{ scale: 1.05 }}
                        >
                            BloodConnection
                        </motion.span>
                        <div className="flex items-center">
                            <Sparkles className="w-3 h-3 text-yellow-400 mr-1" />
                            <span className="text-xs text-white/60">
                                Saving Lives
                            </span>
                        </div>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-2">
                    <NavItem to="/user-dashboard" label="Dashboard" />
                    <NavItem to="/about" label="About" />
                    <NavItem to="/contact" label="Contact" />
                    <NavItem to="/events" label="Events" />

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            to="/find-donor"
                            className="ml-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-red-500/25 transition-all duration-300 border border-red-400/50"
                        >
                            Find Donor
                        </Link>
                    </motion.div>
                </div>

                {/* Mobile Menu Toggle */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="md:hidden relative w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X className="w-5 h-5 text-white" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Menu className="w-5 h-5 text-white" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10"
                    >
                        <div className="px-6 py-4 space-y-2">
                            <NavItem to="/user-dashboard" label="Dashboard" />
                            <NavItem to="/about" label="About" />
                            <NavItem to="/contact" label="Contact" />
                            <NavItem to="/events" label="Events" />
                            <motion.div
                                whileTap={{ scale: 0.95 }}
                                className="pt-2"
                            >
                                <Link
                                    to="/find-donor"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl font-semibold text-center shadow-lg"
                                >
                                    Find Donor
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
