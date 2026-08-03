// client/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    // 1. Hold navigation until AuthContext finishes checking token status
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B1121] flex items-center justify-center text-white font-sans">
                <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-sm font-medium tracking-wider text-slate-400 uppercase">
                        Authenticating HopeConnect Session...
                    </span>
                </div>
            </div>
        );
    }

    // 2. If token is invalid or user is null after checking, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. Render dashboard cleanly once user is confirmed
    return children;
};

export default ProtectedRoute;