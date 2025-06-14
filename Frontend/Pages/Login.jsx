"use client";

import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Heart,
    Shield,
    User,
    Building,
} from "lucide-react";
import { useState } from "react";

const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

const Login = () => {
    const [userType, setUserType] = useState("user");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const endpoint =
                userType === "user" ? "login/user" : "login/hospital";
            const response = await fetch(
                `http://localhost:5000/api/auth/${endpoint}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );
            let result;
            try {
                result = await response.json();
            } catch (jsonErr) {
                result = { message: "Login failed. Please try again." };
            }
            if (!response.ok) {
                throw new Error(result.message || "Login failed");
            }

            localStorage.setItem("token", result.token);
            localStorage.setItem("userType", userType);
            localStorage.setItem("userName", result.userName);

            toast.success("Login successful!", {
                duration: 3000,
                style: {
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "white",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.2)",
                },
            });

            if (userType === "user") {
                navigate("/user-dashboard");
            } else {
                navigate("/hospital-dashboard");
            }
        } catch (err) {
            console.error("Error:", err.message);
            toast.error(err.message || "Something went wrong", {
                duration: 4000,
                style: {
                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                    color: "white",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.2)",
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,107,0.2),transparent_50%)]" />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden">
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

            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 20,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                            }}
                            className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                        >
                            <Heart className="w-8 h-8 text-white" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-white/70">
                            Sign in to continue saving lives
                        </p>
                    </div>

                    {/* User Type Selection */}
                    <div className="flex mb-8 bg-white/5 backdrop-blur-sm rounded-2xl p-1 border border-white/10">
                        <motion.button
                            type="button"
                            onClick={() => setUserType("user")}
                            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                                userType === "user"
                                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                                    : "text-white/70 hover:text-white"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <User className="w-4 h-4 mr-2" />
                            User
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={() => setUserType("hospital")}
                            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                                userType === "hospital"
                                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                                    : "text-white/70 hover:text-white"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Building className="w-4 h-4 mr-2" />
                            Hospital
                        </motion.button>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Email Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <label className="flex items-center text-white/90 font-medium mb-2">
                                <Mail className="w-4 h-4 mr-2 text-red-400" />
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    disabled={isLoading}
                                    autoComplete="email"
                                    type="email"
                                    {...register("email")}
                                    className={`w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300 ${
                                        isLoading
                                            ? "opacity-70 cursor-not-allowed"
                                            : ""
                                    }`}
                                    placeholder="Enter your email"
                                />
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/0 via-red-500/0 to-red-500/0 opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
                            </div>
                            <AnimatePresence>
                                {errors.email && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-400 text-sm mt-2 flex items-center"
                                    >
                                        <Shield className="w-3 h-3 mr-1" />
                                        {errors.email.message}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Password Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label className="flex items-center text-white/90 font-medium mb-2">
                                <Lock className="w-4 h-4 mr-2 text-red-400" />
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                    {...register("password")}
                                    className={`w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300 pr-12 ${
                                        isLoading
                                            ? "opacity-70 cursor-not-allowed"
                                            : ""
                                    }`}
                                    placeholder="Enter your password"
                                />
                                <motion.button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </motion.button>
                            </div>
                            <AnimatePresence>
                                {errors.password && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-400 text-sm mt-2 flex items-center"
                                    >
                                        <Shield className="w-3 h-3 mr-1" />
                                        {errors.password.message}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Remember Me & Forgot Password */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex justify-between items-center"
                        >
                            <label className="flex items-center text-white/70 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register("rememberMe")}
                                    className="w-4 h-4 text-red-500 bg-white/10 border-white/20 rounded focus:ring-red-500 focus:ring-2 mr-2"
                                />
                                Remember me
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </motion.div>

                        {/* Login Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-gradient-to-r ${
                                userType === "user"
                                    ? "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                                    : "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                            } text-white py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center border border-white/20`}
                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            {isLoading ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 1,
                                            repeat: Number.POSITIVE_INFINITY,
                                            ease: "linear",
                                        }}
                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                                    />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    <Heart className="w-5 h-5 mr-2" />
                                    Sign In
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Signup Link */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center mt-8"
                    >
                        <p className="text-white/70">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className={`text-red-400 hover:text-red-300 font-semibold transition-colors ${
                                    isLoading
                                        ? "pointer-events-none opacity-70"
                                        : ""
                                }`}
                            >
                                Create Account
                            </Link>
                        </p>
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 30,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                    }}
                    className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-80"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                        duration: 25,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                    }}
                    className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-80"
                />
            </motion.div>
        </div>
    );
};

export default Login;
