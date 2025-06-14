"use client";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    HeartPulse,
    Send,
    Sparkles,
    ArrowRight,
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
        alert("Thank you for subscribing!");
        e.target.reset();
    };

    const socialLinks = [
        {
            icon: Facebook,
            href: "https://facebook.com/bloodconnection_bob",
            label: "Facebook",
        },
        {
            icon: Twitter,
            href: "https://twitter.com/bloodconnection_bob",
            label: "Twitter",
        },
        {
            icon: Instagram,
            href: "https://instagram.com/bloodconnection_bob",
            label: "Instagram",
        },
        {
            icon: Linkedin,
            href: "https://linkedin.com/bloodconnection_bob",
            label: "LinkedIn",
        },
    ];

    const quickLinks = [
        { to: "/", label: "Home" },
        { to: "/about", label: "About Us" },
        { to: "/contact", label: "Contact Us" },
        { to: "/events", label: "Events" },
        { to: "/donate", label: "Donate" },
        { to: "/find-donor", label: "Find Donor" },
    ];

    return (
        <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.2),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,107,0.1),transparent_50%)]" />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/30 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [-10, -50, -10],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 2,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        {/* Logo & About Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-2"
                        >
                            <Link
                                to="/"
                                className="group flex items-center mb-6"
                            >
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.8 }}
                                    className="relative"
                                >
                                    <HeartPulse className="w-10 h-10 text-red-500 drop-shadow-lg" />
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{
                                            duration: 2,
                                            repeat: Number.POSITIVE_INFINITY,
                                        }}
                                        className="absolute inset-0 bg-red-500/20 rounded-full blur-md"
                                    />
                                </motion.div>
                                <div className="ml-4">
                                    <motion.span
                                        className="text-3xl font-bold bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        BloodConnection
                                    </motion.span>
                                    <div className="flex items-center">
                                        <Sparkles className="w-3 h-3 text-yellow-400 mr-1" />
                                        <span className="text-sm text-white/60">
                                            Saving Lives Together
                                        </span>
                                    </div>
                                </div>
                            </Link>
                            <p className="text-white/80 text-lg leading-relaxed mb-6 max-w-md">
                                Connecting heroes with those in need. Join our
                                mission to eliminate blood shortages and save
                                lives through technology and community
                                engagement.
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { number: "10K+", label: "Lives Saved" },
                                    { number: "5K+", label: "Donors" },
                                    { number: "200+", label: "Hospitals" },
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10"
                                    >
                                        <div className="text-xl font-bold text-red-400">
                                            {stat.number}
                                        </div>
                                        <div className="text-xs text-white/70">
                                            {stat.label}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quick Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                                <ArrowRight className="w-5 h-5 text-red-400 mr-2" />
                                Quick Links
                            </h3>
                            <ul className="space-y-3">
                                {quickLinks.map((link, index) => (
                                    <motion.li
                                        key={index}
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Link
                                            to={link.to}
                                            className="text-white/70 hover:text-red-400 transition-colors duration-300 flex items-center group"
                                        >
                                            <span className="w-2 h-2 bg-red-400/50 rounded-full mr-3 group-hover:bg-red-400 transition-colors" />
                                            {link.label}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                                <Phone className="w-5 h-5 text-red-400 mr-2" />
                                Contact Us
                            </h3>
                            <div className="space-y-4">
                                {[
                                    {
                                        icon: Mail,
                                        text: "support@bloodconnection.com",
                                        href: "mailto:support@bloodconnection.com",
                                    },
                                    {
                                        icon: Phone,
                                        text: "+91 1234567890",
                                        href: "tel:+911234567890",
                                    },
                                    {
                                        icon: MapPin,
                                        text: "123 Donation Street, Chennai, TN",
                                        href: "#",
                                    },
                                ].map((contact, index) => (
                                    <motion.a
                                        key={index}
                                        href={contact.href}
                                        whileHover={{ x: 5 }}
                                        className="flex items-center text-white/70 hover:text-red-400 transition-colors duration-300 group"
                                    >
                                        <div className="w-10 h-10 bg-white/5 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3 group-hover:bg-red-500/20 transition-colors">
                                            <contact.icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm">
                                            {contact.text}
                                        </span>
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Newsletter Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-12"
                    >
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center">
                                <Send className="w-6 h-6 text-red-400 mr-2" />
                                Stay Connected
                            </h2>
                            <p className="text-white/70">
                                Get updates on blood drives, emergency alerts,
                                and life-saving opportunities
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubscribe}
                            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                        >
                            <div className="flex-1 relative">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                    className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300"
                                    required
                                />
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/0 via-red-500/0 to-red-500/0 opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
                            </div>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center justify-center border border-red-400/50"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Subscribe
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Bottom Section */}
                    <div className="border-t border-white/10 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            {/* Social Media Links */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="flex space-x-4 mb-6 md:mb-0"
                            >
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Visit our ${social.label}`}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-12 h-12 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-red-500/20 hover:border-red-400/50 transition-all duration-300"
                                    >
                                        <social.icon className="w-5 h-5" />
                                    </motion.a>
                                ))}
                            </motion.div>

                            {/* Copyright */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="text-center md:text-right"
                            >
                                <p className="text-white/60 text-sm">
                                    &copy; {new Date().getFullYear()}{" "}
                                    BloodConnection. All Rights Reserved.
                                </p>
                                <p className="text-white/40 text-xs mt-1">
                                    Made with ❤️ for saving lives
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
