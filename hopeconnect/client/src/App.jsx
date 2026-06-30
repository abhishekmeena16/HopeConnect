// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';

// Import our pages
import Landing from './pages/Landing'; // <-- Your beautiful new front door!
import Login from './pages/Login';
import Register from './pages/Register';

const Unauthorized = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="p-8 text-red-600 font-bold text-center bg-white rounded-xl shadow-sm border border-red-100">
      <h2 className="text-2xl mb-2">Unauthorized Access</h2>
      <p className="text-gray-600 font-normal">You do not have permission to view this page.</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} /> {/* <-- Swapped Home for Landing! */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Dashboard */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
          
          {/* Global Toast Notifications */}
          <Toaster 
            position="top-right" 
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: { background: '#059669' }, // Tailwind Emerald 600
              },
              error: {
                style: { background: '#EF4444' }, // Tailwind Red 500
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;