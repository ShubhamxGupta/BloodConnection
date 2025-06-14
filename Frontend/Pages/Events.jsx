"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
    Calendar,
    Clock,
    MapPin,
    Info,
    Users,
    Sparkles,
    AlertCircle,
} from "lucide-react";

const API_KEY = "AIzaSyD9wYUNE67azqMmYCUKQQ2ATfOopW8JFNk";
const CALENDAR_ID = "singh0810.akash@gmail.com";

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const now = new Date().toISOString();
                const response = await fetch(
                    `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${now}&singleEvents=true&orderBy=startTime`
                );
                if (!response.ok) {
                    let errorMsg = "Failed to fetch events";
                    try {
                        const errorData = await response.json();
                        if (errorData.error && errorData.error.message) {
                            errorMsg = errorData.error.message;
                        }
                    } catch {}
                    throw new Error(errorMsg);
                }
                const data = await response.json();
                setEvents(data.items || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

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
                    <p className="text-white text-xl">Loading events...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-md mx-auto"
                >
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Error Loading Events
                    </h2>
                    <p className="text-white/70">{error}</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,107,0.2),transparent_50%)]" />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
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

            <div className="relative z-10 pt-32 pb-20">
                {/* Hero Section */}
                <AnimatedSection>
                    <div className="text-center px-6 max-w-4xl mx-auto mb-20">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8"
                        >
                            <Calendar className="w-5 h-5 text-red-400 mr-2" />
                            <span className="text-white/90 font-medium">
                                Upcoming Events
                            </span>
                        </motion.div>

                        <h1 className="text-6xl md:text-8xl font-bold mb-8">
                            <span className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                                Blood Drive
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
                                Events
                            </motion.span>
                        </h1>

                        <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
                            Join our blood donation events and help save lives
                            in your community. Every event is an opportunity to
                            make a real difference.
                        </p>
                    </div>
                </AnimatedSection>

                {/* Events List */}
                <AnimatedSection delay={0.2}>
                    <div className="max-w-6xl mx-auto px-6">
                        {events.length > 0 ? (
                            <div className="space-y-8">
                                {events.map((event, index) => {
                                    const isAllDay = !event.start.dateTime;
                                    return (
                                        <motion.div
                                            key={event.id}
                                            initial={{
                                                opacity: 0,
                                                x: index % 2 === 0 ? -50 : 50,
                                            }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{
                                                duration: 0.8,
                                                delay: index * 0.1,
                                            }}
                                            whileHover={{ scale: 1.02, y: -5 }}
                                            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-500 shadow-2xl"
                                        >
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                                <div className="flex-grow">
                                                    <div className="flex items-start mb-6">
                                                        <motion.div
                                                            whileHover={{
                                                                rotate: 360,
                                                            }}
                                                            transition={{
                                                                duration: 0.8,
                                                            }}
                                                            className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg flex-shrink-0"
                                                        >
                                                            <Calendar className="w-8 h-8 text-white" />
                                                        </motion.div>
                                                        <div className="flex-grow">
                                                            <h3 className="text-3xl font-bold text-white mb-4">
                                                                {event.summary}
                                                            </h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="flex items-center text-white/80">
                                                                    <Calendar className="w-5 h-5 text-red-400 mr-3" />
                                                                    <span className="font-medium">
                                                                        {new Date(
                                                                            event
                                                                                .start
                                                                                .dateTime ||
                                                                                event
                                                                                    .start
                                                                                    .date
                                                                        ).toLocaleDateString(
                                                                            "en-US",
                                                                            {
                                                                                weekday:
                                                                                    "long",
                                                                                year: "numeric",
                                                                                month: "long",
                                                                                day: "numeric",
                                                                            }
                                                                        )}
                                                                    </span>
                                                                </div>

                                                                {!isAllDay && (
                                                                    <div className="flex items-center text-white/80">
                                                                        <Clock className="w-5 h-5 text-blue-400 mr-3" />
                                                                        <span className="font-medium">
                                                                            {new Date(
                                                                                event.start.dateTime
                                                                            ).toLocaleTimeString(
                                                                                "en-US",
                                                                                {
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit",
                                                                                }
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                )}

                                                                {event.location && (
                                                                    <div className="flex items-center text-white/80 md:col-span-2">
                                                                        <MapPin className="w-5 h-5 text-emerald-400 mr-3" />
                                                                        <span className="font-medium">
                                                                            {
                                                                                event.location
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {event.description && (
                                                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                                                            <div className="flex items-center mb-3">
                                                                <Info className="w-5 h-5 text-yellow-400 mr-2" />
                                                                <h4 className="text-lg font-semibold text-white">
                                                                    Event
                                                                    Details
                                                                </h4>
                                                            </div>
                                                            <p className="text-white/70 leading-relaxed">
                                                                {
                                                                    event.description
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-6 lg:mt-0 lg:ml-8 flex-shrink-0">
                                                    <motion.button
                                                        whileHover={{
                                                            scale: 1.05,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.95,
                                                        }}
                                                        className="w-full lg:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center"
                                                    >
                                                        <Users className="w-5 h-5 mr-2" />
                                                        Join Event
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 20,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "linear",
                                    }}
                                    className="w-20 h-20 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <Calendar className="w-10 h-10 text-white" />
                                </motion.div>
                                <h4 className="text-3xl font-bold text-white mb-4">
                                    No Upcoming Events
                                </h4>
                                <p className="text-white/70 text-lg">
                                    Stay tuned for upcoming blood donation
                                    events in your area. Follow us on social
                                    media for updates!
                                </p>
                            </motion.div>
                        )}
                    </div>
                </AnimatedSection>

                {/* Call to Action */}
                <AnimatedSection delay={0.4}>
                    <div className="text-center px-6 mt-20">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="bg-gradient-to-r from-red-500/20 via-purple-500/20 to-red-500/20 backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-4xl mx-auto"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 20,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear",
                                }}
                                className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
                            >
                                <Sparkles className="w-10 h-10 text-white" />
                            </motion.div>

                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Want to Host an Event?
                            </h2>
                            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Partner with us to organize blood donation
                                drives in your community. Together, we can save
                                more lives and make a bigger impact.
                            </p>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <a
                                    href="/contact"
                                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl text-lg font-semibold shadow-2xl hover:shadow-red-500/25 transition-all duration-300 border border-red-400/50"
                                >
                                    <Users className="w-5 h-5 mr-2" />
                                    Contact Us
                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Number.POSITIVE_INFINITY,
                                        }}
                                        className="ml-2"
                                    >
                                        →
                                    </motion.div>
                                </a>
                            </motion.div>
                        </motion.div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
};

export default Events;
