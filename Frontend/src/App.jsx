import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import HeroSection from "../Components/HeroSection";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import UserDashboard from "../Pages/UserDashboard";
import HospitalDashboard from "../Pages/HospitalDashboard";
import About from "../Pages/About";
import Events from "../Pages/Events";
import Contact from "../Pages/Contact";
import HospitalPage from "../Pages/HospitalPage";
import EmergencyRequest from "../Pages/EmergencyRequest";
import { Toaster } from "react-hot-toast";
import EmergencySuccess from "../Pages/EmergencySuccess";
import Donate from "../Pages/Donate";
import FindDonor from "../Pages/FindDonor";

// Simple 404 page
const NotFound = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-5xl font-bold mb-4 text-red-600">404</h1>
        <p className="text-lg mb-6">Page Not Found</p>
        <a href="/" className="text-blue-600 underline">
            Go Home
        </a>
    </div>
);

// Wrapper to conditionally render Navbar/Footer
const Layout = ({ children }) => {
    const location = useLocation();
    const hideNavFooter = ["/login", "/signup"].includes(location.pathname);
    return (
        <div className="flex flex-col min-h-screen">
            {!hideNavFooter && <Navbar />}
            <Toaster position="top-center" />
            <main className="flex-grow">{children}</main>
            {!hideNavFooter && <Footer />}
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HeroSection />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/user-dashboard" element={<UserDashboard />} />
                    <Route
                        path="/hospital-dashboard"
                        element={<HospitalDashboard />}
                    />
                    <Route path="/about" element={<About />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/donate" element={<Donate />} />
                    <Route path="/find-donor" element={<FindDonor />} />
                    <Route path="/hospital/:id" element={<HospitalPage />} />
                    <Route path="/emergency" element={<EmergencyRequest />} />
                    <Route
                        path="/emergency/success"
                        element={<EmergencySuccess />}
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
