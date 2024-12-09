import { NavLink } from 'react-router-dom';
import { Calendar, Users, Scissors, Clock, History } from 'lucide-react';

export const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-semibold text-gray-900">Salon Manager</h1>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <Calendar size={18} />
          <span>Kalendarz</span>
        </NavLink>
        <NavLink
          to="/clients"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <Users size={18} />
          <span>Klienci</span>
        </NavLink>
        <NavLink
          to="/services"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <Scissors size={18} />
          <span>Usługi</span>
        </NavLink>
        <NavLink
          to="/appointments"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <Clock size={18} />
          <span>Wizyty</span>
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <History size={18} />
          <span>Historia</span>
        </NavLink>
      </nav>
    </div>
  );
};
