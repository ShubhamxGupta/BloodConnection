"use client";

import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, useInView } from "framer-motion";
import Chatbot from "../Components/ChatBot";
import {
    User,
    MapPin,
    Droplets,
    Hospital,
    Mail,
    Star,
    LogOut,
    Heart,
    Shield,
    Users,
    Navigation,
} from "lucide-react";

const UserDashboard = () => {
    const [hospitals, setHospitals] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState({ user: true, hospitals: true });
    const [errors, setErrors] = useState({ user: null, hospitals: null });
    const [showAllHospitals, setShowAllHospitals] = useState(false);
    const [toastShown, setToastShown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                const userResponse = await fetch(
                    "http://localhost:5000/api/users/profile",
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            ...(token && { Authorization: `Bearer ${token}` }),
                        },
                    }
                );

                if (userResponse.status === 500) {
                    throw new Error("Server error - Please try again later");
                }
                if (userResponse.status === 401) {
                    throw new Error("Please login to continue");
                }
                if (!userResponse.ok) {
                    throw new Error(
                        `Request failed with status: ${userResponse.status}`
                    );
                }

                const userData = await userResponse.json();
                setUser(userData);
                setErrors((prev) => ({ ...prev, user: null }));
            } catch (err) {
                setErrors((prev) => ({ ...prev, user: err.message }));
                console.error("User data fetch error:", err);
            } finally {
                setLoading((prev) => ({ ...prev, user: false }));
            }
        };

        const fetchHospitals = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    "http://localhost:5000/api/hospitals",
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            ...(token && { Authorization: `Bearer ${token}` }),
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch hospitals: ${response.status}`
                    );
                }
                const data = await response.json();
                setHospitals(Array.isArray(data) ? data : []);
                setErrors((prev) => ({ ...prev, hospitals: null }));
            } catch (err) {
                setErrors((prev) => ({ ...prev, hospitals: err.message }));
                console.error("Hospitals fetch error:", err);
            } finally {
                setLoading((prev) => ({ ...prev, hospitals: false }));
            }
        };

        fetchUserData();
        fetchHospitals();
    }, []);

    useEffect(() => {
        if (!loading.user && user && !errors.user && !toastShown) {
            toast.success("Successfully logged in!", {
                duration: 3000,
                style: {
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "white",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.2)",
                },
            });
            setToastShown(true);
        }
    }, [loading.user, user, errors.user, toastShown]);

    const filteredHospitals = () => {
        if (!user || !user.location || !user.location.city) return [];
        if (showAllHospitals) return hospitals;
        return hospitals.filter(
            (hospital) =>
                hospital.location?.city?.toLowerCase() ===
                user.location.city.toLowerCase()
        );
    };

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        try {
            await fetch("http://localhost:5000/api/auth/logout/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });
        } catch (err) {
            // Optionally show error
        } finally {
            localStorage.removeItem("token");
            navigate("/login");
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

    if (loading.user || loading.hospitals) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
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
                        className="w-16 h-16 border-4 border-white/20 border-t-blue-500 rounded-full mx-auto mb-4"
                    />
                    <p className="text-white text-xl">
                        Loading your dashboard...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.2),transparent_50%)]" />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
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
                {/* Logout Button */}
                <div className="absolute top-24 right-6 z-20">
                    <motion.button
                        onClick={handleLogout}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-4 py-2 bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-400 rounded-xl font-semibold hover:bg-red-500/30 transition-all duration-300"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </motion.button>
                </div>

                {/* Error Messages */}
                {(errors.user || errors.hospitals) && (
                    <AnimatedSection>
                        <div className="max-w-4xl mx-auto px-6 mb-8">
                            {errors.user && (
                                <div className="mb-4 p-4 bg-red-500/20 border border-red-400/30 rounded-2xl text-red-400">
                                    {errors.user}
                                </div>
                            )}
                            {errors.hospitals && (
                                <div className="mb-4 p-4 bg-red-500/20 border border-red-400/30 rounded-2xl text-red-400">
                                    {errors.hospitals}
                                </div>
                            )}
                        </div>
                    </AnimatedSection>
                )}

                {/* User Welcome Section */}
                {user && (
                    <AnimatedSection>
                        <div className="max-w-7xl mx-auto px-6 mb-12">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                duration: 20,
                                                repeat: Number.POSITIVE_INFINITY,
                                                ease: "linear",
                                            }}
                                            className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg"
                                        >
                                            <User className="w-10 h-10 text-white" />
                                        </motion.div>
                                        <div>
                                            <h2 className="text-4xl font-bold text-white mb-2">
                                                Welcome, {user.name}!
                                            </h2>
                                            <div className="flex items-center text-white/80">
                                                <MapPin className="w-5 h-5 text-blue-400 mr-2" />
                                                <span className="text-lg">
                                                    {user?.location?.city &&
                                                    user?.location?.state
                                                        ? `${user.location.city}, ${user.location.state}`
                                                        : "Location Unknown"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center justify-end mb-2">
                                            <Droplets className="w-6 h-6 text-red-400 mr-2" />
                                            <span className="text-3xl font-bold text-white">
                                                {user.bloodGroup}
                                            </span>
                                        </div>
                                        <div className="text-white/70">
                                            Your Blood Type
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </AnimatedSection>
                )}

                {/* Quick Stats */}
                <AnimatedSection delay={0.2}>
                    <div className="max-w-7xl mx-auto px-6 mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center hover:bg-white/20 transition-all duration-500"
                            >
                                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Hospital className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-white mb-2">
                                    {hospitals.length}
                                </div>
                                <div className="text-white/70">
                                    Total Hospitals
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center hover:bg-white/20 transition-all duration-500"
                            >
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Navigation className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-white mb-2">
                                    {filteredHospitals().length}
                                </div>
                                <div className="text-white/70">
                                    Nearby Hospitals
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center hover:bg-white/20 transition-all duration-500"
                            >
                                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Heart className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-white mb-2">
                                    24/7
                                </div>
                                <div className="text-white/70">
                                    Emergency Support
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* Hospitals Section Header */}
                <AnimatedSection delay={0.4}>
                    <div className="max-w-7xl mx-auto px-6 mb-8">
                        <div className="flex flex-col sm:flex-row justify-between items-center">
                            <h1 className="text-4xl font-bold text-white mb-4 sm:mb-0 flex items-center">
                                <Hospital className="w-8 h-8 text-blue-400 mr-3" />
                                {showAllHospitals
                                    ? "All Hospitals"
                                    : "Nearby Hospitals"}
                            </h1>
                            <motion.button
                                onClick={() =>
                                    setShowAllHospitals(!showAllHospitals)
                                }
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center"
                            >
                                <Users className="w-5 h-5 mr-2" />
                                {showAllHospitals
                                    ? "Show Nearby Only"
                                    : "Show All Hospitals"}
                            </motion.button>
                        </div>
                    </div>
                </AnimatedSection>

                {/* Hospitals Grid */}
                <AnimatedSection delay={0.6}>
                    <div className="max-w-7xl mx-auto px-6">
                        {filteredHospitals().length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center"
                            >
                                <div className="w-20 h-20 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Hospital className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">
                                    No Hospitals Found
                                </h3>
                                <p className="text-white/70 text-lg">
                                    {showAllHospitals
                                        ? "No hospitals are currently available in our network."
                                        : "No hospitals found in your city. Try viewing all hospitals."}
                                </p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredHospitals().map((hospital, index) => (
                                    <HospitalCard
                                        key={hospital._id}
                                        hospital={hospital}
                                        userLocation={user?.location}
                                        index={index}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </AnimatedSection>

                {/* Chatbot */}
                <div className="fixed bottom-4 right-4 z-50">
                    <Chatbot />
                </div>
            </div>
        </div>
    );
};

const coordinatesCache = new Map();

const getCoordinates = async (city, state) => {
    const locationKey = `${city},${state}`;
    if (coordinatesCache.has(locationKey)) {
        return coordinatesCache.get(locationKey);
    }

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
                city
            )}&state=${encodeURIComponent(
                state
            )}&country=india&format=json&limit=1`
        );
        const data = await response.json();

        if (data && data[0]) {
            const coords = {
                lat: Number.parseFloat(data[0].lat),
                lng: Number.parseFloat(data[0].lon),
            };
            coordinatesCache.set(locationKey, coords);
            return coords;
        }
        return null;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
};

const calculateDistance = async (location1, location2) => {
    try {
        if (!location1?.city || !location2?.city) return "N/A";

        const coords1 = await getCoordinates(location1.city, location1.state);
        const coords2 = await getCoordinates(location2.city, location2.state);

        if (!coords1 || !coords2) return "N/A";

        const R = 6371;
        const dLat = ((coords2.lat - coords1.lat) * Math.PI) / 180;
        const dLon = ((coords2.lng - coords1.lng) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((coords1.lat * Math.PI) / 180) *
                Math.cos((coords2.lat * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return Math.round(distance);
    } catch (error) {
        console.error("Error calculating distance:", error);
        return "N/A";
    }
};

const HospitalCard = ({ hospital, userLocation, index }) => {
    const [distance, setDistance] = useState("...");

    useEffect(() => {
        calculateDistance(userLocation, hospital.location).then((dist) =>
            setDistance(dist)
        );
    }, [hospital.location, userLocation]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -10 }}
        >
            <Link to={`/hospital/${hospital._id}`}>
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all duration-500 shadow-2xl relative overflow-hidden">
                    {/* Background Medical Icon */}
                    <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                        <svg
                            viewBox="0 0 24 24"
                            fill="#3b82f6"
                            className="w-full h-full"
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center mb-4">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.8 }}
                                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg"
                            >
                                <Hospital className="w-6 h-6 text-white" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-white">
                                {hospital.hospitalName}
                            </h2>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center text-white/80">
                                <MapPin className="w-5 h-5 text-blue-400 mr-3" />
                                <span>
                                    {hospital.location?.city},{" "}
                                    {hospital.location?.state}
                                </span>
                            </div>

                            <div className="flex items-center text-white/80">
                                <Mail className="w-5 h-5 text-emerald-400 mr-3" />
                                <span className="truncate">
                                    {hospital.email}
                                </span>
                            </div>

                            <div className="flex items-center text-white/80">
                                <Shield className="w-5 h-5 text-purple-400 mr-3" />
                                <span>
                                    Reg. No: {hospital.registrationNumber}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <div className="flex items-center text-white/70">
                                    <Navigation className="w-4 h-4 text-blue-400 mr-2" />
                                    <span className="text-sm">
                                        Distance:{" "}
                                        {distance === "N/A"
                                            ? "Unknown"
                                            : `${distance} km`}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                    <span className="text-white/70 text-sm">
                                        4.5
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default UserDashboard;
