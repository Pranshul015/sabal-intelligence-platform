import { useState, useEffect } from 'react';
import { zonesAPI, insightsAPI } from '../lib/api';
import { X, Bot, Loader2, FileText, TrendingDown, AlertTriangle, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const BARRIER_LABELS: Record<string, string> = {
    no_aadhaar: 'No Aadhaar',
    no_income_cert: 'No Income Cert',
    no_caste_cert: 'No Caste Cert',
    no_bank_account: 'No Bank Account',
};

export default function ZoneDrawer({ zone, onClose }: { zone: any; onClose: () => void }) {
    const [detail, setDetail] = useState<any>(null);
    const [insight, setInsight] = useState<string>('');
    const [loadingInsight, setLoadingInsight] = useState(false);
    const [insightLoaded, setInsightLoaded] = useState(false);

    useEffect(() => {
        zonesAPI.getOne(zone.id).then(d => setDetail(d.zone)).catch(() => { });
    }, [zone.id]);

    async function fetchInsight() {
        setLoadingInsight(true);
        try {
            const data = await insightsAPI.getZoneInsight(zone.id);
            setInsight(data.narrative);
            setInsightLoaded(true);
        } catch {
            setInsight('Failed to generate insight. Please try again.');
        } finally {
            setLoadingInsight(false);
        }
    }

    const analytics = detail?.analytics;
    const barriers = analytics?.barrier_breakdown ? Object.entries(analytics.barrier_breakdown)
        .map(([k, v]: any) => ({ name: BARRIER_LABELS[k] || k, value: v }))
        .sort((a, b) => b.value - a.value) : [];

    const schemeGaps = analytics?.scheme_gaps ? Object.entries(analytics.scheme_gaps)
        .map(([, v]: any) => v)
        .sort((a: any, b: any) => b.gap - a.gap)
        .slice(0, 5) : [];

    const gapRate = zone.gap_rate_pct;
    const gapColor = gapRate >= 80 ? 'text-red-400' : gapRate >= 60 ? 'text-orange-400' : gapRate >= 40 ? 'text-yellow-400' : 'text-green-400';
    const gapBg = gapRate >= 80 ? 'bg-red-500/10 border-red-500/20' : gapRate >= 60 ? 'bg-orange-500/10 border-orange-500/20' : 'bg-yellow-500/10 border-yellow-500/20';

    return (
        <div className="w-96 border-l border-[#1E293B] bg-[#0F172A] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#1E293B] flex items-start justify-between flex-shrink-0">
                <div>
                    <h2 className="font-semibold text-white text-sm">{zone.name}</h2>
                    <p className="text-slate-400 text-xs mt-0.5">{zone.district}, {zone.state}</p>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                    <X size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Gap Summary */}
                <div className="p-5 space-y-3">
                    <div className={`rounded-xl border p-4 ${gapBg}`}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <TrendingDown size={16} className={gapColor} />
                                <span className="text-xs font-medium text-slate-300">Application Gap</span>
                            </div>
                            <span className={`text-2xl font-bold ${gapColor}`}>{gapRate.toFixed(1)}%</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'Eligible', value: zone.eligible_count, color: 'text-white' },
                                { label: 'Applied', value: zone.applied_count, color: 'text-green-400' },
                                { label: 'Gap', value: zone.gap_count, color: gapColor },
                            ].map(({ label, value, color }) => (
                                <div key={label} className="text-center">
                                    <p className={`text-lg font-bold ${color}`}>{value}</p>
                                    <p className="text-[10px] text-slate-500">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ROI Score */}
                    <div className="bg-[#1E293B] rounded-xl border border-[#334155] p-3 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">NGO Social ROI Score</p>
                            <p className="text-white text-sm font-medium mt-0.5">Deployment Priority</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">{zone.ngo_roi_score}<span className="text-sm text-slate-500">/100</span></p>
                        </div>
                    </div>
                </div>

                {/* Barrier Breakdown */}
                {barriers.length > 0 && (
                    <div className="px-5 pb-4">
                        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <AlertTriangle size={12} className="text-orange-400" />
                            Document Barriers in Gap Population
                        </h3>
                        <div className="bg-[#1E293B] rounded-xl border border-[#334155] p-3">
                            <ResponsiveContainer width="100%" height={120}>
                                <BarChart data={barriers} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                                    <Tooltip
                                        contentStyle={{ background: '#1E293B', border: '1px solid #334155', fontSize: 11 }}
                                        labelStyle={{ color: '#F8FAFC' }}
                                        itemStyle={{ color: '#F97316' }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {barriers.map((_, i) => (
                                            <Cell key={i} fill={i === 0 ? '#EF4444' : i === 1 ? '#F97316' : '#EAB308'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Top Affected Schemes */}
                {schemeGaps.length > 0 && (
                    <div className="px-5 pb-4">
                        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <FileText size={12} className="text-blue-400" />
                            Top Schemes with Gaps
                        </h3>
                        <div className="space-y-2">
                            {schemeGaps.map((s: any) => (
                                <div key={s.title} className="bg-[#1E293B] rounded-lg border border-[#334155] p-3 flex items-center justify-between">
                                    <p className="text-xs text-white font-medium flex-1 pr-2">{s.title}</p>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-sm font-bold text-red-400">{s.gap}</p>
                                        <p className="text-[9px] text-slate-500">unserved</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Dominant Demographics */}
                {analytics?.dominant_demographics && (
                    <div className="px-5 pb-4">
                        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Users size={12} className="text-purple-400" />
                            Gap Population Profile
                        </h3>
                        <div className="bg-[#1E293B] rounded-xl border border-[#334155] p-3 grid grid-cols-2 gap-2">
                            {Object.entries(analytics.dominant_demographics).map(([k, v]: any) => (
                                <div key={k} className="text-center">
                                    <p className="text-xs font-medium text-white">{v}</p>
                                    <p className="text-[10px] text-slate-500 capitalize">{k.replace('_', ' ')}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Gemini Insight */}
                <div className="px-5 pb-6">
                    <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Bot size={12} className="text-cyan-400" />
                        AI Field Intelligence Brief
                    </h3>
                    {!insightLoaded ? (
                        <button
                            onClick={fetchInsight}
                            disabled={loadingInsight}
                            className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-xl py-3 text-cyan-400 text-sm font-medium flex items-center justify-center gap-2 transition-all"
                        >
                            {loadingInsight
                                ? <><Loader2 size={14} className="animate-spin" /> Generating brief…</>
                                : <><Bot size={14} /> Generate Field Intelligence Brief</>}
                        </button>
                    ) : (
                        <div className="bg-[#1E293B] border border-cyan-500/20 rounded-xl p-4">
                            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{insight}</p>
                            <button
                                onClick={() => { setInsightLoaded(false); setInsight(''); }}
                                className="mt-3 text-[10px] text-slate-500 hover:text-cyan-400 transition-colors"
                            >Regenerate →</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
