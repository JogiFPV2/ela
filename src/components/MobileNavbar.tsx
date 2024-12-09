import { NavLink } from 'react-router-dom';
import { Calendar, Users, Scissors, Clock, History } from 'lucide-react';

export const MobileNavbar = () => {
  return (
    <div className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="px-4">
        <div className="flex flex-col">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg font-semibold text-gray-900">Salon Manager</h1>
          </div>
          <nav className="flex justify-around items-center h-14 border-t border-gray-100">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-3 py-2 text-xs font-medium transition-colors ${
                  isActive 
                    ? 'text-gray-900' 
                    : 'text-gray-500'
                }`
              }
            >
              <Calendar size={20} className="mb-1" />
              <span>Kalendarz</span>
            </NavLink>
            <NavLink
              to="/clients"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-3 py-2 text-xs font-medium transition-colors ${
                  isActive 
                    ? 'text-gray-900' 
                    : 'text-gray-500'
                }`
              }
            >
              <Users size={20} className="mb-1" />
              <span>Klienci</span>
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-3 py-2 text-xs font-medium transition-colors ${
                  isActive 
                    ? 'text-gray-900' 
                    : 'text-gray-500'
                }`
              }
            >
              <Scissors size={20} className="mb-1" />
              <span>Usługi</span>
            </NavLink>
            <NavLink
              to="/appointments"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-3 py-2 text-xs font-medium transition-colors ${
                  isActive 
                    ? 'text-gray-900' 
                    : 'text-gray-500'
                }`
              }
            >
              <Clock size={20} className="mb-1" />
              <span>Wizyty</span>
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-3 py-2 text-xs font-medium transition-colors ${
                  isActive 
                    ? 'text-gray-900' 
                    : 'text-gray-500'
                }`
              }
            >
              <History size={20} className="mb-1" />
              <span>Historia</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
};
