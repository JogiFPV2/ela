import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useApp } from '../context/AppContext';
import { Check, Trash2, Plus } from 'lucide-react';
import { SearchableSelect } from '../components/SearchableSelect';
import 'react-day-picker/dist/style.css';
import type { Appointment } from '../types';

interface Option {
  id: string;
  name: string;
}

export const Calendar = () => {
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const { state, removeAppointment, updateAppointment, addAppointment } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Option | null>(null);
  const [expandedAppointmentId, setExpandedAppointmentId] = useState<string | null>(null);
  const [newAppointment, setNewAppointment] = useState({
    clientId: '',
    serviceId: '',
    time: '',
    amount: 0,
    notes: '',
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getDaysWithAppointments = () => {
    const uniqueDays = new Set(state.appointments.map(app => app.date));
    return Array.from(uniqueDays).map(date => new Date(date));
  };

  const handleClientSelect = (option: Option) => {
    setSelectedClient(option);
    setNewAppointment(prev => ({ ...prev, clientId: option.id }));
  };

  const getDayAppointments = () => {
    return state.appointments
      .filter(app => app.date === format(selectedDay, 'yyyy-MM-dd'))
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const getClientName = (clientId: string) => {
    const client = state.clients.find(c => c.id === clientId);
    return client?.name || 'Unknown Client';
  };

  const getServiceName = (serviceId: string) => {
    const service = state.services.find(s => s.id === serviceId);
    return service?.name || 'Unknown Service';
  };

  const togglePaid = (appointment: Appointment) => {
    updateAppointment({
      ...appointment,
      isPaid: !appointment.isPaid,
    });
  };

  const toggleDetails = (appointmentId: string) => {
    setExpandedAppointmentId(expandedAppointmentId === appointmentId ? null : appointmentId);
  };

  const updateNotes = (appointmentId: string, notes: string) => {
    const appointment = state.appointments.find(a => a.id === appointmentId);
    if (appointment) {
      updateAppointment({
        ...appointment,
        notes,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const appointment: Appointment = {
      ...newAppointment,
      id: crypto.randomUUID(),
      date: format(selectedDay, 'yyyy-MM-dd'),
      isPaid: false,
    };
    addAppointment(appointment);
    setNewAppointment({
      clientId: '',
      serviceId: '',
      time: '',
      amount: 0,
      notes: '',
    });
    setSelectedClient(null);
    setShowForm(false);
  };

  const today = new Date();
  const appointmentDays = getDaysWithAppointments();

  const modifiers = {
    today: today,
    hasAppointments: appointmentDays,
    noAppointments: {
      from: new Date(2020, 0),
      to: new Date(2030, 11, 31),
    },
  };

  const modifiersStyles = {
    today: {
      backgroundColor: '#fce7f3',
      fontWeight: 'bold',
    },
    hasAppointments: {
      backgroundColor: '#dcfce7',
    },
    noAppointments: {
      backgroundColor: '#f3f4f6',
    },
  };

  const clientOptions: Option[] = state.clients.map(client => ({
    id: client.id,
    name: client.name
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {format(currentTime, 'EEEE', { locale: pl })}
          <span className="text-gray-500 ml-2">
            {format(currentTime, 'HH:mm')}
          </span>
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Dodaj wizytę
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg shadow-lg ${isDesktop ? 'w-[600px]' : 'w-full'} max-h-[90vh] overflow-y-auto`}>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Nowa wizyta na {format(selectedDay, 'd MMMM yyyy', { locale: pl })}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Klient</label>
                    <SearchableSelect
                      options={clientOptions}
                      value={selectedClient}
                      onChange={handleClientSelect}
                      placeholder="Wyszukaj klienta..."
                    />
                  </div>
                  <div>
                    <label className="form-label">Usługa</label>
                    <select
                      required
                      value={newAppointment.serviceId}
                      onChange={(e) => {
                        const service = state.services.find(s => s.id === e.target.value);
                        setNewAppointment({
                          ...newAppointment,
                          serviceId: e.target.value,
                          amount: service ? service.price : 0,
                        });
                      }}
                      className="form-input"
                    >
                      <option value="">Wybierz usługę</option>
                      {state.services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} - {service.price} PLN
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Godzina</label>
                    <input
                      type="time"
                      required
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Notatki</label>
                    <textarea
                      value={newAppointment.notes}
                      onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                      className="form-input"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedClient(null);
                    }}
                    className="btn-secondary"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Zapisz
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className={`${isDesktop ? 'flex gap-6' : 'space-y-6'}`}>
        <div className="card p-4">
          <DayPicker
            mode="single"
            selected={selectedDay}
            onSelect={(day) => day && setSelectedDay(day)}
            locale={pl}
            className="border-0"
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
          />
        </div>

        <div className="flex-1">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Wizyty na {format(selectedDay, 'd MMMM yyyy', { locale: pl })}
          </h2>
          <div className="space-y-2">
            {getDayAppointments().map((appointment) => (
              <div
                key={appointment.id}
                className={`p-4 rounded-lg border transition-colors duration-200 ${
                  appointment.isPaid 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className={`${isDesktop ? 'flex justify-between' : 'space-y-3'} items-center`}>
                  <div className="flex items-center gap-4">
                    <div className="w-16 text-center">
                      <p className="font-medium text-gray-900">{appointment.time}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{getClientName(appointment.clientId)}</h3>
                      <p className="text-sm text-gray-600">{getServiceName(appointment.serviceId)}</p>
                    </div>
                  </div>
                  <div className={`flex ${isDesktop ? 'items-center' : 'items-start'} gap-4`}>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{appointment.amount} PLN</p>
                      <p className={`text-xs ${
                        appointment.isPaid ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {appointment.isPaid ? 'Opłacone' : 'Nieopłacone'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => togglePaid(appointment)}
                        className={`p-1.5 rounded transition-colors ${
                          appointment.isPaid
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                        title={appointment.isPaid ? 'Oznacz jako nieopłacone' : 'Oznacz jako opłacone'}
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => removeAppointment(appointment.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        title="Usuń wizytę"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => toggleDetails(appointment.id)}
                        className={`btn-secondary text-sm py-1 px-3 ${expandedAppointmentId === appointment.id ? 'bg-gray-100' : ''}`}
                      >
                        Szczegóły
                      </button>
                    </div>
                  </div>
                </div>
                {expandedAppointmentId === appointment.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <textarea
                      value={appointment.notes || ''}
                      onChange={(e) => updateNotes(appointment.id, e.target.value)}
                      placeholder="Dodaj notatkę..."
                      className="form-input"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            ))}
            {getDayAppointments().length === 0 && (
              <p className="text-center text-gray-500 py-8">
                Brak wizyt na ten dzień
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
