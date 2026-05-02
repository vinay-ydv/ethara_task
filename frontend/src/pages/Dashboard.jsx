import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App.jsx'
import axios from 'axios'
import { LogOut, Plus, Users, LayoutList } from 'lucide-react'

const Dashboard = () => {
    const navigate = useNavigate()
    const userStr = localStorage.getItem("user")
    const user = userStr ? JSON.parse(userStr) : null

    const [tasks, setTasks] = useState([])
    const [projects, setProjects] = useState([])
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("") 

    // Form States for Admin
    const [newTask, setNewTask] = useState({ title: '', description: '', project: '', assignedTo: '' })
    const [newProject, setNewProject] = useState({ name: '', description: '', members: [] })

    const fetchData = async () => {
        setLoading(true)
        try {
            const requests = [
                axios.get(`${serverUrl}/api/task/get-all`, { withCredentials: true }),
                axios.get(`${serverUrl}/api/project/get-all`, { withCredentials: true })
            ];
            
            if (user?.role === 'Admin') {
                requests.push(axios.get(`${serverUrl}/api/auth/members`, { withCredentials: true }));
            }

            const responses = await Promise.all(requests)
            setTasks(responses[0].data)
            setProjects(responses[1].data)
            if (user?.role === 'Admin') setMembers(responses[2].data)
            
            setLoading(false)
        } catch (error) {
            setLoading(false) 
            setError(error.response?.data?.message || "Failed to load dashboard data") 
        }
    }

    useEffect(() => {
        if (!user) return navigate("/")
        fetchData()
    }, [])

    const handleCreateProject = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`${serverUrl}/api/project/create`, newProject, { withCredentials: true })
            setNewProject({ name: '', description: '', members: [] })
            fetchData()
        } catch (err) { setError(err.response?.data?.message) }
    }

    const handleCreateTask = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`${serverUrl}/api/task/create`, newTask, { withCredentials: true })
            setNewTask({ title: '', description: '', project: '', assignedTo: '' })
            fetchData()
        } catch (err) { setError(err.response?.data?.message) }
    }

    const updateTaskStatus = async (id, status) => {
        try {
            await axios.post(`${serverUrl}/api/task/update-status/${id}`, { status }, { withCredentials: true })
            fetchData() 
        } catch (error) { setError("Failed to update status") }
    }

    const handleLogout = () => {
        localStorage.removeItem("user")
        window.location.href = "/"
    }

    const getStatusColor = (status) => {
        if (status === 'Done') return 'text-green-400';
        if (status === 'Processing') return 'text-blue-400';
        return 'text-zinc-400';
    }

    return (
        <div className='min-h-screen bg-linear-to-br from-[#050505] via-[#0b0b0b] to-[#050505] text-white'>
            {/* Top Navbar */}
            <div className='sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10'>
                <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
                    <h1 className='text-xl font-bold'>Team<span className='text-zinc-500'>Task</span></h1>
                    <div className='flex items-center gap-4'>
                        <span className='text-sm bg-white/10 px-3 py-1 rounded-full'>{user?.role}</span>
                        <span className='text-sm text-zinc-400'>{user?.name}</span>
                        <button onClick={handleLogout} className='p-2 hover:bg-white/10 rounded-lg transition text-red-400'>
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
            
            <div className='max-w-7xl mx-auto px-6 py-8'>
                {error && <div className='mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl'>{error}</div>}

                {/* ================= ADMIN DASHBOARD ================= */}
                {user?.role === 'Admin' ? (
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                        
                        {/* Left Column: Forms & Members */}
                        <div className='space-y-8'>
                            {/* Create Project Form */}
                            <div className='bg-black/60 border border-white/10 rounded-3xl p-6'>
                                <h2 className='text-lg font-semibold mb-4 flex items-center gap-2'><LayoutList size={20}/> New Project</h2>
                                <form onSubmit={handleCreateProject} className='space-y-3'>
                                    <input type="text" placeholder="Project Name" required value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} className='w-full p-3 rounded-xl bg-white/5 border border-white/10 outline-none text-sm' />
                                    <textarea placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className='w-full p-3 rounded-xl bg-white/5 border border-white/10 outline-none text-sm resize-none h-20' />
                                    <button className='w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition text-sm flex justify-center items-center gap-2'>
                                        <Plus size={16}/> Create Project
                                    </button>
                                </form>
                            </div>

                            {/* Assign Task Form */}
                            <div className='bg-black/60 border border-white/10 rounded-3xl p-6'>
                                <h2 className='text-lg font-semibold mb-4 flex items-center gap-2'><Plus size={20}/> Assign Task</h2>
                                <form onSubmit={handleCreateTask} className='space-y-3'>
                                    <input type="text" placeholder="Task Title" required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className='w-full p-3 rounded-xl bg-white/5 border border-white/10 outline-none text-sm' />
                                    
                                    <select required value={newTask.project} onChange={e => setNewTask({...newTask, project: e.target.value})} className='w-full p-3 rounded-xl bg-[#0a0a0a] border border-white/10 outline-none text-sm text-zinc-300'>
                                        <option value="">Select Project</option>
                                        {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                    </select>

                                    <select required value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})} className='w-full p-3 rounded-xl bg-[#0a0a0a] border border-white/10 outline-none text-sm text-zinc-300'>
                                        <option value="">Assign to Member</option>
                                        {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                                    </select>

                                    <button className='w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition text-sm'>
                                        Dispatch Task
                                    </button>
                                </form>
                            </div>

                            {/* Team Members List */}
                            <div className='bg-black/60 border border-white/10 rounded-3xl p-6'>
                                <h2 className='text-lg font-semibold mb-4 flex items-center gap-2'><Users size={20}/> Team Roster</h2>
                                <div className='space-y-3'>
                                    {members.length === 0 && <p className='text-sm text-zinc-500'>No members found.</p>}
                                    {members.map(m => (
                                        <div key={m._id} className='p-3 border border-white/5 rounded-xl bg-white/5 flex justify-between items-center'>
                                            <div>
                                                <p className='font-medium text-sm'>{m.name}</p>
                                                <p className='text-xs text-zinc-400'>{m.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Master Task View */}
                        <div className='lg:col-span-2 bg-black/60 border border-white/10 rounded-3xl p-6 h-fit'>
                            <h2 className='text-xl font-semibold mb-6'>Master Task Board</h2>
                            {loading ? <p className='text-zinc-500'>Syncing board...</p> : (
                                <div className='space-y-4'>
                                    {tasks.length === 0 && <p className='text-zinc-500 text-sm'>No tasks in the system.</p>}
                                    {tasks.map((t) => (
                                        <div key={t._id} className='flex flex-col sm:flex-row justify-between p-5 border border-white/10 rounded-2xl bg-white/5 gap-4'>
                                            <div>
                                                <h3 className='font-medium text-lg mb-1'>{t.title}</h3>
                                                <div className='flex gap-3 text-xs text-zinc-400'>
                                                    <span className='bg-white/10 px-2 py-1 rounded'>{t.project?.name || 'Deleted Project'}</span>
                                                    <span className='flex items-center'>Assignee: {t.assignedTo?.name || 'Unknown'}</span>
                                                </div>
                                            </div>
                                            <div className='flex items-center'>
                                                <select 
                                                    className={`bg-black/80 border border-white/20 rounded-lg p-2 text-sm outline-none font-medium ${getStatusColor(t.status)}`}
                                                    value={t.status}
                                                    onChange={(e) => updateTaskStatus(t._id, e.target.value)}
                                                >
                                                    <option value="Not Started" className="text-white">Not Started</option>
                                                    <option value="Processing" className="text-white">Processing</option>
                                                    <option value="Done" className="text-white">Done</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                
                /* ================= MEMBER DASHBOARD ================= */
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                        
                        {/* Projects Sidebar */}
                        <div className='bg-black/60 border border-white/10 rounded-3xl p-6 h-fit'>
                            <h2 className='text-xl font-semibold mb-6 flex items-center gap-2'><LayoutList size={20}/> My Projects</h2>
                            <div className='space-y-4'>
                                {projects.length === 0 && <p className='text-zinc-500 text-sm'>You are not assigned to any projects.</p>}
                                {projects.map(p => (
                                    <div key={p._id} className='p-4 border border-white/10 rounded-2xl bg-white/5'>
                                        <h3 className='font-medium text-white mb-1'>{p.name}</h3>
                                        <p className='text-xs text-zinc-400'>{p.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Task Execution Board */}
                        <div className='lg:col-span-2 bg-black/60 border border-white/10 rounded-3xl p-6'>
                            <div className='mb-8'>
                                <h2 className='text-3xl font-bold mb-2'>Your Active Tasks</h2>
                                <p className='text-zinc-400'>Update your progress to keep the team synced.</p>
                            </div>
                            
                            {loading ? <p className='text-zinc-500'>Loading your tasks...</p> : (
                                <div className='space-y-4'>
                                    {tasks.length === 0 && <p className='text-zinc-500 text-sm p-4 border border-white/5 rounded-xl text-center'>You have a clear queue. No tasks assigned.</p>}
                                    {tasks.map((t) => (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            key={t._id} 
                                            className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border border-white/10 rounded-2xl hover:bg-white/5 transition gap-4'
                                        >
                                            <div>
                                                <h3 className='font-medium text-xl mb-2'>{t.title}</h3>
                                                <p className='text-sm text-zinc-400 mb-3'>{t.description}</p>
                                                <span className='text-xs font-semibold bg-white/10 text-zinc-300 px-3 py-1 rounded-full'>
                                                    Project: {t.project?.name}
                                                </span>
                                            </div>
                                            <div className='w-full sm:w-auto'>
                                                <select 
                                                    className={`w-full sm:w-auto bg-[#0a0a0a] border border-white/20 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-white/20 font-bold tracking-wide ${getStatusColor(t.status)}`}
                                                    value={t.status}
                                                    onChange={(e) => updateTaskStatus(t._id, e.target.value)}
                                                >
                                                    <option value="Not Started" className="text-zinc-400">Not Started</option>
                                                    <option value="Processing" className="text-blue-400">Processing</option>
                                                    <option value="Done" className="text-green-400">Done</option>
                                                </select>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard