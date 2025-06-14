"use client";

import {
    motion,
    useScroll,
    useTransform,
    useMotionValue,
    useSpring,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
    LogIn,
    UserPlus,
    AlertCircle,
    Heart,
    ArrowRight,
    Sparkles,
    Shield,
    Users,
} from "lucide-react";
import { useEffect, useRef, useCallback } from "react";

const HeroSection = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 300], [0, -50]);
    const y2 = useTransform(scrollY, [0, 300], [0, -100]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    // Use motion values for mouse position to prevent re-renders
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Add spring animation to smooth out mouse movement
    const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
    const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

    const heroRef = useRef(null);

    // Optimize mouse move handler with useCallback and throttling
    const handleMouseMove = useCallback(
        (e) => {
            if (!heroRef.current) return;

            const rect = heroRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            mouseX.set(x);
            mouseY.set(y);
        },
        [mouseX, mouseY]
    );

    useEffect(() => {
        const heroElement = heroRef.current;
        if (!heroElement) return;

        // Add event listener to the hero section only, not the entire window
        heroElement.addEventListener("mousemove", handleMouseMove, {
            passive: true,
        });

        return () => {
            heroElement.removeEventListener("mousemove", handleMouseMove);
        };
    }, [handleMouseMove]);

    const AnimatedText = ({ children, delay = 0 }) => (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );

    const FloatingElement = ({ children, delay = 0, duration = 3 }) => (
        <motion.div
            animate={{
                y: [-10, 10, -10],
                rotate: [-2, 2, -2],
            }}
            transition={{
                duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay,
            }}
        >
            {children}
        </motion.div>
    );

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden"
        >
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.2),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,107,107,0.2),transparent_50%)]" />
            </div>

            {/* Floating Particles - Memoized to prevent re-renders */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white/20 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [-20, -100, -20],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Mouse Follower - Now uses motion values */}
            <motion.div
                className="fixed w-96 h-96 rounded-full bg-gradient-to-r from-red-500/10 to-purple-500/10 blur-3xl pointer-events-none z-0"
                style={{
                    x: springX,
                    y: springY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between min-h-screen pt-20">
                {/* Left Content */}
                <motion.div
                    className="md:w-1/2 text-center md:text-left"
                    style={{ y: y1, opacity }}
                >
                    <AnimatedText>
                        <motion.div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                            <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
                            <span className="text-white/90 text-sm font-medium">
                                Save Lives Today
                            </span>
                        </motion.div>
                    </AnimatedText>

                    <AnimatedText delay={0.2}>
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                            <span className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                                Donate Blood,
                            </span>
                            <br />
                            <motion.span
                                className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent"
                                animate={{
                                    backgroundPosition: [
                                        "0% 50%",
                                        "100% 50%",
                                        "0% 50%",
                                    ],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Number.POSITIVE_INFINITY,
                                }}
                            >
                                Save Lives
                            </motion.span>
                        </h1>
                    </AnimatedText>

                    <AnimatedText delay={0.4}>
                        <p className="text-xl text-white/80 mb-8 leading-relaxed">
                            Every drop counts! Join our mission to connect
                            heroes with those in need.
                            <span className="text-red-400 font-semibold">
                                {" "}
                                Make a difference today.
                            </span>
                        </p>
                    </AnimatedText>

                    {/* Action Buttons */}
                    <AnimatedText delay={0.6}>
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <Link
                                to="/login"
                                className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/25 hover:scale-105"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                                <div className="relative flex items-center justify-center">
                                    <LogIn className="mr-2 w-5 h-5" />
                                    Login
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>

                            <Link
                                to="/signup"
                                className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105"
                            >
                                <UserPlus className="mr-2 w-5 h-5" />
                                Sign Up
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                to="/donate"
                                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/25 hover:scale-105"
                            >
                                <Heart className="mr-2 w-5 h-5" />
                                Donate Now
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </AnimatedText>

                    {/* Emergency Button */}
                    <AnimatedText delay={0.8}>
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                boxShadow: [
                                    "0 0 0 0 rgba(239, 68, 68, 0.7)",
                                    "0 0 0 10px rgba(239, 68, 68, 0)",
                                    "0 0 0 0 rgba(239, 68, 68, 0)",
                                ],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                            }}
                        >
                            <Link
                                to="/emergency"
                                className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-red-500/50 transition-all duration-300 border border-red-400/50"
                            >
                                <AlertCircle className="mr-2 w-5 h-5 animate-pulse" />
                                Emergency Blood Request
                            </Link>
                        </motion.div>
                    </AnimatedText>
                </motion.div>

                {/* Right Content - Stats & Visual */}
                <motion.div
                    className="md:w-1/2 mt-10 md:mt-0 flex justify-center"
                    style={{ y: y2 }}
                >
                    <div className="relative">
                        {/* Main Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
                        >
                            <div className="text-center mb-6">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 20,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "linear",
                                    }}
                                    className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <Heart className="w-10 h-10 text-white" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Lives Saved
                                </h3>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 2, delay: 1 }}
                                    className="text-4xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent"
                                >
                                    10,000+
                                </motion.p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <FloatingElement delay={0.2}>
                                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
                                        <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                        <p className="text-white/80 text-sm">
                                            Active Donors
                                        </p>
                                        <p className="text-xl font-bold text-white">
                                            5,000+
                                        </p>
                                    </div>
                                </FloatingElement>

                                <FloatingElement delay={0.4}>
                                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
                                        <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                        <p className="text-white/80 text-sm">
                                            Hospitals
                                        </p>
                                        <p className="text-xl font-bold text-white">
                                            200+
                                        </p>
                                    </div>
                                </FloatingElement>
                            </div>
                        </motion.div>

                        {/* Floating Elements */}
                        <FloatingElement delay={0.5} duration={4}>
                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                        </FloatingElement>

                        <FloatingElement delay={1} duration={5}>
                            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                        </FloatingElement>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
                >
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                        }}
                        className="w-1 h-3 bg-white/50 rounded-full mt-2"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
