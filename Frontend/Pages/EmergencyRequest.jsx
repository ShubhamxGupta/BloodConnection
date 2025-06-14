"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    AlertTriangle,
    User,
    Phone,
    Droplets,
    MapPin,
    Hospital,
    Clock,
    Shield,
    Heart,
} from "lucide-react";

const EmergencyRequest = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        bloodGroup: "",
        units: "",
        hospital: "",
        location: {
            city: "",
            state: "",
        },
    });

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const response = await fetch("http://ip-api.com/json");
                const data = await response.json();
                if (data.status === "success") {
                    setFormData((prev) => ({
                        ...prev,
                        location: {
                            city: data.city,
                            state: data.regionName,
                        },
                    }));
                }
            } catch (error) {
                console.error("Error fetching location:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLocation();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch(
                "http://localhost:5000/api/emergency",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to submit emergency request");
            }

            const data = await response.json();
            navigate("/emergency/success", {
                state: {
                    location: formData.location,
                    bloodGroup: formData.bloodGroup,
                    requestId: data.requestId,
                },
            });
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setSubmitting(false);
        }
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

    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                        className="w-16 h-16 border-4 border-white/20 border-t-red-500 rounded-full mx-auto mb-4"
                    />
                    <p className="text-white text-xl">
                        Detecting your location...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.4),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(220,38,38,0.3),transparent_50%)]" />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-red-400/30 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [-20, -100, -20],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 pt-32 pb-20">
                {/* Hero Section */}
                <AnimatedSection>
                    <div className="text-center px-6 max-w-4xl mx-auto mb-20">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="inline-flex items-center px-6 py-3 bg-red-500/20 backdrop-blur-sm rounded-full border border-red-400/30 mb-8"
                        >
                            <AlertTriangle className="w-5 h-5 text-red-400 mr-2 animate-pulse" />
                            <span className="text-white/90 font-medium">
                                Emergency Request
                            </span>
                        </motion.div>

                        <h1 className="text-6xl md:text-8xl font-bold mb-8">
                            <span className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                                Emergency
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
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                }}
                            >
                                Blood Request
                            </motion.span>
                        </h1>

                        <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
                            Need blood urgently? Submit your emergency request
                            and we'll notify all nearby hospitals and donors
                            immediately.
                        </p>
                    </div>
                </AnimatedSection>

                {/* Emergency Stats */}
                <AnimatedSection delay={0.2}>
                    <div className="max-w-4xl mx-auto px-6 mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: Clock,
                                    title: "Response Time",
                                    value: "< 30 mins",
                                    color: "from-blue-500 to-blue-600",
                                },
                                {
                                    icon: Hospital,
                                    title: "Partner Hospitals",
                                    value: "200+",
                                    color: "from-emerald-500 to-emerald-600",
                                },
                                {
                                    icon: Heart,
                                    title: "Success Rate",
                                    value: "95%",
                                    color: "from-red-500 to-red-600",
                                },
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1,
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center hover:bg-white/20 transition-all duration-500"
                                >
                                    <motion.div
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.8 }}
                                        className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                                    >
                                        <stat.icon className="w-8 h-8 text-white" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {stat.value}
                                    </h3>
                                    <p className="text-white/80">
                                        {stat.title}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </AnimatedSection>

                {/* Emergency Form */}
                <AnimatedSection delay={0.4}>
                    <div className="max-w-3xl mx-auto px-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="bg-white/10 backdrop-blur-xl border border-red-400/30 rounded-3xl p-8 shadow-2xl"
                        >
                            <div className="text-center mb-8">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
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
                                    className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                                >
                                    <AlertTriangle className="w-10 h-10 text-white" />
                                </motion.div>
                                <h2 className="text-3xl font-bold text-white mb-2">
                                    Submit Emergency Request
                                </h2>
                                <p className="text-white/70">
                                    Fill out the form below and we'll alert
                                    nearby hospitals immediately
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Full Name */}
                                    <div>
                                        <label className="flex items-center text-white/90 font-medium mb-2">
                                            <User className="w-4 h-4 mr-2 text-red-400" />
                                            Patient Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300"
                                            placeholder="Enter patient's full name"
                                            disabled={submitting}
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="flex items-center text-white/90 font-medium mb-2">
                                            <Phone className="w-4 h-4 mr-2 text-red-400" />
                                            Contact Number
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    phone: e.target.value,
                                                })
                                            }
                                            className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300"
                                            placeholder="Enter contact number"
                                            disabled={submitting}
                                        />
                                    </div>

                                    {/* Blood Group */}
                                    <div>
                                        <label className="flex items-center text-white/90 font-medium mb-2">
                                            <Droplets className="w-4 h-4 mr-2 text-red-400" />
                                            Blood Group Needed
                                        </label>
                                        <select
                                            required
                                            value={formData.bloodGroup}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    bloodGroup: e.target.value,
                                                })
                                            }
                                            className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300"
                                            disabled={submitting}
                                        >
                                            <option
                                                value=""
                                                className="bg-slate-800"
                                            >
                                                Select Blood Group
                                            </option>
                                            {bloodGroups.map((group) => (
                                                <option
                                                    key={group}
                                                    value={group}
                                                    className="bg-slate-800"
                                                >
                                                    {group}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Units Required */}
                                    <div>
                                        <label className="flex items-center text-white/90 font-medium mb-2">
                                            <Droplets className="w-4 h-4 mr-2 text-red-400" />
                                            Units Required
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            max="10"
                                            value={formData.units}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    units: e.target.value,
                                                })
                                            }
                                            className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300"
                                            placeholder="Number of units needed"
                                            disabled={submitting}
                                        />
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label className="flex items-center text-white/90 font-medium mb-2">
                                            <MapPin className="w-4 h-4 mr-2 text-red-400" />
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={formData.location.city}
                                            className="w-full p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white/70 cursor-not-allowed"
                                        />
                                    </div>

                                    {/* State */}
                                    <div>
                                        <label className="flex items-center text-white/90 font-medium mb-2">
                                            <MapPin className="w-4 h-4 mr-2 text-red-400" />
                                            State
                                        </label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={formData.location.state}
                                            className="w-full p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white/70 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                {/* Hospital Name */}
                                <div>
                                    <label className="flex items-center text-white/90 font-medium mb-2">
                                        <Hospital className="w-4 h-4 mr-2 text-red-400" />
                                        Hospital Name (if admitted)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.hospital}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                hospital: e.target.value,
                                            })
                                        }
                                        className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300"
                                        placeholder="Enter hospital name (optional)"
                                        disabled={submitting}
                                    />
                                </div>

                                {/* Emergency Notice */}
                                <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-2xl p-6">
                                    <div className="flex items-start">
                                        <Shield className="w-6 h-6 text-red-400 mr-3 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-lg font-semibold text-white mb-2">
                                                Emergency Protocol
                                            </h4>
                                            <ul className="text-white/80 space-y-1 text-sm">
                                                <li>
                                                    • All nearby hospitals will
                                                    be notified immediately
                                                </li>
                                                <li>
                                                    • You will receive calls
                                                    within 30 minutes
                                                </li>
                                                <li>
                                                    • Keep your phone available
                                                    for hospital coordination
                                                </li>
                                                <li>
                                                    • Have patient ID and
                                                    medical records ready
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={submitting}
                                    whileHover={{
                                        scale: submitting ? 1 : 1.02,
                                    }}
                                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                                >
                                    {submitting ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                    ease: "linear",
                                                }}
                                                className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
                                            />
                                            Submitting Emergency Request...
                                        </>
                                    ) : (
                                        <>
                                            <AlertTriangle className="w-6 h-6 mr-3" />
                                            Submit Emergency Request
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
};

export default EmergencyRequest;
