import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { zonesAPI } from '../lib/api';
import ZoneDrawer from '../components/ZoneDrawer';
import { Loader2, Info } from 'lucide-react';
import L from 'leaflet';

// Fix leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: undefined, iconUrl: undefined, shadowUrl: undefined });

function gapColor(rate: number): string {
    if (rate >= 80) return '#EF4444';
    if (rate >= 60) return '#F97316';
    if (rate >= 40) return '#EAB308';
    return '#22C55E';
}

function gapLabel(rate: number): string {
    if (rate >= 80) return 'Critical';
    if (rate >= 60) return 'High';
    if (rate >= 40) return 'Medium';
    return 'Low';
}

export default function HeatmapPage() {
    const [zones, setZones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedZone, setSelectedZone] = useState<any | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        zonesAPI.getAll()
            .then(d => setZones(d.zones))
            .catch(() => setError('Failed to load zone data.'))
            .finally(() => setLoading(false));
    }, []);

    const stats = {
        total: zones.length,
        critical: zones.filter(z => z.gap_rate_pct >= 80).length,
        totalGap: zones.reduce((s, z) => s + z.gap_count, 0),
        totalEligible: zones.reduce((s, z) => s + z.eligible_count, 0),
    };

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col">
            {/* Header bar */}
            <div className="px-6 py-3 bg-[#0F172A] border-b border-[#1E293B] flex items-center justify-between flex-shrink-0">
                <div>
                    <h1 className="text-base font-semibold text-white">Blind Spot Heatmap</h1>
                    <p className="text-xs text-slate-400">Geographic distribution of scheme delivery gaps across India</p>
                </div>
                {!loading && (
                    <div className="flex items-center gap-4 text-xs">
                        <Stat label="Zones Mapped" value={stats.total} />
                        <Stat label="Critical Zones" value={stats.critical} color="text-red-400" />
                        <Stat label="Total Eligible" value={stats.totalEligible.toLocaleString()} />
                        <Stat label="Unserved Citizens" value={stats.totalGap.toLocaleString()} color="text-orange-400" />
                    </div>
                )}
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Map */}
                <div className="flex-1 relative">
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 size={32} className="animate-spin text-red-400" />
                                <p className="text-slate-400 text-sm">Loading zone data…</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    ) : (
                        <MapContainer
                            center={[22.5, 82.5]}
                            zoom={5}
                            className="h-full w-full"
                            zoomControl={true}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                attribution='© OpenStreetMap contributors © CARTO'
                            />
                            {zones.map(zone => (
                                <CircleMarker
                                    key={zone.id}
                                    center={[zone.lat, zone.lng]}
                                    radius={Math.max(8, Math.min(22, zone.eligible_count / 15))}
                                    pathOptions={{
                                        fillColor: gapColor(zone.gap_rate_pct),
                                        color: gapColor(zone.gap_rate_pct),
                                        fillOpacity: 0.75,
                                        weight: 1.5,
                                    }}
                                    eventHandlers={{
                                        click: () => { setSelectedZone(zone); setDrawerOpen(true); },
                                    }}
                                >
                                    <Popup>
                                        <div className="text-xs">
                                            <p className="font-semibold mb-1">{zone.name}</p>
                                            <p>Gap: <span style={{ color: gapColor(zone.gap_rate_pct) }}>{zone.gap_rate_pct.toFixed(1)}% ({gapLabel(zone.gap_rate_pct)})</span></p>
                                            <p>Eligible: {zone.eligible_count} | Applied: {zone.applied_count}</p>
                                            <button
                                                onClick={() => { setSelectedZone(zone); setDrawerOpen(true); }}
                                                className="mt-2 text-blue-400 underline"
                                            >View Full Analysis →</button>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            ))}
                        </MapContainer>
                    )}

                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-[#1E293B]/90 backdrop-blur border border-[#334155] rounded-xl p-3 z-[999]">
                        <p className="text-[10px] text-slate-400 font-medium mb-2 uppercase tracking-wider">Gap Severity</p>
                        {[
                            { label: 'Critical (80%+)', color: '#EF4444' },
                            { label: 'High (60–80%)', color: '#F97316' },
                            { label: 'Medium (40–60%)', color: '#EAB308' },
                            { label: 'Low (<40%)', color: '#22C55E' },
                        ].map(({ label, color }) => (
                            <div key={label} className="flex items-center gap-2 mb-1">
                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                                <span className="text-[10px] text-slate-300">{label}</span>
                            </div>
                        ))}
                        <div className="mt-2 pt-2 border-t border-[#334155]">
                            <div className="flex items-center gap-1.5">
                                <Info size={10} className="text-slate-500" />
                                <span className="text-[9px] text-slate-500">Circle size = eligible count</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Zone Drawer */}
                {drawerOpen && selectedZone && (
                    <ZoneDrawer zone={selectedZone} onClose={() => setDrawerOpen(false)} />
                )}
            </div>
        </div>
    );
}

function Stat({ label, value, color = 'text-white' }: { label: string; value: string | number; color?: string }) {
    return (
        <div className="text-center">
            <p className={`font-bold text-sm ${color}`}>{value}</p>
            <p className="text-slate-500 text-[10px]">{label}</p>
        </div>
    );
}
