import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-primary">BankApp</div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                    <User size={20} />
                    <span className="font-medium">{user.username} ({user.role})</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
