import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useState } from 'react';
import { ShoppingBag, LogIn, LogOut, PlusCircle, Menu } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-indigo-500 text-white shadow">
            <ShoppingBag size={18} />
          </span>
          <span>MiniMart</span>
        </Link>
        <button className="md:hidden p-2 rounded-full hover:bg-white/60" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open} aria-controls="mobile-menu">
          <Menu size={20} />
        </button>
        {/* Desktop nav */}
        <nav className={`hidden md:flex items-center gap-3`}>
          <NavLink to="/" className={({ isActive }) => `px-3 py-2 rounded-full hover:bg-white/70 ${isActive ? 'text-indigo-600' : 'text-gray-700'}`}>Home</NavLink>
          <NavLink to="/sell" className={({ isActive }) => `px-3 py-2 rounded-full hover:bg-white/70 ${isActive ? 'text-indigo-600' : 'text-gray-700'}`}>Sell</NavLink>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm text-gray-600">{user?.name || user?.email}</span>
              <button onClick={handleLogout} className="px-4 py-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 inline-flex items-center gap-2">
                <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login" className="px-4 py-2 rounded-full bg-white/70 hover:bg-white inline-flex items-center gap-2 text-gray-800">
                <LogIn size={18} /> Login
              </NavLink>
              <NavLink to="/signup" className="px-4 py-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 inline-flex items-center gap-2">
                <PlusCircle size={18} /> Sign up
              </NavLink>
            </div>
          )}
        </nav>
        {/* Mobile nav panel */}
      </div>
      {/* Mobile dropdown (overlay) */}
      <div id="mobile-menu" className={`md:hidden ${open ? 'block' : 'hidden'}`}>
        <div className="container pb-3">
          <div className="card p-3">
            <ul className="divide-y divide-gray-100">
              <li>
                <NavLink to="/" onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-3 ${isActive ? 'text-indigo-600 font-medium' : 'text-gray-800 hover:bg-white/70 rounded-xl'}`}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/sell" onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-3 ${isActive ? 'text-indigo-600 font-medium' : 'text-gray-800 hover:bg-white/70 rounded-xl'}`}>
                  Sell
                </NavLink>
              </li>
              <li className="py-3">
                {isAuthenticated ? (
                  <button onClick={() => { setOpen(false); handleLogout(); }} className="w-full px-3 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 inline-flex items-center justify-center gap-2">
                    <LogOut size={18} /> Logout
                  </button>
                ) : (
                  <ul className="grid grid-cols-2 gap-2">
                    <li>
                      <NavLink to="/login" onClick={() => setOpen(false)} className="block w-full px-3 py-2 rounded-xl bg-white/80 hover:bg-white text-center text-gray-800">
                        Login
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/signup" onClick={() => setOpen(false)} className="block w-full px-3 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 text-center">
                        Sign up
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
