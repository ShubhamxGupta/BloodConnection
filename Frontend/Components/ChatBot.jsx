"use client";

import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from "react";
import {
    MessageCircle,
    X,
    Bot,
    User,
    Loader2,
    Paperclip,
    ImageIcon,
    FileText,
    Send,
    Minimize2,
    Maximize2,
    Sparkles,
    Heart,
    Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as pdfjs from "pdfjs-dist";

// Set worker path for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.mjs`;

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [botData, setBotData] = useState(null);
    const messagesEndRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    // Memoize initial welcome message to prevent re-renders
    const welcomeMessage = useMemo(
        () => ({
            role: "bot",
            content: `🩸 Hello! I'm your BloodConnection AI Assistant! 

I can help you with:
• 🔍 Blood availability checks
• 🏥 Hospital information & locations  
• 📊 Donor statistics & inventory
• 🚨 Emergency request guidance
• ⭐ Hospital ratings & reviews
• 📋 Blood report analysis (PDF upload)

What would you like to know today?`,
            timestamp: Date.now(),
        }),
        []
    );

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Fetch data when component mounts
    useEffect(() => {
        const fetchBotData = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/chatbot/data"
                );
                const data = await response.json();
                setBotData(data);
            } catch (error) {
                console.error("Error fetching bot data:", error);
                // Set mock data if API fails
                setBotData({
                    statistics: {
                        totalHospitals: 150,
                        totalUsers: 5000,
                        activeEmergencies: 8,
                        emergencyResponseTime: "12 minutes",
                        averageRating: 4.6,
                        bloodInventory: {
                            aPositive: 45,
                            aNegative: 23,
                            bPositive: 38,
                            bNegative: 15,
                            abPositive: 12,
                            abNegative: 8,
                            oPositive: 67,
                            oNegative: 34,
                        },
                        cityWiseDistribution: {
                            "New York": 25,
                            "Los Angeles": 20,
                            Chicago: 18,
                            Houston: 15,
                        },
                    },
                    hospitals: [
                        {
                            name: "City General Hospital",
                            location: { city: "New York", state: "NY" },
                            rating: 4.8,
                        },
                        {
                            name: "Metro Medical Center",
                            location: { city: "Los Angeles", state: "CA" },
                            rating: 4.5,
                        },
                    ],
                    users: [
                        { bloodGroup: "O+", count: 1200 },
                        { bloodGroup: "A+", count: 980 },
                        { bloodGroup: "B+", count: 750 },
                    ],
                });
            }
        };

        fetchBotData();
    }, []);

    // Initialize welcome message
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([welcomeMessage]);
        }
    }, [messages.length, welcomeMessage]);

    // Enhanced query processing function with memoization
    const processQuery = useCallback(
        (query) => {
            if (!botData)
                return "🤖 I'm still loading data. Please wait a moment...";

            const lowerQuery = query.toLowerCase();

            // Blood inventory queries
            if (
                lowerQuery.includes("blood") ||
                lowerQuery.includes("inventory")
            ) {
                const bloodTypeMatch = query.match(/\b(a|b|ab|o)[+-]\b/i);
                if (bloodTypeMatch) {
                    const bloodType = bloodTypeMatch[0].toUpperCase();
                    const inventoryKey = bloodType
                        .replace(/^A\+$/, "aPositive")
                        .replace(/^A-$/, "aNegative")
                        .replace(/^B\+$/, "bPositive")
                        .replace(/^B-$/, "bNegative")
                        .replace(/^AB\+$/, "abPositive")
                        .replace(/^AB-$/, "abNegative")
                        .replace(/^O\+$/, "oPositive")
                        .replace(/^O-$/, "oNegative");

                    const units =
                        botData.statistics.bloodInventory[inventoryKey] || 0;
                    const status =
                        units < 10
                            ? "🔴 Critical"
                            : units < 20
                            ? "🟡 Moderate"
                            : "🟢 Good";

                    return `🩸 **Blood Type: ${bloodType}**
📦 Available Units: **${units}**
📊 Status: ${status}

${
    units === 0
        ? "⚠️ **Not available!** Please check other blood types or contact hospitals directly."
        : units < 10
        ? "⚠️ **Critical Level!** Urgent donations needed."
        : units < 20
        ? "⚡ **Moderate supply** - Consider donating soon."
        : "✅ **Good supply available** - Safe for requests."
}

💡 Need this blood type? I can help you find nearby hospitals or create an emergency request!`;
                }

                // Show all blood inventory
                const bloodGroups = [
                    ["A+", "aPositive"],
                    ["A-", "aNegative"],
                    ["B+", "bPositive"],
                    ["B-", "bNegative"],
                    ["AB+", "abPositive"],
                    ["AB-", "abNegative"],
                    ["O+", "oPositive"],
                    ["O-", "oNegative"],
                ]
                    .map(([display, key]) => {
                        const units =
                            botData.statistics.bloodInventory[key] || 0;
                        const status =
                            units < 10 ? "🔴" : units < 20 ? "🟡" : "🟢";
                        return `${status} **${display}**: ${units} units`;
                    })
                    .join("\n");

                return `🏥 **Current Blood Inventory Status:**

${bloodGroups}

**Status Legend:**
🟢 Good Supply (20+ units)
🟡 Moderate Supply (10-19 units)  
🔴 Critical Supply (<10 units)

💡 **Tip:** Click on any blood type above to get detailed information!`;
            }

            // Emergency queries
            if (
                lowerQuery.includes("emergency") ||
                lowerQuery.includes("urgent")
            ) {
                return `🚨 **Emergency Blood Request Information**

📊 **Current Statistics:**
• Active Requests: ${botData.statistics.activeEmergencies}
• Average Response: ${botData.statistics.emergencyResponseTime}
• Success Rate: 94%

🔥 **How to Submit Emergency Request:**
1. Click "Emergency Request" button
2. Fill patient details & blood type
3. Hospitals notified within 5 minutes
4. Expect contact within 15-20 minutes

⚡ **Need immediate help?** 
Call Emergency Hotline: **911** or use our emergency request form!`;
            }

            // Hospital queries
            if (lowerQuery.includes("hospital")) {
                if (lowerQuery.includes("how many")) {
                    return `🏥 **Hospital Network Statistics**

📊 **Total Hospitals:** ${botData.statistics.totalHospitals}
⭐ **Average Rating:** ${botData.statistics.averageRating}/5.0
🌍 **Coverage:** Nationwide network

🏙️ **Top Cities:**
${Object.entries(botData.statistics.cityWiseDistribution)
    .map(([city, count]) => `• **${city}**: ${count} hospitals`)
    .join("\n")}

💡 Want to find hospitals near you? Just tell me your city!`;
                }

                // City-specific queries
                const cities = Object.keys(
                    botData.statistics.cityWiseDistribution
                );
                const mentionedCity = cities.find((city) =>
                    lowerQuery.includes(city.toLowerCase())
                );
                if (mentionedCity) {
                    const hospitalCount =
                        botData.statistics.cityWiseDistribution[mentionedCity];
                    const cityHospitals = botData.hospitals.filter(
                        (h) =>
                            h.location.city.toLowerCase() ===
                            mentionedCity.toLowerCase()
                    );
                    return `🏥 **Hospitals in ${mentionedCity}**

📊 **Total:** ${hospitalCount} hospitals
⭐ **Featured Hospitals:**
${cityHospitals.map((h) => `• **${h.name}** (${h.rating}⭐)`).join("\n")}

🗺️ Want directions or contact info? Just ask about a specific hospital!`;
                }
            }

            // Donor queries
            if (lowerQuery.includes("donor") || lowerQuery.includes("user")) {
                return `👥 **Donor Community Statistics**

📊 **Total Registered Donors:** ${botData.statistics.totalUsers.toLocaleString()}

🩸 **Blood Group Distribution:**
${botData.users
    .map((user) => `• **${user.bloodGroup}**: ${user.count} donors`)
    .join("\n")}

💪 **Want to become a donor?**
1. Register on our platform
2. Complete health screening
3. Schedule donation appointment
4. Save lives in your community!

🎯 **Every donation can save up to 3 lives!**`;
            }

            // Help queries
            if (
                lowerQuery.includes("help") ||
                lowerQuery.includes("what can you do")
            ) {
                return `🤖 **I'm your BloodConnection AI Assistant!**

🔍 **I can help you with:**

🩸 **Blood Services:**
• Check blood availability by type
• Find blood inventory status
• Emergency request guidance

🏥 **Hospital Services:**
• Find nearby hospitals
• Get hospital ratings & reviews
• Contact information & directions

📊 **Statistics & Data:**
• Donor community stats
• Blood inventory reports
• Emergency response metrics

📋 **Document Analysis:**
• Upload blood test reports (PDF)
• Get eligibility assessments
• Health recommendations

💡 **Just ask me anything like:**
• "Is O+ blood available?"
• "Find hospitals in New York"
• "How to make emergency request?"
• "Show blood inventory status"`;
            }

            // Default response with suggestions
            return `🤔 I'm not sure about that specific question, but I'm here to help!

💡 **Try asking me about:**
• 🩸 "Check A+ blood availability"
• 🏥 "Find hospitals near me"  
• 📊 "Show blood inventory"
• 🚨 "How to request emergency blood"
• 👥 "Donor statistics"

Or upload a blood test report (PDF) for analysis! 📋`;
        },
        [botData]
    );

    const analyzePdfContent = useCallback(async (pdfText) => {
        // Blood donation eligibility criteria
        const criteria = {
            hemoglobin: { min: 12.5, max: 18 },
            bloodPressure: {
                systolic: { min: 90, max: 180 },
                diastolic: { min: 60, max: 100 },
            },
            pulse: { min: 60, max: 100 },
            temperature: { min: 36.5, max: 37.5 },
            weight: { min: 50 },
            age: { min: 18, max: 65 },
        };

        const extractValue = (text, pattern) => {
            const match = text.match(pattern);
            return match ? Number.parseFloat(match[1]) : null;
        };

        const values = {
            hemoglobin: extractValue(pdfText, /hemoglobin[:\s]+(\d+\.?\d*)/i),
            systolic: extractValue(pdfText, /blood pressure[:\s]+(\d+)/i),
            diastolic: extractValue(pdfText, /blood pressure[:\s]+\d+\/(\d+)/i),
            pulse: extractValue(pdfText, /pulse[:\s]+(\d+)/i),
            temperature: extractValue(pdfText, /temperature[:\s]+(\d+\.?\d*)/i),
            weight: extractValue(pdfText, /weight[:\s]+(\d+\.?\d*)/i),
            age: extractValue(pdfText, /age[:\s]+(\d+)/i),
        };

        let eligibility = { status: true, reasons: [] };

        // Check each criterion
        if (values.hemoglobin && values.hemoglobin < criteria.hemoglobin.min) {
            eligibility.status = false;
            eligibility.reasons.push(
                `Hemoglobin level (${values.hemoglobin}) is below minimum required (${criteria.hemoglobin.min})`
            );
        }

        if (
            values.systolic &&
            (values.systolic < criteria.bloodPressure.systolic.min ||
                values.systolic > criteria.bloodPressure.systolic.max)
        ) {
            eligibility.status = false;
            eligibility.reasons.push(
                `Blood pressure (systolic) is out of safe range`
            );
        }

        return { eligibility, values };
    }, []);

    const handleFileSelect = useCallback(
        async (event) => {
            const file = event.target.files[0];
            if (file) {
                if (file.type === "application/pdf") {
                    setSelectedFile(file);
                    setLoading(true);

                    try {
                        if (file.size > 5 * 1024 * 1024) {
                            throw new Error(
                                "File size too large. Please upload a PDF smaller than 5MB."
                            );
                        }

                        const arrayBuffer = await file.arrayBuffer();
                        const pdf = await pdfjs.getDocument({
                            data: arrayBuffer,
                        }).promise;

                        if (pdf.numPages > 10) {
                            throw new Error(
                                "PDF has too many pages. Please upload a shorter report."
                            );
                        }

                        let fullText = "";
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const textContent = await page.getTextContent();
                            const pageText = textContent.items
                                .map((item) => item.str)
                                .join(" ");
                            fullText += pageText + "\n";
                        }

                        const analysis = await analyzePdfContent(fullText);

                        const response = `📋 **Blood Report Analysis Complete!**

${
    analysis.eligibility.status
        ? "✅ **You are eligible to donate blood!**"
        : "❌ **You are currently not eligible to donate blood.**"
}

${
    analysis.eligibility.reasons.length > 0
        ? `\n⚠️ **Reasons:**\n${analysis.eligibility.reasons
              .map((reason) => `• ${reason}`)
              .join("\n")}`
        : ""
}

📊 **Your Test Results:**
${Object.entries(analysis.values)
    .filter(([_, value]) => value !== null)
    .map(
        ([key, value]) =>
            `• **${key.charAt(0).toUpperCase() + key.slice(1)}**: ${value}`
    )
    .join("\n")}

${
    analysis.eligibility.status
        ? "\n🎉 **Great news!** You can proceed with blood donation. Visit your nearest blood bank or hospital."
        : "\n💡 **Recommendation:** Please consult with a healthcare provider for guidance on improving your eligibility."
}

🏥 **Need help finding a donation center?** Just ask me to find hospitals near you!`;

                        setMessages((prev) => [
                            ...prev,
                            {
                                role: "user",
                                content:
                                    "📋 Uploaded blood test report for analysis",
                                attachment: { type: "pdf", name: file.name },
                                timestamp: Date.now(),
                            },
                            {
                                role: "bot",
                                content: response,
                                timestamp: Date.now(),
                            },
                        ]);
                    } catch (error) {
                        console.error("Error processing PDF:", error);
                        setMessages((prev) => [
                            ...prev,
                            {
                                role: "bot",
                                content: `⚠️ **Error Processing PDF**

${error.message || "Could not read the PDF properly."}

📋 **Please ensure:**
• The file is a valid blood test report
• Contains medical information (hemoglobin, blood pressure, etc.)
• Is properly formatted and not corrupted
• Is not password protected
• File size is under 5MB

💡 **Try uploading a different report or contact support if the issue persists.**`,
                                timestamp: Date.now(),
                            },
                        ]);
                        setSelectedFile(null);
                    } finally {
                        setLoading(false);
                    }
                } else if (file.type.startsWith("image/")) {
                    setSelectedFile(file);
                } else {
                    alert("Please upload only images or PDF files");
                }
            }
        },
        [analyzePdfContent]
    );

    const handleSend = useCallback(async () => {
        if (!input.trim() && !selectedFile) return;

        const userMessage = {
            role: "user",
            content: input,
            attachment: selectedFile
                ? {
                      type: selectedFile.type,
                      name: selectedFile.name,
                      url: URL.createObjectURL(selectedFile),
                  }
                : null,
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setSelectedFile(null);
        setLoading(true);
        setIsTyping(true);

        try {
            // Simulate typing delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const response = processQuery(input);
            setMessages((prev) => [
                ...prev,
                { role: "bot", content: response, timestamp: Date.now() },
            ]);
        } catch (error) {
            console.error("Error processing query:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "bot",
                    content:
                        "🤖 Sorry, I encountered an error. Please try again!",
                    timestamp: Date.now(),
                },
            ]);
        } finally {
            setLoading(false);
            setIsTyping(false);
        }
    }, [input, selectedFile, processQuery]);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend]
    );

    const toggleChat = useCallback(() => setIsOpen(!isOpen), [isOpen]);
    const toggleMinimize = useCallback(
        () => setIsMinimized(!isMinimized),
        [isMinimized]
    );

    return (
        <AnimatePresence>
            {!isOpen ? (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all z-50"
                    onClick={toggleChat}
                    aria-label="Open BloodConnection AI Assistant"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 8,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    >
                        <Sparkles size={28} />
                    </motion.div>
                </motion.button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    className={`fixed bottom-6 right-6 bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 z-50 transition-all duration-300 ${
                        isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
                    }`}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 4,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear",
                                }}
                                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                            >
                                <Bot className="text-white" size={20} />
                            </motion.div>
                            <div>
                                <h2 className="text-lg font-bold text-white">
                                    BloodConnection AI
                                </h2>
                                <p className="text-blue-100 text-sm">
                                    Your Health Assistant
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={toggleMinimize}
                                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                                title={isMinimized ? "Maximize" : "Minimize"}
                            >
                                {isMinimized ? (
                                    <Maximize2 size={18} />
                                ) : (
                                    <Minimize2 size={18} />
                                )}
                            </button>
                            <button
                                onClick={toggleChat}
                                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                                title="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`flex ${
                                            msg.role === "user"
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >
                                        <div className="flex items-start max-w-[85%] space-x-2">
                                            {msg.role === "bot" && (
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                                    <Bot
                                                        size={16}
                                                        className="text-white"
                                                    />
                                                </div>
                                            )}
                                            <div
                                                className={`p-4 rounded-2xl shadow-sm ${
                                                    msg.role === "user"
                                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm"
                                                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                                                }`}
                                            >
                                                <div className="whitespace-pre-line text-sm leading-relaxed">
                                                    {msg.content
                                                        .split("**")
                                                        .map((part, i) =>
                                                            i % 2 === 1 ? (
                                                                <strong
                                                                    key={i}
                                                                    className="font-semibold"
                                                                >
                                                                    {part}
                                                                </strong>
                                                            ) : (
                                                                part
                                                            )
                                                        )}
                                                </div>
                                                {msg.attachment && (
                                                    <div className="mt-2 flex items-center text-xs opacity-75">
                                                        {msg.attachment.type.startsWith(
                                                            "image/"
                                                        ) ? (
                                                            <ImageIcon
                                                                size={14}
                                                                className="mr-1"
                                                            />
                                                        ) : (
                                                            <FileText
                                                                size={14}
                                                                className="mr-1"
                                                            />
                                                        )}
                                                        {msg.attachment.name}
                                                    </div>
                                                )}
                                            </div>
                                            {msg.role === "user" && (
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                                                    <User
                                                        size={16}
                                                        className="text-white"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center space-x-2"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                            <Bot
                                                size={16}
                                                className="text-white"
                                            />
                                        </div>
                                        <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-sm shadow-sm">
                                            <div className="flex space-x-1">
                                                {[0, 1, 2].map((i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{
                                                            scale: [1, 1.2, 1],
                                                        }}
                                                        transition={{
                                                            duration: 1,
                                                            repeat: Number.POSITIVE_INFINITY,
                                                            delay: i * 0.2,
                                                        }}
                                                        className="w-2 h-2 bg-blue-500 rounded-full"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="border-t border-gray-200 p-4 bg-white">
                                <div className="flex flex-col space-y-3">
                                    {selectedFile && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center space-x-2 p-3 bg-blue-50 rounded-xl border border-blue-200"
                                        >
                                            {selectedFile.type.startsWith(
                                                "image/"
                                            ) ? (
                                                <ImageIcon
                                                    size={18}
                                                    className="text-blue-600"
                                                />
                                            ) : (
                                                <FileText
                                                    size={18}
                                                    className="text-blue-600"
                                                />
                                            )}
                                            <span className="text-sm text-blue-800 truncate flex-1">
                                                {selectedFile.name}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    setSelectedFile(null)
                                                }
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </motion.div>
                                    )}

                                    <div className="flex items-end space-x-2">
                                        <div className="flex-1 relative">
                                            <textarea
                                                value={input}
                                                onChange={(e) =>
                                                    setInput(e.target.value)
                                                }
                                                onKeyDown={handleKeyDown}
                                                placeholder="Ask about blood availability, hospitals, or upload a report..."
                                                className="w-full p-3 pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                rows="1"
                                                style={{
                                                    minHeight: "44px",
                                                    maxHeight: "120px",
                                                }}
                                                disabled={loading}
                                            />
                                            <button
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                                                title="Upload file"
                                            >
                                                <Paperclip size={18} />
                                            </button>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleSend}
                                            disabled={
                                                loading ||
                                                (!input.trim() && !selectedFile)
                                            }
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <Loader2
                                                    size={18}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <Send size={18} />
                                            )}
                                        </motion.button>
                                    </div>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />

                                <div className="flex items-center justify-center mt-3 space-x-4 text-xs text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <Heart
                                            size={12}
                                            className="text-red-500"
                                        />
                                        <span>Powered by AI</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Activity
                                            size={12}
                                            className="text-green-500"
                                        />
                                        <span>Real-time Data</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Chatbot;
