"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Clock,
    CheckCircle,
    AlertCircle,
    Phone,
    Hospital,
    Heart,
    ArrowRight,
} from "lucide-react";

const EmergencySuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
    const {
        bloodGroup,
        location: userLocation,
        requestId,
    } = location.state || {};

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    navigate("/");
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const AnimatedSection = ({ children, delay = 0 }) => {
        const ref = useRef(null);
        const isInView = useInView(ref, { once: true, margin: "-100px" });

        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 50 }}
                animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ duration: 0.8, delay, ease: "easeOut" }}
            >
                {children}
            </motion.div>
        );
    };

    const steps = [
        {
            icon: CheckCircle,
            title: "Request Submitted",
            description:
                "Your emergency request has been sent to all nearby hospitals",
            status: "completed",
        },
        {
            icon: Hospital,
            title: "Hospitals Notified",
            description: "Medical facilities are checking blood availability",
            status: "in-progress",
        },
        {
            icon: Phone,
            title: "Contact Incoming",
            description: "Hospitals will call you within 30 minutes",
            status: "pending",
        },
        {
            icon: Heart,
            title: "Blood Arranged",
            description: "Coordinate with the hospital that contacts you",
            status: "pending",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.4),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(5,150,105,0.3),transparent_50%)]" />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-emerald-400/30 rounded-full"
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

            <div className="relative z-10 pt-32 pb-20">
                {/* Success Header */}
                <AnimatedSection>
                    <div className="text-center px-6 max-w-4xl mx-auto mb-20">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 20,
                                delay: 0.2,
                            }}
                            className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
                        >
                            <CheckCircle className="w-12 h-12 text-white" />
                        </motion.div>

                        <h1 className="text-6xl md:text-8xl font-bold mb-8">
                            <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
                                Request
                            </span>
                            <br />
                            <motion.span
                                className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent"
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
                                Submitted
                            </motion.span>
                        </h1>

                        <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
                            Your emergency blood request for{" "}
                            <span className="font-bold text-red-400">
                                {bloodGroup}
                            </span>{" "}
                            blood in{" "}
                            <span className="font-bold text-emerald-400">
                                {userLocation?.city}
                            </span>{" "}
                            has been successfully submitted.
                        </p>

                        {requestId && (
                            <div className="mt-6 inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                                <span className="text-white/70 text-sm">
                                    Request ID:{" "}
                                </span>
                                <span className="text-white font-mono ml-2">
                                    {requestId}
                                </span>
                            </div>
                        )}
                    </div>
                </AnimatedSection>

                {/* Countdown Timer */}
                <AnimatedSection delay={0.2}>
                    <div className="max-w-2xl mx-auto px-6 mb-12">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="bg-white/10 backdrop-blur-xl border border-emerald-400/30 rounded-3xl p-8 text-center shadow-2xl"
                        >
                            <div className="flex items-center justify-center mb-6">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 60,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "linear",
                                    }}
                                    className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4"
                                >
                                    <Clock className="w-8 h-8 text-white" />
                                </motion.div>
                                <div>
                                    <motion.div
                                        key={timeLeft}
                                        initial={{ scale: 1.1 }}
                                        animate={{ scale: 1 }}
                                        className="text-4xl font-bold text-white"
                                    >
                                        {formatTime(timeLeft)}
                                    </motion.div>
                                    <p className="text-white/70">
                                        Expected Response Time
                                    </p>
                                </div>
                            </div>
                            <p className="text-white/80 text-lg">
                                Hospitals will contact you within this
                                timeframe. Please keep your phone available.
                            </p>
                        </motion.div>
                    </div>
                </AnimatedSection>

                {/* Process Steps */}
                <AnimatedSection delay={0.4}>
                    <div className="max-w-4xl mx-auto px-6 mb-12">
                        <h2 className="text-3xl font-bold text-white text-center mb-12">
                            What Happens Next?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1,
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    className={`bg-white/10 backdrop-blur-xl border rounded-3xl p-6 text-center transition-all duration-500 ${
                                        step.status === "completed"
                                            ? "border-emerald-400/50 bg-emerald-500/20"
                                            : step.status === "in-progress"
                                            ? "border-blue-400/50 bg-blue-500/20"
                                            : "border-white/20"
                                    }`}
                                >
                                    <motion.div
                                        animate={
                                            step.status === "in-progress"
                                                ? { rotate: 360 }
                                                : step.status === "completed"
                                                ? { scale: [1, 1.1, 1] }
                                                : {}
                                        }
                                        transition={
                                            step.status === "in-progress"
                                                ? {
                                                      duration: 2,
                                                      repeat: Number.POSITIVE_INFINITY,
                                                      ease: "linear",
                                                  }
                                                : step.status === "completed"
                                                ? {
                                                      duration: 2,
                                                      repeat: Number.POSITIVE_INFINITY,
                                                  }
                                                : {}
                                        }
                                        className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ${
                                            step.status === "completed"
                                                ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                                                : step.status === "in-progress"
                                                ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                                : "bg-gradient-to-r from-gray-500 to-gray-600"
                                        }`}
                                    >
                                        <step.icon className="w-8 h-8 text-white" />
                                    </motion.div>
                                    <h3 className="text-lg font-bold text-white mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-white/70 text-sm">
                                        {step.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </AnimatedSection>

                {/* Important Information */}
                <AnimatedSection delay={0.6}>
                    <div className="max-w-4xl mx-auto px-6 mb-12">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="bg-blue-500/20 backdrop-blur-xl border border-blue-400/30 rounded-3xl p-8"
                        >
                            <div className="flex items-start">
                                <AlertCircle className="w-8 h-8 text-blue-400 mr-4 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-4">
                                        Important Instructions
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-lg font-semibold text-white mb-2">
                                                While You Wait:
                                            </h4>
                                            <ul className="text-white/80 space-y-2">
                                                <li className="flex items-center">
                                                    <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
                                                    Keep your phone charged and
                                                    available
                                                </li>
                                                <li className="flex items-center">
                                                    <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
                                                    Have patient ID and medical
                                                    records ready
                                                </li>
                                                <li className="flex items-center">
                                                    <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
                                                    Stay near the patient or
                                                    hospital
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-white mb-2">
                                                When Hospitals Call:
                                            </h4>
                                            <ul className="text-white/80 space-y-2">
                                                <li className="flex items-center">
                                                    <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
                                                    Confirm blood type and units
                                                    needed
                                                </li>
                                                <li className="flex items-center">
                                                    <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
                                                    Ask about availability and
                                                    timing
                                                </li>
                                                <li className="flex items-center">
                                                    <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
                                                    Get directions to the
                                                    hospital
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </AnimatedSection>

                {/* Action Buttons */}
                <AnimatedSection delay={0.8}>
                    <div className="text-center px-6">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/")}
                                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center"
                            >
                                <ArrowRight className="w-5 h-5 mr-2" />
                                Go to Homepage
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/emergency")}
                                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                            >
                                <AlertCircle className="w-5 h-5 mr-2" />
                                New Request
                            </motion.button>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
};

export default EmergencySuccess;
