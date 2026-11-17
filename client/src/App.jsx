// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import { ShieldAlert, ArrowLeft, HeartHandshake } from 'lucide-react';

const Unauthorized = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC] text-slate-800 px-4 text-center">
    <div className="p-10 max-w-md w-full bg-white border border-slate-200 rounded-3xl shadow-xl">
      <div className="w-16 h-16 mx-auto mb-6 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center border border-rose-100 shadow-sm">
        <ShieldAlert size={32} />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2 font-heading">Access Restricted</h2>
      <p className="text-slate-500 text-sm mb-6 leading-relaxed">
        Your current account role does not have authorization permissions for this console.
      </p>
      <Link 
        to="/dashboard" 
        className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-md transition"
      >
        <ArrowLeft size={16} /> Return to Dashboard
      </Link>
    </div>
  </div>
);

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC] text-slate-800 px-4 text-center">
    <div className="p-10 max-w-md w-full bg-white border border-slate-200 rounded-3xl shadow-xl">
      <div className="w-14 h-14 mx-auto mb-5 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
        <HeartHandshake size={28} />
      </div>
      <span className="text-5xl font-black font-mono text-blue-600 mb-2 block">
        404
      </span>
      <h2 className="text-xl font-bold text-slate-900 mb-2 font-heading">Page Not Found</h2>
      <p className="text-slate-500 text-sm mb-6 leading-relaxed">
        The destination you are looking for does not exist or has been shifted within the network.
      </p>
      <Link 
        to="/" 
        className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md transition"
      >
        <ArrowLeft size={16} /> Back to HopeConnect Home
      </Link>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Operations Dashboard */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Global Notifications with Crisp White Theme */}
          <Toaster 
            position="top-right" 
            toastOptions={{
              duration: 3500,
              style: {
                background: '#FFFFFF',
                color: '#0F172A',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '14px 20px',
                fontSize: '13px',
                fontWeight: 600,
                boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.12), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
              },
              success: {
                iconTheme: {
                  primary: '#059669',
                  secondary: '#FFFFFF',
                },
              },
              error: {
                iconTheme: {
                  primary: '#E11D48',
                  secondary: '#FFFFFF',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;