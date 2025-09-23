import { useState } from "react";
// import { registerUser } from "../api/auth";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

function Register() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //   const data = await registerUser(formData);
            //   console.log("Registered:", data);
            alert("Registration successful!");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen 
                bg-gradient-to-b from-gray-900 via-gray-800 to-black">
            <div
                className="relative bg-gradient-to-r from-purple-900 via-purple-700 to-purple-900 
                   rounded-xl shadow-lg flex overflow-hidden w-[800px] h-[400px]"
            >
                {/* Left side (Welcome message) */}
                <div className="w-1/2 flex flex-col items-center justify-center text-center text-white p-8">
                    <h2 className="text-4xl font-bold mb-4">WELCOME NEWBIE!</h2>
                    <p className="text-gray-200">
                        Register to Track you Activities and Make it Productive!!!
                    </p>
                </div>

                {/* Right side (Form) */}
                <div className="w-1/2 bg-black bg-opacity-80 p-8 flex flex-col justify-center relative">
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign Up</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username */}
                        <div className="flex items-center border-b border-gray-500 py-2">
                            <FaUser className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                name="name"
                                placeholder="Username"
                                onChange={handleChange}
                                required
                                className="bg-transparent outline-none text-white w-full"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex items-center border-b border-gray-500 py-2">
                            <FaEnvelope className="text-gray-400 mr-2" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={handleChange}
                                required
                                className="bg-transparent outline-none text-white w-full"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex items-center border-b border-gray-500 py-2">
                            <FaLock className="text-gray-400 mr-2" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                                className="bg-transparent outline-none text-white w-full"
                            />
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            className="w-full mt-6 bg-gradient-to-r from-purple-500 to-purple-700
                         text-white py-3 rounded-full font-semibold
                         hover:from-purple-600 hover:to-purple-800
                         transition duration-300 shadow-lg"
                        >
                            Sign Up
                        </button>
                    </form>

                    <p className="text-gray-400 text-sm mt-4 text-center">
                        Already have an account?{" "}
                        <a href="/login" className="text-purple-400 hover:underline">
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
