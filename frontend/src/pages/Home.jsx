import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const Home = () => {
    const navigate = useNavigate()

    return (
        <div className='min-h-screen bg-linear-to-br from-[#050505] via-[#0b0b0b] to-[#050505] text-white flex flex-col items-center justify-center'>
            <div className='max-w-6xl mx-auto px-6 py-16 text-center'>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mb-8'
                >
                    <h1 className='text-5xl md:text-7xl font-bold mb-6 leading-tight'>
                        Manage Teams with <br />
                        <span className='block bg-gradient-to-r from-white to-zinc-800 bg-clip-text text-transparent'>
                            Ultimate Clarity
                        </span>
                    </h1>
                    <p className='text-zinc-400 max-w-2xl mx-auto text-lg mb-10'>
                        Assign tasks, track progress, and manage role-based access in a seamless, high-performance workspace.
                    </p>
                    
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => navigate("/auth")}
                        className='px-10 py-4 rounded-2xl font-semibold text-lg bg-white text-black flex items-center gap-2 mx-auto hover:bg-zinc-200 transition'
                    >
                        Get Started <ArrowRight size={20} />
                    </motion.button>
                </motion.div>
            </div>
        </div>
    )
}

export default Home