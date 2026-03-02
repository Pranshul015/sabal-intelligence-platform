import { useEffect, useState } from 'react';
import { zonesAPI } from '../lib/api';
import { Loader2, TrendingDown, Target, MapPin } from 'lucide-react';

function gapColor(rate: number): string {
    if (rate >= 80) return 'text-red-400';
    if (rate >= 60) return 'text-orange-400';
    if (rate >= 40) return 'text-yellow-400';
    return 'text-green-400';
}

function gapBg(rate: number): string {
    if (rate >= 80) return 'border-red-500/30 bg-red-500/5';
    if (rate >= 60) return 'border-orange-500/30 bg-orange-500/5';
    if (rate >= 40) return 'border-yellow-500/30 bg-yellow-500/5';
    return 'border-green-500/30 bg-green-500/5';
}

function ROIBar({ score }: { score: number }) {
    const color = score >= 70 ? '#EF4444' : score >= 50 ? '#F97316' : '#EAB308';
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-[#334155] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} />
            </div>
            <span className="text-xs font-bold text-white w-8">{score}</span>
        </div>
    );
}

export default function PriorityListPage() {
    const [zones, setZones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        zonesAPI.getPriorityList()
            .then(d => setZones(d.zones))
            .catch(() => setError('Failed to load priority list.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-5xl mx-auto px-6 py-6">
            <div className="mb-6">
                <h1 className="text-xl font-bold text-white">NGO Deployment Priority List</h1>
                <p className="text-sm text-slate-400 mt-1">Zones ranked by Social ROI Score — deploy here first for maximum impact</p>
            </div>

            {/* How ROI is computed */}
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 mb-6 flex items-start gap-3">
                <Target size={16} className="text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-xs font-medium text-white">How the ROI Score works</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                        <span className="text-white font-medium">ROI = (Gap Count × Avg Scheme Benefit) ÷ Barrier Difficulty (1–3)</span>
                        <br />
                        Zones with a high unserved population AND easy-to-fix barriers (e.g., just Aadhaar needed) rank higher than zones with hard document requirements.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 size={32} className="animate-spin text-red-400" />
                </div>
            ) : error ? (
                <p className="text-red-400 text-sm text-center">{error}</p>
            ) : (
                <div className="space-y-3">
                    {zones.map((zone, i) => (
                        <div key={zone.zone_id} className={`rounded-xl border p-4 transition-all hover:scale-[1.005] ${gapBg(zone.gap_rate_pct)}`}>
                            <div className="flex items-start gap-4">
                                {/* Rank */}
                                <div className="w-10 h-10 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-bold text-slate-300">#{i + 1}</span>
                                </div>

                                {/* Zone info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-sm font-semibold text-white">{zone.zone_name}</h3>
                                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                <MapPin size={10} />{zone.district}, {zone.state}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className={`text-lg font-bold ${gapColor(zone.gap_rate_pct)}`}>{zone.gap_rate_pct.toFixed(1)}%</p>
                                            <p className="text-[10px] text-slate-500">gap rate</p>
                                        </div>
                                    </div>

                                    {/* Stats row */}
                                    <div className="grid grid-cols-4 gap-3 mt-3">
                                        <MiniStat label="Eligible" value={zone.eligible_count} />
                                        <MiniStat label="Gap Citizens" value={zone.gap_count} highlight />
                                        <div className="col-span-2">
                                            <p className="text-[10px] text-slate-500 mb-1">Social ROI Score</p>
                                            <ROIBar score={zone.ngo_roi_score} />
                                        </div>
                                    </div>

                                    {/* Barrier + scheme tags */}
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {zone.top_document_barrier && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-[10px] text-orange-300">
                                                <TrendingDown size={9} /> {zone.top_document_barrier}
                                            </span>
                                        )}
                                        {zone.top_scheme_gap && (
                                            <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] text-blue-300">
                                                Focus: {zone.top_scheme_gap}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function MiniStat({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
    return (
        <div>
            <p className={`text-sm font-bold ${highlight ? 'text-red-400' : 'text-white'}`}>{value.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500">{label}</p>
        </div>
    );
}
