import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Map, BarChart2, List, LogOut, Satellite } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const links = [
        { to: '/', icon: Map, label: 'Heatmap' },
        { to: '/priority', icon: List, label: 'Priority List' },
        { to: '/schemes', icon: BarChart2, label: 'Scheme Gaps' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-[#0F172A] border-b border-[#1E293B]">
            <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Brand */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                        <Satellite size={16} className="text-white" />
                    </div>
                    <div>
                        <span className="font-bold text-white tracking-tight">Sabal</span>
                        <span className="text-[10px] text-slate-400 block leading-none">NGO Intelligence</span>
                    </div>
                </div>

                {/* Nav links */}
                <div className="flex items-center gap-1">
                    {links.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${isActive
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            <Icon size={15} />
                            {label}
                        </NavLink>
                    ))}
                </div>

                {/* User info + logout */}
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-medium text-white">{user?.organization}</p>
                        <p className="text-[10px] text-slate-500">{user?.email}</p>
                    </div>
                    <button
                        onClick={() => { logout(); navigate('/login'); }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"
                    >
                        <LogOut size={15} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
