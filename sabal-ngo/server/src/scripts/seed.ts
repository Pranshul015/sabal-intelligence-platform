import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─── SCHEMES CATALOG ───────────────────────────────────────────────────────────
const SCHEMES = [
    { id: 'pm-kisan', title: 'PM Kisan Samman Nidhi', category: 'Agriculture', benefit: '₹6,000/year for farmers', benefit_amount: '₹6,000/year', max_income: 200000, gender_req: 'All', requires_aadhaar: true, requires_income_cert: false, requires_bank_account: true },
    { id: 'pm-awas', title: 'PM Awas Yojana (Rural)', category: 'Housing', benefit: 'Financial aid to build pucca house', benefit_amount: '₹1.2–1.3 Lakh', max_income: 300000, gender_req: 'All', requires_aadhaar: true, requires_income_cert: true, requires_bank_account: true },
    { id: 'mnrega', title: 'MNREGA', category: 'Employment', benefit: '100 days guaranteed wage employment', benefit_amount: '₹220–350/day', gender_req: 'All', requires_aadhaar: true, requires_income_cert: false, requires_bank_account: true },
    { id: 'bbbp', title: 'Beti Bachao Beti Padhao', category: 'Education', benefit: 'Girl child education support', max_age: 45, gender_req: 'Female', requires_aadhaar: true, requires_income_cert: false, requires_bank_account: false },
    { id: 'pmegp', title: 'PMEGP', category: 'Employment', benefit: 'Subsidy for self-employment ventures', benefit_amount: 'Up to 35% subsidy', max_income: 500000, min_age: 18, max_age: 45, gender_req: 'All', requires_aadhaar: true, requires_income_cert: true, requires_bank_account: true },
    { id: 'sc-scholarship', title: 'SC/ST Post-Matric Scholarship', category: 'Education', benefit: 'Full tuition + stipend for SC/ST students', benefit_amount: '₹230–1,200/month', max_income: 250000, category_req: ['SC', 'ST'], gender_req: 'All', requires_aadhaar: true, requires_income_cert: true, requires_caste_cert: true, requires_bank_account: true },
    { id: 'obc-scholarship', title: 'OBC Pre-Matric Scholarship', category: 'Education', benefit: 'Pre-matric scholarship for OBC students', benefit_amount: '₹100–250/month', max_income: 100000, category_req: ['OBC'], gender_req: 'All', requires_aadhaar: true, requires_income_cert: true, requires_caste_cert: true, requires_bank_account: true },
    { id: 'mudra', title: 'PM Mudra Yojana', category: 'Finance', benefit: 'Business loans without collateral', benefit_amount: 'Up to ₹10 Lakh', max_income: 1000000, min_age: 18, gender_req: 'All', requires_aadhaar: true, requires_income_cert: false, requires_bank_account: true },
    { id: 'jandhan', title: 'PM Jan Dhan Yojana', category: 'Finance', benefit: 'Zero-balance bank account + insurance', gender_req: 'All', requires_aadhaar: true, requires_income_cert: false, requires_bank_account: false },
    { id: 'ujjwala', title: 'PM Ujjwala Yojana', category: 'Energy', benefit: 'Free LPG connection for BPL women', benefit_amount: '₹1,600 subsidy', max_income: 150000, gender_req: 'Female', requires_aadhaar: true, requires_income_cert: true, requires_bank_account: true },
];

// ─── GEOGRAPHIC ZONES ──────────────────────────────────────────────────────────
const ZONES = [
    // Rajasthan (3 zones)
    { name: 'Barmer Rural Ward 1', state: 'Rajasthan', district: 'Barmer', ward: 'Ward 1', lat: 25.7463, lng: 71.3926, is_urban: false, population_estimate: 4800 },
    { name: 'Jaipur North Ward 12', state: 'Rajasthan', district: 'Jaipur', ward: 'Ward 12', lat: 26.9124, lng: 75.7873, is_urban: true, population_estimate: 6200 },
    { name: 'Dungarpur Tribal Zone', state: 'Rajasthan', district: 'Dungarpur', ward: 'Tribal Block', lat: 23.8433, lng: 73.7143, is_urban: false, population_estimate: 3500 },
    // Uttar Pradesh (3 zones)
    { name: 'Gorakhpur East Ward', state: 'Uttar Pradesh', district: 'Gorakhpur', ward: 'East Ward', lat: 26.7606, lng: 83.3732, is_urban: false, population_estimate: 5100 },
    { name: 'Lucknow Gomti Nagar', state: 'Uttar Pradesh', district: 'Lucknow', ward: 'Gomti Nagar', lat: 26.8467, lng: 81.0068, is_urban: true, population_estimate: 7800 },
    { name: 'Banda Rural Block', state: 'Uttar Pradesh', district: 'Banda', ward: 'Rural Block 4', lat: 25.4804, lng: 80.3352, is_urban: false, population_estimate: 4100 },
    // Bihar (3 zones)
    { name: 'Araria Flood Zone', state: 'Bihar', district: 'Araria', ward: 'Flood Zone A', lat: 26.1490, lng: 87.4839, is_urban: false, population_estimate: 4600 },
    { name: 'Patna West Slum', state: 'Bihar', district: 'Patna', ward: 'West Slum Cluster', lat: 25.5941, lng: 85.1376, is_urban: true, population_estimate: 5500 },
    { name: 'Gaya Dalit Colony', state: 'Bihar', district: 'Gaya', ward: 'Dalit Colony 2', lat: 24.7963, lng: 85.0022, is_urban: false, population_estimate: 3800 },
    // Madhya Pradesh (3 zones)
    { name: 'Shivpuri Forest Ward', state: 'Madhya Pradesh', district: 'Shivpuri', ward: 'Forest Ward', lat: 25.4286, lng: 77.6591, is_urban: false, population_estimate: 3200 },
    { name: 'Bhopal Slum Zone 5', state: 'Madhya Pradesh', district: 'Bhopal', ward: 'Zone 5', lat: 23.2599, lng: 77.4126, is_urban: true, population_estimate: 6800 },
    { name: 'Balaghat Adivasi Block', state: 'Madhya Pradesh', district: 'Balaghat', ward: 'Adivasi Block', lat: 21.8138, lng: 80.1893, is_urban: false, population_estimate: 2900 },
    // Maharashtra (3 zones)
    { name: 'Dharavi Ward 5', state: 'Maharashtra', district: 'Mumbai', ward: 'Ward 5', lat: 19.0450, lng: 72.8543, is_urban: true, population_estimate: 9200 },
    { name: 'Nandurbar Tribal', state: 'Maharashtra', district: 'Nandurbar', ward: 'Tribal Zone', lat: 21.3659, lng: 74.2373, is_urban: false, population_estimate: 3400 },
    { name: 'Osmanabad Rural', state: 'Maharashtra', district: 'Osmanabad', ward: 'Rural Block 1', lat: 18.1813, lng: 76.0385, is_urban: false, population_estimate: 4000 },
    // West Bengal (2 zones)
    { name: 'Murshidabad Char Area', state: 'West Bengal', district: 'Murshidabad', ward: 'Char Island A', lat: 24.1760, lng: 88.2719, is_urban: false, population_estimate: 4300 },
    { name: 'South 24 Parganas Sundarbans', state: 'West Bengal', district: 'South 24 Parganas', ward: 'Sundarbans Block', lat: 21.9497, lng: 88.9300, is_urban: false, population_estimate: 3700 },
    // Odisha (2 zones)
    { name: 'Koraput Tribal Block', state: 'Odisha', district: 'Koraput', ward: 'Tribal Block 3', lat: 18.8135, lng: 82.7110, is_urban: false, population_estimate: 2800 },
    { name: 'Bhubaneswar Slum Ward', state: 'Odisha', district: 'Bhubaneswar', ward: 'Slum Ward 8', lat: 20.2961, lng: 85.8245, is_urban: true, population_estimate: 5000 },
    // Jharkhand (2 zones)
    { name: 'Dumka Santhal Belt', state: 'Jharkhand', district: 'Dumka', ward: 'Santhal Block', lat: 24.2676, lng: 87.2476, is_urban: false, population_estimate: 3100 },
    { name: 'Ranchi Peripheral Ward', state: 'Jharkhand', district: 'Ranchi', ward: 'Peripheral Ward 14', lat: 23.3441, lng: 85.3096, is_urban: true, population_estimate: 4700 },
    // Karnataka (2 zones)
    { name: 'Bidar Dalit Block', state: 'Karnataka', district: 'Bidar', ward: 'Dalit Block', lat: 17.9153, lng: 77.5195, is_urban: false, population_estimate: 3500 },
    { name: 'Bengaluru Govt Quarter', state: 'Karnataka', district: 'Bengaluru Urban', ward: 'Govt Quarter Zone', lat: 12.9716, lng: 77.5946, is_urban: true, population_estimate: 6000 },
    // Gujarat (2 zones)
    { name: 'Dahod Tribal Zone', state: 'Gujarat', district: 'Dahod', ward: 'Tribal Zone 2', lat: 22.8309, lng: 74.2557, is_urban: false, population_estimate: 3300 },
    { name: 'Surat Mill Workers Zone', state: 'Gujarat', district: 'Surat', ward: 'Mill Workers Zone', lat: 21.1702, lng: 72.8311, is_urban: true, population_estimate: 7200 },
];

// ─── HELPERS ───────────────────────────────────────────────────────────────────
function rand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function weightedChoice<T>(choices: T[], weights: number[]): T {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < choices.length; i++) {
        r -= weights[i];
        if (r <= 0) return choices[i];
    }
    return choices[choices.length - 1];
}

function generateProfile(zone: typeof ZONES[0] & { id: string }) {
    const isUrban = zone.is_urban;
    const category = weightedChoice(['SC', 'ST', 'OBC', 'General', 'Minority'], [16, 9, 42, 28, 5]);
    const gender = weightedChoice(['Male', 'Female', 'Other'], [52, 47, 1]);
    const education = weightedChoice(
        ['Illiterate', 'Primary', 'Secondary', 'Graduate'],
        isUrban ? [8, 22, 40, 30] : [25, 38, 28, 9]
    );
    const occupation = weightedChoice(
        ['Farmer', 'Agricultural Labour', 'Skilled Labour', 'Self-employed', 'Salaried', 'Unemployed'],
        isUrban ? [5, 8, 25, 30, 22, 10] : [35, 28, 15, 10, 5, 7]
    );
    const age = rand(18, 68);
    const income_base = isUrban ? rand(80000, 600000) : rand(40000, 250000);
    const annual_income = income_base * (education === 'Graduate' ? 1.8 : education === 'Secondary' ? 1.2 : 1);

    // Document availability — inversely correlated with poverty and rural location
    const aadhaarBase = isUrban ? 0.85 : 0.65;
    const certBase = annual_income < 120000 ? 0.25 : 0.45;
    const has_aadhaar = Math.random() < aadhaarBase;
    const has_income_cert = has_aadhaar && Math.random() < certBase;
    const has_caste_cert = ['SC', 'ST', 'OBC'].includes(category) && Math.random() < (certBase + 0.1);
    const has_bank_account = Math.random() < (isUrban ? 0.75 : 0.55);

    return { zone_id: zone.id, state: zone.state, district: zone.district, ward: zone.ward, age, gender, category, annual_income: Math.round(annual_income), occupation, education, has_aadhaar, has_income_cert, has_caste_cert, has_bank_account };
}

function getEligibleSchemes(profile: ReturnType<typeof generateProfile>) {
    return SCHEMES.filter(s => {
        if (s.min_age && profile.age < s.min_age) return false;
        if (s.max_age && profile.age > s.max_age) return false;
        if (s.max_income && profile.annual_income > s.max_income) return false;
        if (s.gender_req && s.gender_req !== 'All' && s.gender_req !== profile.gender) return false;
        if (s.category_req && s.category_req.length > 0 && !s.category_req.includes(profile.category)) return false;
        return true;
    }).map(s => s.id);
}

function simulateApplications(profile: ReturnType<typeof generateProfile>, eligibleIds: string[]) {
    return eligibleIds.filter(schemeId => {
        const scheme = SCHEMES.find(s => s.id === schemeId)!;
        // Calculate application probability based on document readiness and profile
        let prob = 0.18; // Base probability — most eligible people don't apply
        if (profile.has_aadhaar) prob += 0.20;
        if (profile.has_bank_account) prob += 0.15;
        if (profile.has_income_cert && scheme.requires_income_cert) prob += 0.18;
        if (profile.has_caste_cert && scheme.requires_caste_cert) prob += 0.12;
        if (profile.education === 'Graduate') prob += 0.18;
        else if (profile.education === 'Secondary') prob += 0.10;
        if (profile.zone_id) { /* zone effect handled by is_urban flag already */ }
        // Check if they actually have the required documents
        if (scheme.requires_aadhaar && !profile.has_aadhaar) prob -= 0.40;
        if (scheme.requires_income_cert && !profile.has_income_cert) prob -= 0.35;
        if (scheme.requires_caste_cert && !profile.has_caste_cert) prob -= 0.30;
        if (scheme.requires_bank_account && !profile.has_bank_account) prob -= 0.35;
        return Math.random() < Math.max(0.02, Math.min(prob, 0.92));
    });
}

function computeZoneAnalytics(
    zoneId: string,
    profiles: (ReturnType<typeof generateProfile> & { eligible_scheme_ids: string[]; applied_scheme_ids: string[] })[]
) {
    const eligible = profiles.filter(p => p.eligible_scheme_ids.length > 0);
    const applied = profiles.filter(p => p.applied_scheme_ids.length > 0);
    const gapProfiles = eligible.filter(p => p.applied_scheme_ids.length < p.eligible_scheme_ids.length);

    const gap_count = eligible.length - applied.length;
    const gap_rate_pct = eligible.length > 0 ? (gap_count / eligible.length) * 100 : 0;

    // Barrier breakdown — count missing documents among gap citizens
    const barriers: Record<string, number> = { no_aadhaar: 0, no_income_cert: 0, no_caste_cert: 0, no_bank_account: 0 };
    gapProfiles.forEach(p => {
        if (!p.has_aadhaar) barriers.no_aadhaar++;
        if (!p.has_income_cert) barriers.no_income_cert++;
        if (!p.has_caste_cert) barriers.no_caste_cert++;
        if (!p.has_bank_account) barriers.no_bank_account++;
    });

    const top_document_barrier = Object.entries(barriers).sort((a, b) => b[1] - a[1])[0]?.[0]?.replace('no_', '').replace('_', ' ') ?? null;

    // Scheme-level gap breakdown
    const scheme_gaps: Record<string, any> = {};
    SCHEMES.forEach(s => {
        const elig = profiles.filter(p => p.eligible_scheme_ids.includes(s.id)).length;
        const app = profiles.filter(p => p.applied_scheme_ids.includes(s.id)).length;
        if (elig > 0) scheme_gaps[s.id] = { title: s.title, eligible: elig, applied: app, gap: elig - app };
    });

    const top_scheme_gap = Object.entries(scheme_gaps).sort((a: any, b: any) => b[1].gap - a[1].gap)[0]?.[1]?.title ?? null;

    // Dominant demographics of the gap population
    const catCount: Record<string, number> = {};
    gapProfiles.forEach(p => { catCount[p.category] = (catCount[p.category] || 0) + 1; });
    const dominant_category = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Mixed';
    const avg_age = gapProfiles.reduce((s, p) => s + p.age, 0) / (gapProfiles.length || 1);
    const age_group = avg_age < 30 ? '18–30' : avg_age < 45 ? '30–45' : '45+';
    const femaleCount = gapProfiles.filter(p => p.gender === 'Female').length;
    const dominant_gender = femaleCount > gapProfiles.length * 0.55 ? 'Female' : femaleCount < gapProfiles.length * 0.40 ? 'Male' : 'Mixed';
    const occCount: Record<string, number> = {};
    gapProfiles.forEach(p => { occCount[p.occupation] = (occCount[p.occupation] || 0) + 1; });
    const dominant_occ = Object.entries(occCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Mixed';

    // Social ROI Score (0–100): high gap × high benefit potential ÷ barrier difficulty
    const barrier_difficulty = (barriers.no_income_cert + barriers.no_caste_cert) > (gapProfiles.length * 0.5) ? 3 : 2;
    const raw_roi = (gap_count * 50000) / (barrier_difficulty * 1000);
    const ngo_roi_score = Math.min(100, Math.round(raw_roi / 5));

    return {
        zone_id: zoneId,
        eligible_count: eligible.length,
        applied_count: applied.length,
        gap_count: Math.max(0, gap_count),
        gap_rate_pct: Math.round(gap_rate_pct * 10) / 10,
        ngo_roi_score,
        top_document_barrier,
        top_scheme_gap,
        scheme_gaps,
        barrier_breakdown: barriers,
        dominant_demographics: { category: dominant_category, age_group, gender: dominant_gender, occupation: dominant_occ },
        computed_at: new Date(),
    };
}

// ─── MAIN SEED FUNCTION ────────────────────────────────────────────────────────
async function main() {
    console.log('🌱 Seeding Sabal NGO database...');

    // Clear existing data
    await prisma.zoneAnalytics.deleteMany();
    await prisma.syntheticProfile.deleteMany();
    await prisma.scheme.deleteMany();
    await prisma.zone.deleteMany();
    await prisma.ngoUser.deleteMany();
    console.log('✅ Cleared existing data');

    // Seed schemes
    await prisma.scheme.createMany({ data: SCHEMES.map(s => ({ ...s, category_req: s.category_req || [] })) });
    console.log(`✅ Seeded ${SCHEMES.length} schemes`);

    // Seed zones
    const createdZones = await Promise.all(
        ZONES.map(z => prisma.zone.create({ data: z }))
    );
    console.log(`✅ Seeded ${createdZones.length} zones`);

    // Generate profiles per zone
    const PROFILES_PER_ZONE = 45; // 45 × 25 zones ≈ 1,125 profiles
    let totalProfiles = 0;

    for (const zone of createdZones) {
        const profileData = [];
        for (let i = 0; i < PROFILES_PER_ZONE; i++) {
            const base = generateProfile(zone);
            const eligible_scheme_ids = getEligibleSchemes(base);
            const applied_scheme_ids = simulateApplications(base, eligible_scheme_ids);
            profileData.push({ ...base, eligible_scheme_ids, applied_scheme_ids });
        }

        await prisma.syntheticProfile.createMany({ data: profileData });
        totalProfiles += profileData.length;

        // Compute and save zone analytics
        const analytics = computeZoneAnalytics(zone.id, profileData);
        await prisma.zoneAnalytics.create({ data: analytics });

        console.log(`  📍 ${zone.name}: ${analytics.eligible_count} eligible, ${analytics.gap_count} gap (${analytics.gap_rate_pct}%), ROI: ${analytics.ngo_roi_score}`);
    }

    console.log(`✅ Seeded ${totalProfiles} synthetic profiles`);

    // Create a demo NGO user
    const password = await bcrypt.hash('ngo@sabal2024', 12);
    await prisma.ngoUser.create({ data: { email: 'demo@sabal-ngo.org', password, organization: 'Sabal NGO Demo' } });
    console.log('✅ Created demo NGO user: demo@sabal-ngo.org / ngo@sabal2024');

    console.log('\n🎉 Database seeded successfully!');
    console.log('📊 Run the dev server to explore the data.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
