import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, User, MapPin, Heart } from "lucide-react";

const FindDonor = () => {
    const [form, setForm] = useState({ bloodGroup: "", city: "", state: "" });
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearched(true);
    
        try {
            const query = new URLSearchParams(form).toString();
            const response = await fetch(`http://localhost:5000/api/donors/search?${query}`);
            const data = await response.json();
    
            if (response.ok) {
                setResults(data);
            } else {
                console.error("Error:", data.message);
                setResults([]);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setResults([]);
        }
    };
    

    return (
        <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f0f9ff] via-[#e6f3ff] to-[#f0f9ff] py-12 px-4">
            <motion.div
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-3xl font-bold mb-4 text-center text-[#fc4848] flex items-center justify-center">
                    <Heart className="mr-2" /> Find a Blood Donor
                </h2>
                <form
                    onSubmit={handleSearch}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                >
                    <div>
                        <label className="block mb-1 font-semibold">
                            Blood Group
                        </label>
                        <select
                            name="bloodGroup"
                            value={form.bloodGroup}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-[#f0f9ff] border border-gray-300 focus:outline-none"
                        >
                            <option value="">Any</option>
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
                    <div>
                        <label className="block mb-1 font-semibold">City</label>
                        <input
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-[#f0f9ff] border border-gray-300 focus:outline-none"
                            placeholder="Enter city"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">
                            State
                        </label>
                        <input
                            type="text"
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-[#f0f9ff] border border-gray-300 focus:outline-none"
                            placeholder="Enter state"
                        />
                    </div>
                    <button
                        type="submit"
                        className="md:col-span-3 bg-[#fc4848] hover:bg-[#28bca9] text-white font-semibold py-2 rounded-lg flex items-center justify-center mt-2 transition"
                    >
                        <Search className="mr-2" /> Search
                    </button>
                </form>
                <div>
                    {searched && results.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                            No donors found for your criteria.
                        </div>
                    )}
                    {results.length > 0 && (
                        <div className="grid gap-4">
                            {results.map((donor, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center bg-[#f0f9ff] border border-gray-200 rounded-lg p-4 shadow-sm"
                                >
                                    <User
                                        className="text-[#fc4848] mr-4"
                                        size={32}
                                    />
                                    <div className="flex-1">
                                        <div className="font-bold text-lg">
                                            {donor.name}
                                        </div>
                                        <div className="text-gray-600 flex items-center">
                                            <Heart
                                                className="mr-1 text-[#fc4848]"
                                                size={16}
                                            />
                                            {donor.bloodGroup}
                                            <MapPin
                                                className="ml-4 mr-1 text-[#28bca9]"
                                                size={16}
                                            />
                                            {donor.city}, {donor.state}
                                        </div>
                                    </div>
                                    <button
                                        className="ml-4 bg-[#28bca9] hover:bg-[#fc4848] text-white px-4 py-2 rounded-lg font-semibold transition"
                                        disabled
                                        title="Contact feature coming soon!"
                                    >
                                        Contact
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </section>
    );
};

export default FindDonor;
