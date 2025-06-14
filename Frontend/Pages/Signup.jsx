"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    Mail,
    Lock,
    Phone,
    MapPin,
    Heart,
    Hospital,
    Shield,
    UserPlus,
    Eye,
    EyeOff,
    User,
    Building,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

const schema = yup.object().shape({
    name: yup.string().when("$userType", {
        is: "user",
        then: () => yup.string().required("Name is required"),
        otherwise: () => yup.string().nullable(),
    }),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup
        .string()
        .matches(/^[0-9]{10,15}$/, "Phone number must be 10-15 digits")
        .required("Phone number is required"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .required("Confirm password is required")
        .test("passwords-match", "Passwords must match", function (value) {
            return this.parent.password === value;
        }),
    location: yup.object().shape({
        city: yup.string().required("City is required"),
        state: yup.string().required("State is required"),
    }),
    bloodGroup: yup.string().when("$userType", {
        is: "user",
        then: () => yup.string().required("Blood group is required"),
        otherwise: () => yup.string().nullable(),
    }),
    hospitalName: yup.string().when("$userType", {
        is: "hospital",
        then: () => yup.string().required("Hospital name is required"),
        otherwise: () => yup.string().nullable(),
    }),
    registrationNumber: yup.string().when("$userType", {
        is: "hospital",
        then: () => yup.string().required("Registration number is required"),
        otherwise: () => yup.string().nullable(),
    }),
});

const Signup = () => {
    const [userType, setUserType] = useState("user");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
        setValue,
        watch,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { userType: "user" },
        context: { userType },
        mode: "onChange",
    });

    const watchedPassword = watch("password");

    // Reset form when userType changes
    React.useEffect(() => {
        reset();
        setStep(1);
    }, [userType, reset]);

    // Fetch location for user type
    useEffect(() => {
        const fetchLocation = async () => {
            try {
                if (userType === "user") {
                    const response = await fetch("http://ip-api.com/json");
                    const data = await response.json();
                    if (data.status === "success") {
                        setValue("location.city", data.city);
                        setValue("location.state", data.regionName);
                    }
                }
            } catch (error) {
                console.error("Error fetching location:", error);
            }
        };

        fetchLocation();
    }, [setValue, userType]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            if (data.password !== data.confirmPassword) {
                throw new Error("Passwords do not match");
            }

            const submitData = { ...data };
            delete submitData.confirmPassword;
            delete submitData.userType;

            if (userType === "user") {
                delete submitData.hospitalName;
                delete submitData.registrationNumber;
            } else {
                delete submitData.bloodGroup;
            }

            const endpoint =
                userType === "user" ? "register/user" : "register/hospital";
            const response = await fetch(
                `http://localhost:5000/api/auth/${endpoint}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(submitData),
                }
            );

            let responseData;
            try {
                responseData = await response.json();
            } catch (jsonErr) {
                responseData = { message: "Signup failed. Please try again." };
            }

            if (!response.ok) {
                throw new Error(responseData.message || "Signup failed");
            }

            toast.success(
                "Account created successfully! Please login to continue.",
                {
                    duration: 4000,
                    style: {
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        color: "white",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.2)",
                    },
                }
            );
            navigate("/login");
        } catch (err) {
            console.error("Error:", err.message);
            toast.error(err.message, {
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

    const nextStep = () => {
        const currentData = getValues();
        let hasErrors = false;

        if (step === 1) {
            if (userType === "user" && !currentData.name) hasErrors = true;
            if (
                userType === "hospital" &&
                (!currentData.hospitalName || !currentData.registrationNumber)
            )
                hasErrors = true;
            if (!currentData.email || !currentData.phone) hasErrors = true;
        }

        if (!hasErrors) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const PasswordStrength = ({ password }) => {
        const getStrength = (pass) => {
            if (!pass) return 0;
            let strength = 0;
            if (pass.length >= 6) strength += 1;
            if (pass.length >= 8) strength += 1;
            if (/[A-Z]/.test(pass)) strength += 1;
            if (/[0-9]/.test(pass)) strength += 1;
            if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
            return strength;
        };

        const strength = getStrength(password);
        const colors = [
            "bg-red-500",
            "bg-orange-500",
            "bg-yellow-500",
            "bg-blue-500",
            "bg-green-500",
        ];
        const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

        return (
            <div className="mt-2">
                <div className="flex space-x-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                i < strength
                                    ? colors[strength - 1]
                                    : "bg-white/20"
                            }`}
                        />
                    ))}
                </div>
                {password && (
                    <p
                        className={`text-xs ${
                            strength < 3 ? "text-red-400" : "text-green-400"
                        }`}
                    >
                        {labels[strength - 1] || "Very Weak"}
                    </p>
                )}
            </div>
        );
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

            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-2xl"
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
                            Join Our Mission
                        </h2>
                        <p className="text-white/70">
                            Create your account to start saving lives
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-white/70 text-sm">
                                Step {step} of 2
                            </span>
                            <span className="text-white/70 text-sm">
                                {Math.round((step / 2) * 100)}%
                            </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                            <motion.div
                                className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: `${(step / 2) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
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
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    {/* Name/Hospital Name */}
                                    {userType === "user" ? (
                                        <div>
                                            <label className="flex items-center text-white/90 font-medium mb-2">
                                                <UserPlus className="w-4 h-4 mr-2 text-red-400" />
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                {...register("name")}
                                                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300"
                                                placeholder="Enter your full name"
                                            />
                                            {errors.name && (
                                                <p className="text-red-400 text-sm mt-2 flex items-center">
                                                    <AlertCircle className="w-3 h-3 mr-1" />
                                                    {errors.name.message}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="flex items-center text-white/90 font-medium mb-2">
                                                    <Hospital className="w-4 h-4 mr-2 text-blue-400" />
                                                    Hospital Name
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register(
                                                        "hospitalName"
                                                    )}
                                                    className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 focus:bg-white/20 transition-all duration-300"
                                                    placeholder="Enter hospital name"
                                                />
                                                {errors.hospitalName && (
                                                    <p className="text-red-400 text-sm mt-2 flex items-center">
                                                        <AlertCircle className="w-3 h-3 mr-1" />
                                                        {
                                                            errors.hospitalName
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="flex items-center text-white/90 font-medium mb-2">
                                                    <Shield className="w-4 h-4 mr-2 text-blue-400" />
                                                    Registration Number
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register(
                                                        "registrationNumber"
                                                    )}
                                                    className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 focus:bg-white/20 transition-all duration-300"
                                                    placeholder="Enter registration number"
                                                />
                                                {errors.registrationNumber && (
                                                    <p className="text-red-400 text-sm mt-2 flex items-center">
                                                        <AlertCircle className="w-3 h-3 mr-1" />
                                                        {
                                                            errors
                                                                .registrationNumber
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* Email */}
                                    <div>
                                        <label className="flex items-center text-white/90 font-medium mb-2">
                                            <Mail className="w-4 h-4 mr-2 text-red-400" />
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            {...register("email")}
                                            className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300"
                                            placeholder="Enter your email"
                                        />
                                        {errors.email && (
                                            <p className="text-red-400 text-sm mt-2 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="flex items-center text-white/90 font-medium mb-2">
                                            <Phone className="w-4 h-4 mr-2 text-red-400" />
                                            Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            {...register("phone")}
                                            className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300"
                                            placeholder="Enter your phone number"
                                        />
                                        {errors.phone && (
                                            <p className="text-red-400 text-sm mt-2 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.phone.message}
                                            </p>
                                        )}
                                    </div>

                                    <motion.button
                                        type="button"
                                        onClick={nextStep}
                                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Continue
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
                                    </motion.button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    {/* Password */}
                                    <div>
                                        <label className="flex items-center text-white/90 font-medium mb-2">
                                            <Lock className="w-4 h-4 mr-2 text-red-400" />
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                {...register("password")}
                                                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300 pr-12"
                                                placeholder="Create a strong password"
                                            />
                                            <motion.button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
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
                                        <PasswordStrength
                                            password={watchedPassword}
                                        />
                                        {errors.password && (
                                            <p className="text-red-400 text-sm mt-2 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.password.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="flex items-center text-white/90 font-medium mb-2">
                                            <Lock className="w-4 h-4 mr-2 text-red-400" />
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                {...register("confirmPassword")}
                                                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300 pr-12"
                                                placeholder="Confirm your password"
                                            />
                                            <motion.button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </motion.button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="text-red-400 text-sm mt-2 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.confirmPassword.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Blood Group for Users */}
                                    {userType === "user" && (
                                        <div>
                                            <label className="flex items-center text-white/90 font-medium mb-2">
                                                <Heart className="w-4 h-4 mr-2 text-red-400" />
                                                Blood Group
                                            </label>
                                            <select
                                                {...register("bloodGroup")}
                                                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300"
                                            >
                                                <option
                                                    value=""
                                                    className="bg-slate-800"
                                                >
                                                    Select Blood Group
                                                </option>
                                                <option
                                                    value="A+"
                                                    className="bg-slate-800"
                                                >
                                                    A+
                                                </option>
                                                <option
                                                    value="A-"
                                                    className="bg-slate-800"
                                                >
                                                    A-
                                                </option>
                                                <option
                                                    value="B+"
                                                    className="bg-slate-800"
                                                >
                                                    B+
                                                </option>
                                                <option
                                                    value="B-"
                                                    className="bg-slate-800"
                                                >
                                                    B-
                                                </option>
                                                <option
                                                    value="AB+"
                                                    className="bg-slate-800"
                                                >
                                                    AB+
                                                </option>
                                                <option
                                                    value="AB-"
                                                    className="bg-slate-800"
                                                >
                                                    AB-
                                                </option>
                                                <option
                                                    value="O+"
                                                    className="bg-slate-800"
                                                >
                                                    O+
                                                </option>
                                                <option
                                                    value="O-"
                                                    className="bg-slate-800"
                                                >
                                                    O-
                                                </option>
                                            </select>
                                            {errors.bloodGroup && (
                                                <p className="text-red-400 text-sm mt-2 flex items-center">
                                                    <AlertCircle className="w-3 h-3 mr-1" />
                                                    {errors.bloodGroup.message}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Location */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="flex items-center text-white/90 font-medium mb-2">
                                                <MapPin className="w-4 h-4 mr-2 text-red-400" />
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                {...register("location.city")}
                                                className={`w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300 ${
                                                    userType === "user"
                                                        ? "cursor-not-allowed opacity-70"
                                                        : ""
                                                }`}
                                                placeholder={
                                                    userType === "user"
                                                        ? "Auto-detected"
                                                        : "Enter city"
                                                }
                                                readOnly={userType === "user"}
                                            />
                                            {errors.location?.city && (
                                                <p className="text-red-400 text-sm mt-2 flex items-center">
                                                    <AlertCircle className="w-3 h-3 mr-1" />
                                                    {
                                                        errors.location.city
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="flex items-center text-white/90 font-medium mb-2">
                                                <MapPin className="w-4 h-4 mr-2 text-red-400" />
                                                State
                                            </label>
                                            <input
                                                type="text"
                                                {...register("location.state")}
                                                className={`w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300 ${
                                                    userType === "user"
                                                        ? "cursor-not-allowed opacity-70"
                                                        : ""
                                                }`}
                                                placeholder={
                                                    userType === "user"
                                                        ? "Auto-detected"
                                                        : "Enter state"
                                                }
                                                readOnly={userType === "user"}
                                            />
                                            {errors.location?.state && (
                                                <p className="text-red-400 text-sm mt-2 flex items-center">
                                                    <AlertCircle className="w-3 h-3 mr-1" />
                                                    {
                                                        errors.location.state
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Navigation Buttons */}
                                    <div className="flex gap-4">
                                        <motion.button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            ← Back
                                        </motion.button>
                                        <motion.button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`flex-1 bg-gradient-to-r ${
                                                userType === "user"
                                                    ? "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                                                    : "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                                            } text-white py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center`}
                                            whileHover={{
                                                scale: isLoading ? 1 : 1.02,
                                            }}
                                            whileTap={{
                                                scale: isLoading ? 1 : 0.98,
                                            }}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <motion.div
                                                        animate={{
                                                            rotate: 360,
                                                        }}
                                                        transition={{
                                                            duration: 1,
                                                            repeat: Number.POSITIVE_INFINITY,
                                                            ease: "linear",
                                                        }}
                                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                                                    />
                                                    Creating Account...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-5 h-5 mr-2" />
                                                    Create Account
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    {/* Login Link */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center mt-8"
                    >
                        <p className="text-white/70">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-red-400 hover:text-red-300 font-semibold transition-colors"
                            >
                                Sign In
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

export default Signup;
