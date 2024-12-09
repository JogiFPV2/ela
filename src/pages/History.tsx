import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { X, Check, Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import type { Appointment, Client } from '../types';

export const History = () => {
  const location = useLocation();
  const { state } = useApp();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (location.state?.selectedClient) {
      setSelectedClient(location.state.selectedClient);
    }
  }, [location.state]);

  const sortedAppointments = [...state.appointments].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });

  const filterAppointments = () => {
    let filtered = sortedAppointments;
    
    if (selectedClient) {
      filtered = filtered.filter(app => app.clientId === selectedClient.id);
    }
    
    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      filtered = filtered.filter(app => app.date === dateStr);
    }
    
    return filtered;
  };

  const getClientName = (clientId: string) => {
    const client = state.clients.find(c => c.id === clientId);
    return client?.name || 'Unknown Client';
  };

  const getServiceName = (serviceId: string) => {
    const service = state.services.find(s => s.id === serviceId);
    return service?.name || 'Unknown Service';
  };

  const formatDate = (date: string, time: string) => {
    return format(new Date(`${date} ${time}`), 'dd MMMM yyyy, HH:mm', { locale: pl });
  };

  const clearFilters = () => {
    setSelectedClient(null);
    setSelectedDate(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="page-title">
            {selectedClient ? `Historia wizyt - ${selectedClient.name}` : 'Historia wizyt'}
          </h1>
          <p className="page-subtitle">
            {selectedClient && `Tel: ${selectedClient.phone}`}
            {selectedDate && ` • ${format(selectedDate, 'd MMMM yyyy', { locale: pl })}`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="btn-secondary"
          >
            <CalendarIcon size={18} />
            {selectedDate ? format(selectedDate, 'd MMM yyyy', { locale: pl }) : 'Wybierz datę'}
          </button>
          {(selectedClient || selectedDate) && (
            <button
              onClick={clearFilters}
              className="btn-secondary"
            >
              <X size={18} />
              Wyczyść filtry
            </button>
          )}
        </div>
      </div>

      {showCalendar && (
        <div className="mb-6">
          <div className="card p-4 inline-block">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setShowCalendar(false);
              }}
              locale={pl}
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filterAppointments().map((appointment) => (
          <div key={appointment.id} className="card">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">
                    {formatDate(appointment.date, appointment.time)}
                  </p>
                  {!selectedClient && (
                    <h3 className="text-lg font-medium text-gray-900">
                      {getClientName(appointment.clientId)}
                    </h3>
                  )}
                  <p className="text-gray-600">{getServiceName(appointment.serviceId)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{appointment.amount} PLN</p>
                    <span className={`status-badge ${
                      appointment.isPaid ? 'status-badge-success' : 'status-badge-pending'
                    }`}>
                      {appointment.isPaid ? 'Opłacone' : 'Nieopłacone'}
                    </span>
                  </div>
                  {appointment.isPaid && (
                    <Check size={18} className="text-green-600" />
                  )}
                </div>
              </div>
              {appointment.notes && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">{appointment.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        {filterAppointments().length === 0 && (
          <div className="text-center py-12 card">
            <p className="text-gray-500">
              Brak historii wizyt dla wybranych kryteriów
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
