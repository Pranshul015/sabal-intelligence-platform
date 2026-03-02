import { useEffect, useState } from 'react';
import { schemesAPI } from '../lib/api';
import { Loader2, TrendingDown, MapPin } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
    Agriculture: 'bg-green-500/10 text-green-300 border-green-500/20',
    Housing: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    Employment: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    Education: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
    Finance: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    Energy: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
};

export default function SchemesGapPage() {
    const [schemes, setSchemes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('All');

    const categories = ['All', 'Agriculture', 'Housing', 'Employment', 'Education', 'Finance', 'Energy'];
    const filtered = filter === 'All' ? schemes : schemes.filter(s => s.category === filter);

    useEffect(() => {
        schemesAPI.getGaps()
            .then(d => setSchemes(d.schemes))
            .catch(() => setError('Failed to load scheme data.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-5xl mx-auto px-6 py-6">
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-xl font-bold text-white">Scheme-Level Gap Tracker</h1>
                    <p className="text-sm text-slate-400 mt-1">Which schemes have the highest national reach problem?</p>
                </div>
                {/* Category filter */}
                <div className="flex gap-1.5 flex-wrap justify-end">
                    {categories.map(c => (
                        <button key={c} onClick={() => setFilter(c)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${filter === c ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'border-[#334155] text-slate-400 hover:text-white hover:border-slate-500'
                                }`}>
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 size={32} className="animate-spin text-red-400" />
                </div>
            ) : error ? (
                <p className="text-red-400 text-sm text-center">{error}</p>
            ) : (
                <>
                    {/* Summary cards */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <SummaryCard label="Total Eligible (All Schemes)" value={schemes.reduce((s, x) => s + x.total_eligible, 0).toLocaleString()} />
                        <SummaryCard label="Total Unserved Gap" value={schemes.reduce((s, x) => s + x.total_gap, 0).toLocaleString()} color="text-red-400" />
                        <SummaryCard label="Schemes Tracked" value={schemes.length.toString()} />
                    </div>

                    {/* Table */}
                    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3 text-[10px] text-slate-500 uppercase tracking-wider border-b border-[#334155]">
                            <span>Scheme</span>
                            <span>Category</span>
                            <span className="text-right">Eligible</span>
                            <span className="text-right">Applied</span>
                            <span className="text-right text-red-400">Gap</span>
                            <span className="text-right">Gap Rate</span>
                        </div>
                        <div className="divide-y divide-[#1E293B]">
                            {filtered.map((scheme, i) => (
                                <div key={scheme.id}
                                    className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3.5 items-center hover:bg-white/2 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500 w-4 flex-shrink-0">{i + 1}</span>
                                        <div>
                                            <p className="text-sm font-medium text-white">{scheme.title}</p>
                                            <p className="text-[10px] text-slate-500">{scheme.benefit}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] border ${CATEGORY_COLORS[scheme.category] || 'bg-slate-500/10 text-slate-300 border-slate-500/20'}`}>
                                            {scheme.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-white text-right">{scheme.total_eligible.toLocaleString()}</p>
                                    <p className="text-sm text-green-400 text-right">{scheme.total_applied.toLocaleString()}</p>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-red-400">{scheme.total_gap.toLocaleString()}</p>
                                        <div className="flex items-center justify-end gap-1 mt-0.5">
                                            <TrendingDown size={9} className="text-slate-500" />
                                            <span className="text-[9px] text-slate-500">{scheme.affected_zones} zones</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <GapRateBadge rate={scheme.gap_rate_pct} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function GapRateBadge({ rate }: { rate: number }) {
    const color = rate >= 80 ? 'text-red-400 bg-red-500/10' : rate >= 60 ? 'text-orange-400 bg-orange-500/10' : rate >= 40 ? 'text-yellow-400 bg-yellow-500/10' : 'text-green-400 bg-green-500/10';
    return (
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${color}`}>
            {rate}%
        </span>
    );
}

function SummaryCard({ label, value, color = 'text-white' }: { label: string; value: string; color?: string }) {
    return (
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-400 mt-1">{label}</p>
        </div>
    );
}
