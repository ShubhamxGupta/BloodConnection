import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const Donate = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        bloodGroup: "",
        city: "",
        state: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Basic validation
        if (
            !form.name ||
            !form.email ||
            !form.phone ||
            !form.bloodGroup ||
            !form.city ||
            !form.state
        ) {
            toast.error("Please fill in all fields.");
            return;
        }
        setSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setSubmitting(false);
            toast.success("Thank you for registering as a donor!");
            setForm({
                name: "",
                email: "",
                phone: "",
                bloodGroup: "",
                city: "",
                state: "",
            });
        }, 1200);
    };

    return (
        <section className="min-h-screen flex flex-col items-center justify-center bg-white py-12 px-4">
            <motion.div
                className="bg-[#223634] p-8 rounded-lg shadow-lg w-full max-w-lg text-white"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-3xl font-bold mb-4 text-center">
                    Become a Blood Donor
                </h2>
                <p className="mb-6 text-center text-gray-200">
                    Register as a donor and help save lives. Fill out the form
                    below to join our donor community.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-white text-black focus:outline-none"
                            placeholder="Enter your name"
                            disabled={submitting}
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-white text-black focus:outline-none"
                            placeholder="example@mail.com"
                            disabled={submitting}
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-white text-black focus:outline-none"
                            placeholder="9876543210"
                            disabled={submitting}
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Blood Group</label>
                        <select
                            name="bloodGroup"
                            value={form.bloodGroup}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-white text-black focus:outline-none"
                            disabled={submitting}
                        >
                            <option value="">Select</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className="block mb-1">City</label>
                            <input
                                type="text"
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-white text-black focus:outline-none"
                                placeholder="City"
                                disabled={submitting}
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block mb-1">State</label>
                            <input
                                type="text"
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-white text-black focus:outline-none"
                                placeholder="State"
                                disabled={submitting}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[#fb4673] hover:bg-[#28bca9] py-3 mt-2 rounded-lg text-lg font-semibold transition disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Submitting..." : "Register as Donor"}
                    </button>
                </form>
                <div className="mt-8 text-center text-gray-300 text-sm">
                    <h3 className="text-lg font-semibold mb-2 text-white">
                        Why Donate Blood?
                    </h3>
                    <ul className="list-disc list-inside text-left mx-auto max-w-xs">
                        <li>Save up to 3 lives with one donation</li>
                        <li>Free health checkup at donation</li>
                        <li>Quick and safe process</li>
                        <li>Be a hero in your community</li>
                    </ul>
                </div>
            </motion.div>
        </section>
    );
};

export default Donate;
