// client/src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center text-slate-800 px-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm mb-5 animate-pulse">
                    <HeartHandshake size={32} />
                </div>
                <div className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-2.5 rounded-full shadow-sm">
                    <Loader2 size={16} className="text-blue-600 animate-spin" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Verifying HopeConnect Credentials...
                    </span>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;