import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Satellite, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('demo@sabal-ngo.org');
    const [password, setPassword] = useState('ngo@sabal2024');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="relative w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl mb-4">
                        <Satellite size={28} className="text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Sabal</h1>
                    <p className="text-slate-400 text-sm mt-1">NGO Intelligence Platform</p>
                </div>

                {/* Card */}
                <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6">
                    <p className="text-xs text-slate-500 mb-5 text-center">Sign in to access the NGO dashboard</p>

                    {error && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">
                            <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                            <p className="text-red-400 text-xs">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                            <input
                                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500/50 transition-colors"
                                placeholder="ngo@organization.org"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
                            <input
                                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500/50 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                            {loading ? <><Loader2 size={15} className="animate-spin" /> Signing in…</> : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-4 p-3 bg-[#0F172A] rounded-lg">
                        <p className="text-[10px] text-slate-500 text-center">Demo credentials pre-filled above</p>
                    </div>
                </div>

                <p className="text-center text-[10px] text-slate-600 mt-6">
                    Sabal NGO Intelligence Platform · Powered by Gemini AI
                </p>
            </div>
        </div>
    );
}
