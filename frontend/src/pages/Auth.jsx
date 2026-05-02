import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { serverUrl } from '../App.jsx'
import axios from 'axios'

const Auth = () => {
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Member'
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
            const payload = isLogin ? { email: formData.email, password: formData.password } : formData

            const result = await axios.post(`${serverUrl}${endpoint}`, payload, { 
                withCredentials: true 
            })

            if (isLogin) {
                // Store user metadata (Token is automatically handled via httpOnly Cookie)
                localStorage.setItem("user", JSON.stringify(result.data.user))
                window.location.href = "/dashboard" // Force reload to update App.jsx state
            } else {
                // If registered successfully, switch to login
                setIsLogin(true)
                setFormData({ ...formData, password: '' })
                setError("Registration successful! Please log in.")
            }
        } catch (error) {
            setError(error.response?.data?.message || "Authentication failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-linear-to-br from-[#050505] via-[#0b0b0b] to-[#050505] text-white flex items-center justify-center'>
            <div className='absolute top-0 left-0 w-full z-40 backdrop-blur-xl bg-black/50 border-b border-white/10'>
                <div className='max-w-7xl mx-auto px-6 h-16 flex items-center'>
                    <button className='p-2 rounded-lg hover:bg-white/10 transition flex items-center gap-2 text-zinc-400' onClick={() => navigate("/")}>
                        <ArrowLeft size={20} /> Back
                    </button>
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='w-full max-w-md bg-black/60 border border-white/10 p-8 rounded-3xl mt-16'
            >
                <h2 className='text-3xl font-bold mb-6 text-center'>
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>

                {error && <p className={`mb-4 text-sm text-center ${error.includes('successful') ? 'text-green-400' : 'text-red-400'}`}>{error}</p>}

                <form onSubmit={handleSubmit} className='space-y-4'>
                    {!isLogin && (
                        <>
                            <input 
                                type="text" name="name" placeholder="Full Name" required 
                                value={formData.name} onChange={handleChange}
                                className='w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-white/20 transition'
                            />
                            <select 
                                name="role" value={formData.role} onChange={handleChange}
                                className='w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-white/20 transition text-zinc-300'
                            >
                                <option value="Member" className="bg-black">Team Member</option>
                                <option value="Admin" className="bg-black">Admin</option>
                            </select>
                        </>
                    )}
                    
                    <input 
                        type="email" name="email" placeholder="Email Address" required 
                        value={formData.email} onChange={handleChange}
                        className='w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-white/20 transition'
                    />
                    <input 
                        type="password" name="password" placeholder="Password" required 
                        value={formData.password} onChange={handleChange}
                        className='w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-white/20 transition'
                    />

                    <button 
                        disabled={loading}
                        className='w-full py-4 rounded-xl bg-white text-black font-semibold text-lg hover:bg-zinc-200 transition disabled:opacity-50'
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <p className='text-center mt-6 text-zinc-400'>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => { setIsLogin(!isLogin); setError(""); }} className='text-white hover:underline'>
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </motion.div>
        </div>
    )
}

export default Auth