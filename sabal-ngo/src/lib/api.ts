const BASE = 'https://sabal-ngo-api.onrender.com/api';

function authHeaders(): HeadersInit {
    const token = localStorage.getItem('sabal_ngo_token');
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

async function get<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE}${path}`, { headers: authHeaders() });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Request failed'); }
    return res.json();
}

export const zonesAPI = {
    getAll: () => get<{ zones: any[] }>('/zones'),
    getOne: (id: string) => get<{ zone: any }>(`/zones/${id}`),
    getPriorityList: () => get<{ zones: any[] }>('/zones/ranked/priority-list'),
};

export const insightsAPI = {
    getZoneInsight: (zoneId: string) => get<{ narrative: string; gap_count: number; gap_rate_pct: number }>(`/insights/${zoneId}`),
};

export const schemesAPI = {
    getGaps: () => get<{ schemes: any[] }>('/schemes/gaps'),
};
