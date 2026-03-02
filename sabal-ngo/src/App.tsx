import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import HeatmapPage from './pages/HeatmapPage';
import PriorityListPage from './pages/PriorityListPage';
import SchemesGapPage from './pages/SchemesGapPage';
import Navbar from './components/Navbar';

function ProtectedLayout() {
    const { token } = useAuth();
    if (!token) return <Navigate to="/login" replace />;
    return (
        <div className="min-h-screen bg-[#0F172A] text-white">
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<HeatmapPage />} />
                    <Route path="/priority" element={<PriorityListPage />} />
                    <Route path="/schemes" element={<SchemesGapPage />} />
                </Routes>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/*" element={<ProtectedLayout />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
