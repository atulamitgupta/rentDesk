// =============================================================
//  Cloud Bass Rent Management — App.jsx
//  File : client/src/App.jsx
//
//  Root layout:
//    <div class="flex h-screen overflow-hidden bg-[#F8F8F7]">
//      <Sidebar />                ← w-64, h-full, overflow-y-auto
//      <div class="flex-1 flex flex-col h-full overflow-hidden">
//        <TopBar />               ← shrink-0 (never grows)
//        <main class="flex-1 overflow-y-auto p-6" />   ← scrolls
//      </div>
//    </div>
//
//  This structure ensures:
//    ✅ Sidebar never clips at the bottom
//    ✅ Only the main content area scrolls
//    ✅ Full-height layout on all screen sizes
//    ✅ Mobile hamburger collapses sidebar to slide-over
// =============================================================

import {
    useState, useEffect, lazy, Suspense
} from 'react';

import {
    Routes, Route, Navigate,
    useNavigate, useLocation, Link, Outlet
} from 'react-router-dom';
import { Building2, Menu, Bell, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { authApi } from './api/index.js';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import BottomNav from './components/BottomNav.jsx';

// ── Pages (Lazy Loaded) ───────────────────────────────────────
const Landing = lazy(() => import('./pages/Landing.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Properties = lazy(() => import('./pages/Properties.jsx'));
const Tenants = lazy(() => import('./pages/Tenants.jsx'));
const RentLedger = lazy(() => import('./pages/RentLedger.jsx'));
const Expenses = lazy(() => import('./pages/Expenses.jsx'));
const Maintenance = lazy(() => import('./pages/Maintenance.jsx'));
const Broadcast = lazy(() => import('./pages/Broadcast.jsx'));
const IncomeStats = lazy(() => import('./pages/IncomeStats.jsx'));
const Settings = lazy(() => import('./pages/Settings.jsx'));

// Common Pages
const AboutUs = lazy(() => import('./pages/AboutUs.jsx'));
const ContactUs = lazy(() => import('./pages/ContactUs.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'));
const TermsOfService = lazy(() => import('./pages/TermsOfService.jsx'));

// New Modules
const ReferEarn = lazy(() => import('./pages/ReferEarn.jsx'));
const LegalHub = lazy(() => import('./pages/LegalHub.jsx'));
const PublicReceipt = lazy(() => import('./pages/PublicReceipt.jsx'));
const SuperAdminDashboard = lazy(() => import('./pages/SuperAdminDashboard.jsx'));
import FounderPortalComponent from './pages/FounderPortal.jsx';
import FounderLayout from './components/FounderLayout';

// ── Shared Loading Fallback ───────────────────────────────────
const PageLoader = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" strokeWidth={3} />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Module...</p>
    </div>
);

// ── Components ───────────────────────────────────────────


// =============================================================
//  PRIVATE ROUTE GUARD
// =============================================================
// ── PRIVATE ROUTE GUARD ─────────────────────────────────────────
function PrivateRoute() {
    const { isAuth } = useAuth();
    const location = useLocation();
    return isAuth ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}

// ── LOGIN PAGE ──────────────────────────────────────────────────
function LoginPage() {
    const { login, isAuth, landlord } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (isAuth) {
        const target = landlord?.role === 'founder' ? '/master-control' : '/dashboard';
        return <Navigate to={target} replace />;
    }

    const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Normalization on frontend as well
            const credentials = {
                email: form.email.trim().toLowerCase(),
                password: form.password
            };

            const response = await authApi.login(credentials);
            const { success, token, landlord, message } = response.data;

            if (success && token && landlord) {
                login(token, landlord);
                // The useEffect/Navigate will handle the redirect automatically
                // But we'll navigate explicitly for immediate feedback
                const target = landlord.role === 'founder' ? '/master-control' : '/dashboard';
                toast.success('Successfully logged in');
                navigate(target, { replace: true });
            } else {
                setError(message || 'Authentication failed. Please verify your credentials.');
            }
        } catch (err) {
            console.error('[Login Error]:', err);
            const errMsg = err.response?.data?.message || 'Connection failure. Please ensure the server is running.';
            setError(errMsg);
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F8F7] flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 mb-10">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <Building2 size={20} className="text-white" />
                </div>
                <span className="font-extrabold text-slate-800 text-2xl tracking-tight">
                    Cloud<span className="text-orange-500">Bass</span>
                </span>
            </Link>

            {/* Card */}
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Welcome back</h1>
                <p className="text-sm text-slate-400 mb-8">Sign in to your landlord account</p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <label className="block">
                        <span className="text-sm font-semibold text-slate-700 mb-2 block">Email address</span>
                        <input
                            id="login-email"
                            type="email"
                            value={form.email}
                            onChange={set('email')}
                            placeholder="admin@rentdesk.in"
                            required autoFocus
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm font-semibold text-slate-700 mb-2 block">Password</span>
                        <input
                            id="login-password"
                            type="password"
                            value={form.password}
                            onChange={set('password')}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                        />
                    </label>

                    <button
                        id="login-submit"
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-60 text-white font-bold py-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                        {loading
                            ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            : 'Sign In →'}
                    </button>
                </form>

                <p className="text-center text-xs text-slate-400 mt-6 font-medium">
                    Admin: <span className="font-bold text-slate-600">admin@rentdesk.in</span> |
                    Owner: <span className="font-bold text-slate-600">owner@rentdesk.in</span>
                    <br /> Password: <span className="font-semibold text-slate-600">Admin@123</span>
                </p>
            </div>

            <Link to="/" className="mt-6 text-sm text-slate-400 hover:text-orange-500 transition-colors">
                ← Back to home
            </Link>
        </div>
    );
}

// =============================================================
//  TOP BAR — shown inside the protected layout
// =============================================================
function TopBar() {
    const { logout, landlord } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showProfile, setShowProfile] = useState(false);

    const handleLogout = () => {
        logout();
        toast.success('Signed out');
        navigate('/login');
    };

    const PAGE_TITLES = {
        '/dashboard': 'Dashboard',
        '/properties': 'Properties',
        '/tenants': 'Tenants',
        '/payments': 'Payments',
        '/expenses': 'Expenses',
        '/maintenance': 'Maintenance',
        '/broadcast': 'Broadcast',
        '/income-stats': 'Income Stats',
        '/settings': 'Settings',
        '/master-control': 'Master Control',
        '/master-control/analytics': 'Global Analytics',
        '/master-control/owners': 'Owner Directory',
        '/master-control/onboard': 'Onboard Owner',
        '/master-control/referrals': 'Referral Queue',
        '/master-control/templates': 'Master Templates',
        '/master-control/tool-stats': 'Tool Analytics',
        '/master-control/settings': 'System Settings',
    };
    const title = PAGE_TITLES[location.pathname] ?? 'CloudBass';

    return (
        <header className="sticky top-0 z-30 h-16 bg-[#F8F8F7]/80 backdrop-blur-md border-b border-orange-100 flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
                <h2 className="font-extrabold text-slate-800 text-lg tracking-tight">{title}</h2>
            </div>

            <div className="flex items-center gap-4">
                <button className="hidden sm:flex p-2 rounded-xl hover:bg-orange-50 transition-colors relative">
                    <Bell size={20} className="text-slate-500" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
                </button>

                <div className="relative">
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white border border-orange-50 hover:border-orange-200 transition-all shadow-sm active:scale-95"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-black shadow-inner">
                            {landlord?.full_name?.charAt(0) || 'L'}
                        </div>
                        <span className="hidden sm:inline text-xs font-bold text-slate-700 truncate max-w-[100px]">
                            {landlord?.full_name?.split(' ')[0]}
                        </span>
                    </button>

                    {showProfile && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
                            <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-orange-50 py-2 z-20 animate-in fade-in zoom-in duration-200 origin-top-right">
                                <div className="px-4 py-2 border-b border-slate-50 mb-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logged in as</p>
                                    <p className="text-xs font-bold text-slate-800 truncate">{landlord?.email}</p>
                                </div>
                                <button
                                    onClick={() => { navigate('/properties'); setShowProfile(false); }}
                                    className="w-full text-left px-4 py-2 hover:bg-orange-50 text-slate-600 font-bold text-sm transition-colors flex items-center gap-2"
                                >
                                    <Building2 size={16} className="text-orange-500" /> My Properties
                                </button>
                                <div className="h-px bg-slate-50 my-1" />
                                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 font-bold text-sm transition-colors flex items-center gap-2">
                                    <Menu size={16} className="rotate-180" /> Sign Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

// =============================================================
//  APP LAYOUT — wraps all protected pages
//  Key rules:
//    • Root div:  flex h-screen overflow-hidden
//    • Sidebar:   h-full w-64 shrink-0 (in Sidebar.jsx)
//    • Right col: flex-1 flex flex-col h-full overflow-hidden
//    • TopBar:    shrink-0
//    • Main:      flex-1 overflow-y-auto
// =============================================================
function AppLayout({ children }) {
    const [sideOpen, setSideOpen] = useState(false);
    const location = useLocation();

    // Close sidebar when route changes (mobile)
    useEffect(() => { setSideOpen(false); }, [location.pathname]);

    return (
        // ↓ Root container now allows scrolling, instead of being fixed to h-screen
        <div className="min-h-screen bg-[#F8F8F7] flex">

            {/* ── Mobile overlay ────────────────────────────────── */}
            {sideOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/25 backdrop-blur-sm lg:hidden"
                    onClick={() => setSideOpen(false)}
                />
            )}

            {/* ── Sidebar ── */}
            <div className={`
                fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out
                lg:relative lg:translate-x-0 lg:flex lg:shrink-0
                ${sideOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <Sidebar onClose={() => setSideOpen(false)} />
            </div>

            {/* ── Right column ─────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0">

                <TopBar />

                {/* Content area stretches with the page */}
                <main className="flex-1">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20 md:pb-6">
                        <Outlet />
                    </div>
                </main>

                {/* Mobile bottom navigation — hidden on desktop (md:hidden is inside BottomNav) */}
                <BottomNav onMenuClick={() => setSideOpen(!sideOpen)} />

            </div>
        </div>
    );
}

// ── APP LAYOUT WRAPPERS ──────────────────────────────────────
const StandardLayoutWrapper = () => (
    <AppLayout />
);

const FounderLayoutWrapper = () => (
    <FounderLayout />
);

// ── ROOT APP ────────────────────────────────────────────────────
export default function App() {
    return (
        <AuthProvider>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/receipt" element={<PublicReceipt />} />
                    <Route path="/tools" element={<LegalHub />} />

                    {/* Private Routes */}
                    <Route element={<PrivateRoute />}>
                        {/* Standard Landlord Dashboard Routes */}
                        <Route element={<StandardLayoutWrapper />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/properties" element={<Properties />} />
                            <Route path="/tenants" element={<Tenants />} />
                            <Route path="/payments" element={<RentLedger />} />
                            <Route path="/expenses" element={<Expenses />} />
                            <Route path="/maintenance" element={<Maintenance />} />
                            <Route path="/broadcast" element={<Broadcast />} />
                            <Route path="/income-stats" element={<IncomeStats />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/refer-earn" element={<ReferEarn />} />
                            <Route path="/super-admin" element={<SuperAdminDashboard />} />
                        </Route>

                        {/* Exclusive Founder Portal Routes */}
                        <Route path="/master-control/*" element={<FounderLayoutWrapper />}>
                            <Route path="*" element={<FounderPortalComponent />} />
                        </Route>
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </AuthProvider>
    );
}
