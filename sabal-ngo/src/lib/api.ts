const ENV_URL = import.meta.env.VITE_API_URL;
const BASE = (ENV_URL && ENV_URL.trim() !== '') ? ENV_URL : 'https://sabal-ngo-api.onrender.com/api'; function authHeaders(): HeadersInit {
    const token = localStorage.getItem('sabal_ngo_token');
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

async function get<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE}${path}`, { headers: authHeaders() });
    if (!res.ok) {
        const isJson = res.headers.get('content-type')?.includes('application/json');
        if (isJson) {
            const e = await res.json();
            throw new Error(e.error || 'Request failed');
        } else {
            const text = await res.text();
            throw new Error(`Server Error (${res.status}): ${text.substring(0, 100)}`);
        }
    }
    const isJson = res.headers.get('content-type')?.includes('application/json');
    if (!isJson) {
        throw new Error('Unexpected non-JSON response from server');
    }
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
