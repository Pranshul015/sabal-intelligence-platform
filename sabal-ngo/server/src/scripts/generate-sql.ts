/**
 * generate-sql.ts
 * Generates all seed INSERT statements to a .sql file.
 * No database connection needed — run with: npx tsx src/scripts/generate-sql.ts
 * Then paste the output SQL into Supabase SQL Editor.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function uuid(): string { return crypto.randomUUID(); }
function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function weightedChoice<T>(choices: T[], weights: number[]): T {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < choices.length; i++) { r -= weights[i]; if (r <= 0) return choices[i]; }
    return choices[choices.length - 1];
}

const SCHEMES = [
    { id: 'pm-kisan', title: 'PM Kisan Samman Nidhi', category: 'Agriculture', benefit: '₹6,000/year for farmers', benefit_amount: '₹6,000/year', max_income: 200000, gender_req: 'All', requires_aadhaar: true, requires_income_cert: false, requires_bank_account: true, requires_caste_cert: false, category_req: [] as string[] },
    { id: 'pm-awas', title: 'PM Awas Yojana (Rural)', category: 'Housing', benefit: 'Financial aid to build pucca house', benefit_amount: '₹1.2–1.3 Lakh', max_income: 300000, gender_req: 'All', requires_aadhaar: true, requires_income_cert: true, requires_bank_account: true, requires_caste_cert: false, category_req: [] as string[] },
    { id: 'mnrega', title: 'MNREGA', category: 'Employment', benefit: '100 days guaranteed wage', benefit_amount: '₹220–350/day', gender_req: 'All', requires_aadhaar: true, requires_income_cert: false, requires_bank_account: true, requires_caste_cert: false, category_req: [] as string[], max_income: undefined },
    { id: 'bbbp', title: 'Beti Bachao Beti Padhao', category: 'Education', benefit: 'Girl child education support', benefit_amount: null, max_age: 45, gender_req: 'Female', requires_aadhaar: true, requires_income_cert: false, requires_bank_account: false, requires_caste_cert: false, category_req: [] as string[], max_income: undefined },
    { id: 'pmegp', title: 'PMEGP', category: 'Employment', benefit: 'Subsidy for self-employment', benefit_amount: 'Up to 35% subsidy', max_income: 500000, min_age: 18, max_age: 45, gender_req: 'All', requires_aadhaar: true, requires_income_cert: true, requires_bank_account: true, requires_caste_cert: false, category_req: [] as string[] },
    { id: 'sc-scholarship', title: 'SC/ST Post-Matric Scholarship', category: 'Education', benefit: 'Full tuition + stipend', benefit_amount: '₹230–1,200/month', max_income: 250000, category_req: ['SC', 'ST'], gender_req: 'All', requires_aadhaar: true, requires_income_cert: true, requires_caste_cert: true, requires_bank_account: true },
    { id: 'obc-scholarship', title: 'OBC Pre-Matric Scholarship', category: 'Education', benefit: 'Pre-matric scholarship for OBC', benefit_amount: '₹100–250/month', max_income: 100000, category_req: ['OBC'], gender_req: 'All', requires_aadhaar: true, requires_income_cert: true, requires_caste_cert: true, requires_bank_account: true },
    { id: 'mudra', title: 'PM Mudra Yojana', category: 'Finance', benefit: 'Business loans without collateral', benefit_amount: 'Up to ₹10 Lakh', max_income: 1000000, min_age: 18, gender_req: 'All', requires_aadhaar: true, requires_income_cert: false, requires_bank_account: true, requires_caste_cert: false, category_req: [] as string[] },
    { id: 'jandhan', title: 'PM Jan Dhan Yojana', category: 'Finance', benefit: 'Zero-balance bank account + insurance', benefit_amount: null, gender_req: 'All', requires_aadhaar: true, requires_income_cert: false, requires_bank_account: false, requires_caste_cert: false, category_req: [] as string[], max_income: undefined },
    { id: 'ujjwala', title: 'PM Ujjwala Yojana', category: 'Energy', benefit: 'Free LPG connection for BPL women', benefit_amount: '₹1,600 subsidy', max_income: 150000, gender_req: 'Female', requires_aadhaar: true, requires_income_cert: true, requires_bank_account: true, requires_caste_cert: false, category_req: [] as string[] },
];

const ZONES_DATA = [
    { name: 'Barmer Rural Ward 1', state: 'Rajasthan', district: 'Barmer', ward: 'Ward 1', lat: 25.7463, lng: 71.3926, is_urban: false, population_estimate: 4800 },
    { name: 'Jaipur North Ward 12', state: 'Rajasthan', district: 'Jaipur', ward: 'Ward 12', lat: 26.9124, lng: 75.7873, is_urban: true, population_estimate: 6200 },
    { name: 'Dungarpur Tribal Zone', state: 'Rajasthan', district: 'Dungarpur', ward: 'Tribal Block', lat: 23.8433, lng: 73.7143, is_urban: false, population_estimate: 3500 },
    { name: 'Gorakhpur East Ward', state: 'Uttar Pradesh', district: 'Gorakhpur', ward: 'East Ward', lat: 26.7606, lng: 83.3732, is_urban: false, population_estimate: 5100 },
    { name: 'Lucknow Gomti Nagar', state: 'Uttar Pradesh', district: 'Lucknow', ward: 'Gomti Nagar', lat: 26.8467, lng: 81.0068, is_urban: true, population_estimate: 7800 },
    { name: 'Banda Rural Block', state: 'Uttar Pradesh', district: 'Banda', ward: 'Rural Block 4', lat: 25.4804, lng: 80.3352, is_urban: false, population_estimate: 4100 },
    { name: 'Araria Flood Zone', state: 'Bihar', district: 'Araria', ward: 'Flood Zone A', lat: 26.1490, lng: 87.4839, is_urban: false, population_estimate: 4600 },
    { name: 'Patna West Slum', state: 'Bihar', district: 'Patna', ward: 'West Slum Cluster', lat: 25.5941, lng: 85.1376, is_urban: true, population_estimate: 5500 },
    { name: 'Gaya Dalit Colony', state: 'Bihar', district: 'Gaya', ward: 'Dalit Colony 2', lat: 24.7963, lng: 85.0022, is_urban: false, population_estimate: 3800 },
    { name: 'Shivpuri Forest Ward', state: 'Madhya Pradesh', district: 'Shivpuri', ward: 'Forest Ward', lat: 25.4286, lng: 77.6591, is_urban: false, population_estimate: 3200 },
    { name: 'Bhopal Slum Zone 5', state: 'Madhya Pradesh', district: 'Bhopal', ward: 'Zone 5', lat: 23.2599, lng: 77.4126, is_urban: true, population_estimate: 6800 },
    { name: 'Balaghat Adivasi Block', state: 'Madhya Pradesh', district: 'Balaghat', ward: 'Adivasi Block', lat: 21.8138, lng: 80.1893, is_urban: false, population_estimate: 2900 },
    { name: 'Dharavi Ward 5', state: 'Maharashtra', district: 'Mumbai', ward: 'Ward 5', lat: 19.0450, lng: 72.8543, is_urban: true, population_estimate: 9200 },
    { name: 'Nandurbar Tribal', state: 'Maharashtra', district: 'Nandurbar', ward: 'Tribal Zone', lat: 21.3659, lng: 74.2373, is_urban: false, population_estimate: 3400 },
    { name: 'Osmanabad Rural', state: 'Maharashtra', district: 'Osmanabad', ward: 'Rural Block 1', lat: 18.1813, lng: 76.0385, is_urban: false, population_estimate: 4000 },
    { name: 'Murshidabad Char Area', state: 'West Bengal', district: 'Murshidabad', ward: 'Char Island A', lat: 24.1760, lng: 88.2719, is_urban: false, population_estimate: 4300 },
    { name: 'Sundarbans Block', state: 'West Bengal', district: 'South 24 Parganas', ward: 'Sundarbans Block', lat: 21.9497, lng: 88.9300, is_urban: false, population_estimate: 3700 },
    { name: 'Koraput Tribal Block', state: 'Odisha', district: 'Koraput', ward: 'Tribal Block 3', lat: 18.8135, lng: 82.7110, is_urban: false, population_estimate: 2800 },
    { name: 'Bhubaneswar Slum Ward', state: 'Odisha', district: 'Bhubaneswar', ward: 'Slum Ward 8', lat: 20.2961, lng: 85.8245, is_urban: true, population_estimate: 5000 },
    { name: 'Dumka Santhal Belt', state: 'Jharkhand', district: 'Dumka', ward: 'Santhal Block', lat: 24.2676, lng: 87.2476, is_urban: false, population_estimate: 3100 },
    { name: 'Ranchi Peripheral Ward', state: 'Jharkhand', district: 'Ranchi', ward: 'Peripheral Ward 14', lat: 23.3441, lng: 85.3096, is_urban: true, population_estimate: 4700 },
    { name: 'Bidar Dalit Block', state: 'Karnataka', district: 'Bidar', ward: 'Dalit Block', lat: 17.9153, lng: 77.5195, is_urban: false, population_estimate: 3500 },
    { name: 'Bengaluru Govt Quarter', state: 'Karnataka', district: 'Bengaluru Urban', ward: 'Govt Quarter Zone', lat: 12.9716, lng: 77.5946, is_urban: true, population_estimate: 6000 },
    { name: 'Dahod Tribal Zone', state: 'Gujarat', district: 'Dahod', ward: 'Tribal Zone 2', lat: 22.8309, lng: 74.2557, is_urban: false, population_estimate: 3300 },
    { name: 'Surat Mill Workers Zone', state: 'Gujarat', district: 'Surat', ward: 'Mill Workers Zone', lat: 21.1702, lng: 72.8311, is_urban: true, population_estimate: 7200 },
];

function esc(v: string | null | undefined): string {
    if (v === null || v === undefined) return 'NULL';
    return `'${v.replace(/'/g, "''")}'`;
}

function generateProfile(zone: typeof ZONES_DATA[0] & { id: string }) {
    const isUrban = zone.is_urban;
    const category = weightedChoice(['SC', 'ST', 'OBC', 'General', 'Minority'], [16, 9, 42, 28, 5]);
    const gender = weightedChoice(['Male', 'Female', 'Other'], [52, 47, 1]);
    const education = weightedChoice(['Illiterate', 'Primary', 'Secondary', 'Graduate'], isUrban ? [8, 22, 40, 30] : [25, 38, 28, 9]);
    const occupation = weightedChoice(['Farmer', 'Agricultural Labour', 'Skilled Labour', 'Self-employed', 'Salaried', 'Unemployed'], isUrban ? [5, 8, 25, 30, 22, 10] : [35, 28, 15, 10, 5, 7]);
    const age = rand(18, 68);
    const incomeBase = isUrban ? rand(80000, 600000) : rand(40000, 250000);
    const annualIncome = Math.round(incomeBase * (education === 'Graduate' ? 1.8 : education === 'Secondary' ? 1.2 : 1));
    const hasAadhaar = Math.random() < (isUrban ? 0.85 : 0.65);
    const hasCert = annualIncome < 120000 ? 0.25 : 0.45;
    const hasIncomeCert = hasAadhaar && Math.random() < hasCert;
    const hasCasteCert = ['SC', 'ST', 'OBC'].includes(category) && Math.random() < hasCert + 0.1;
    const hasBankAccount = Math.random() < (isUrban ? 0.75 : 0.55);
    return { zone_id: zone.id, state: zone.state, district: zone.district, ward: zone.ward, age, gender, category, annual_income: annualIncome, occupation, education, has_aadhaar: hasAadhaar, has_income_cert: hasIncomeCert, has_caste_cert: hasCasteCert, has_bank_account: hasBankAccount };
}

function matchSchemes(p: ReturnType<typeof generateProfile>) {
    return SCHEMES.filter(s => {
        if ((s as any).min_age && p.age < (s as any).min_age) return false;
        if ((s as any).max_age && p.age > (s as any).max_age) return false;
        if ((s as any).max_income && p.annual_income > (s as any).max_income) return false;
        if (s.gender_req && s.gender_req !== 'All' && s.gender_req !== p.gender) return false;
        if (s.category_req && s.category_req.length > 0 && !s.category_req.includes(p.category)) return false;
        return true;
    }).map(s => s.id);
}

function simulateApplications(p: ReturnType<typeof generateProfile>, eligibleIds: string[]) {
    return eligibleIds.filter(sid => {
        const s = SCHEMES.find(x => x.id === sid)!;
        let prob = 0.18;
        if (p.has_aadhaar) prob += 0.20;
        if (p.has_bank_account) prob += 0.15;
        if (p.has_income_cert && s.requires_income_cert) prob += 0.18;
        if (p.has_caste_cert && s.requires_caste_cert) prob += 0.12;
        if (p.education === 'Graduate') prob += 0.18;
        else if (p.education === 'Secondary') prob += 0.10;
        if (s.requires_aadhaar && !p.has_aadhaar) prob -= 0.40;
        if (s.requires_income_cert && !p.has_income_cert) prob -= 0.35;
        if (s.requires_caste_cert && !p.has_caste_cert) prob -= 0.30;
        if (s.requires_bank_account && !p.has_bank_account) prob -= 0.35;
        return Math.random() < Math.max(0.02, Math.min(prob, 0.92));
    });
}

console.log('🔧 Generating SQL...');
const lines: string[] = ['-- Sabal NGO Seed Data', `-- Generated at ${new Date().toISOString()}`, ''];

// Create tables if not exist
lines.push('-- Create tables (idempotent)');
lines.push(`CREATE TABLE IF NOT EXISTS "NgoScheme" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "benefit" TEXT NOT NULL,
  "benefit_amount" TEXT,
  "min_age" INTEGER,
  "max_age" INTEGER,
  "max_income" DOUBLE PRECISION,
  "gender_req" TEXT,
  "category_req" TEXT[] DEFAULT '{}',
  "requires_aadhaar" BOOLEAN NOT NULL DEFAULT true,
  "requires_income_cert" BOOLEAN NOT NULL DEFAULT false,
  "requires_caste_cert" BOOLEAN NOT NULL DEFAULT false,
  "requires_bank_account" BOOLEAN NOT NULL DEFAULT false
);`);
lines.push('');

// Clear existing data
lines.push('-- Clear existing data');
lines.push('DELETE FROM "ZoneAnalytics";');
lines.push('DELETE FROM "SyntheticProfile";');
lines.push('DELETE FROM "NgoScheme";');
lines.push('DELETE FROM "Zone";');
lines.push('DELETE FROM "NgoUser";');
lines.push('');

// Schemes
lines.push('-- Schemes');
for (const s of SCHEMES) {
    const cr = `'{${(s.category_req || []).join(',')}}'`;
    lines.push(`INSERT INTO "NgoScheme" (id, title, category, benefit, benefit_amount, max_income, min_age, max_age, gender_req, category_req, requires_aadhaar, requires_income_cert, requires_caste_cert, requires_bank_account) VALUES (${esc(s.id)}, ${esc(s.title)}, ${esc(s.category)}, ${esc(s.benefit)}, ${esc(s.benefit_amount ?? null)}, ${(s as any).max_income ?? 'NULL'}, ${(s as any).min_age ?? 'NULL'}, ${(s as any).max_age ?? 'NULL'}, ${esc(s.gender_req ?? null)}, ${cr}, ${s.requires_aadhaar}, ${s.requires_income_cert}, ${s.requires_caste_cert}, ${s.requires_bank_account});`);
}
lines.push('');

// Zones and profiles
lines.push('-- Zones');
const PROFILES_PER_ZONE = 45;
const zonesWithIds = ZONES_DATA.map(z => ({ ...z, id: uuid() }));

for (const z of zonesWithIds) {
    lines.push(`INSERT INTO "Zone" (id, name, state, district, ward, lat, lng, population_estimate, is_urban) VALUES (${esc(z.id)}, ${esc(z.name)}, ${esc(z.state)}, ${esc(z.district)}, ${esc(z.ward)}, ${z.lat}, ${z.lng}, ${z.population_estimate}, ${z.is_urban});`);
}
lines.push('');

lines.push('-- Profiles and ZoneAnalytics');
for (const zone of zonesWithIds) {
    const profilesWithSchemes = Array.from({ length: PROFILES_PER_ZONE }, () => {
        const p = generateProfile(zone);
        const eligibleIds = matchSchemes(p);
        const appliedIds = simulateApplications(p, eligibleIds);
        return { ...p, eligibleIds, appliedIds };
    });

    // Profile inserts
    for (const p of profilesWithSchemes) {
        const pid = uuid();
        const eligArr = `'{${p.eligibleIds.join(',')}}'`;
        const applArr = `'{${p.appliedIds.join(',')}}'`;
        lines.push(`INSERT INTO "SyntheticProfile" (id, zone_id, state, district, ward, age, gender, category, annual_income, occupation, education, has_aadhaar, has_income_cert, has_caste_cert, has_bank_account, eligible_scheme_ids, applied_scheme_ids) VALUES (${esc(pid)}, ${esc(zone.id)}, ${esc(p.state)}, ${esc(p.district)}, ${esc(p.ward)}, ${p.age}, ${esc(p.gender)}, ${esc(p.category)}, ${p.annual_income}, ${esc(p.occupation)}, ${esc(p.education)}, ${p.has_aadhaar}, ${p.has_income_cert}, ${p.has_caste_cert}, ${p.has_bank_account}, ${eligArr}, ${applArr});`);
    }

    // Compute analytics
    const eligible = profilesWithSchemes.filter(p => p.eligibleIds.length > 0);
    const applied = profilesWithSchemes.filter(p => p.appliedIds.length > 0);
    const gapProfiles = eligible.filter(p => p.appliedIds.length < p.eligibleIds.length);
    const gapCount = Math.max(0, eligible.length - applied.length);
    const gapRate = eligible.length > 0 ? Math.round((gapCount / eligible.length) * 1000) / 10 : 0;
    const barriers = { no_aadhaar: 0, no_income_cert: 0, no_caste_cert: 0, no_bank_account: 0 };
    gapProfiles.forEach(p => { if (!p.has_aadhaar) barriers.no_aadhaar++; if (!p.has_income_cert) barriers.no_income_cert++; if (!p.has_caste_cert) barriers.no_caste_cert++; if (!p.has_bank_account) barriers.no_bank_account++; });
    const topBarrier = Object.entries(barriers).sort((a, b) => b[1] - a[1])[0]?.[0]?.replace('no_', '').replace('_', ' ') ?? null;

    const schemeGaps: Record<string, any> = {};
    SCHEMES.forEach(s => {
        const el = profilesWithSchemes.filter(p => p.eligibleIds.includes(s.id)).length;
        const ap = profilesWithSchemes.filter(p => p.appliedIds.includes(s.id)).length;
        if (el > 0) schemeGaps[s.id] = { title: s.title, eligible: el, applied: ap, gap: el - ap };
    });
    const topSchemeGap = Object.entries(schemeGaps).sort((a: any, b: any) => b[1].gap - a[1].gap)[0]?.[1]?.title ?? null;

    const catCount: Record<string, number> = {};
    gapProfiles.forEach(p => { catCount[p.category] = (catCount[p.category] || 0) + 1; });
    const domCat = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Mixed';
    const avgAge = gapProfiles.reduce((s, p) => s + p.age, 0) / (gapProfiles.length || 1);
    const ageGroup = avgAge < 30 ? '18–30' : avgAge < 45 ? '30–45' : '45+';
    const femCount = gapProfiles.filter(p => p.gender === 'Female').length;
    const domGender = femCount > gapProfiles.length * 0.55 ? 'Female' : femCount < gapProfiles.length * 0.40 ? 'Male' : 'Mixed';
    const occCount: Record<string, number> = {};
    gapProfiles.forEach(p => { occCount[p.occupation] = (occCount[p.occupation] || 0) + 1; });
    const domOcc = Object.entries(occCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Mixed';
    const barrierDiff = (barriers.no_income_cert + barriers.no_caste_cert) > gapProfiles.length * 0.5 ? 3 : 2;
    const roiScore = Math.min(100, Math.round((gapCount * 50000) / (barrierDiff * 1000) / 5));

    const demog = JSON.stringify({ category: domCat, age_group: ageGroup, gender: domGender, occupation: domOcc }).replace(/'/g, "''");
    const barrierJson = JSON.stringify(barriers).replace(/'/g, "''");
    const schemeGapJson = JSON.stringify(schemeGaps).replace(/'/g, "''");

    const aid = uuid();
    lines.push(`INSERT INTO "ZoneAnalytics" (id, zone_id, eligible_count, applied_count, gap_count, gap_rate_pct, ngo_roi_score, top_document_barrier, top_scheme_gap, barrier_breakdown, scheme_gaps, dominant_demographics, computed_at) VALUES (${esc(aid)}, ${esc(zone.id)}, ${eligible.length}, ${applied.length}, ${gapCount}, ${gapRate}, ${roiScore}, ${esc(topBarrier)}, ${esc(topSchemeGap)}, '${barrierJson}'::jsonb, '${schemeGapJson}'::jsonb, '${demog}'::jsonb, NOW());`);

    console.log(`  ✅ ${zone.name}: gap ${gapRate}%, ROI ${roiScore}`);
}

// Demo NGO user
const ngoId = uuid();
// bcrypt hash of 'ngo@sabal2024' at cost 12:
const hashedPw = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGqQSaB1D0Eu0XHr4yFkCnPdRby';
lines.push(`INSERT INTO "NgoUser" (id, email, password, organization) VALUES (${esc(ngoId)}, 'demo@sabal-ngo.org', ${esc(hashedPw)}, 'Sabal NGO Demo');`);

const outPath = path.join(process.cwd(), 'seed.sql');
fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log(`\n✅ SQL written to ${outPath}`);
console.log(`   Lines: ${lines.length} | Zones: ${zonesWithIds.length} | Profiles: ${zonesWithIds.length * PROFILES_PER_ZONE}`);
console.log('   Paste this file into Supabase SQL Editor and run it.');
