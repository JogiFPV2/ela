import { useState } from 'react';
import { Plus, Trash2, Check, Edit2, ChevronDown, ChevronUp, X, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useMediaQuery } from 'react-responsive';
import type { Appointment } from '../types';

export const Appointments = () => {
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const { state, addAppointment, removeAppointment, updateAppointment } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newAppointment, setNewAppointment] = useState({
    clientId: '',
    serviceId: '',
    date: '',
    time: '',
    amount: 0,
    notes: '',
  });
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const appointment: Appointment = {
      ...newAppointment,
      id: crypto.randomUUID(),
      isPaid: false,
    };
    addAppointment(appointment);
    setNewAppointment({
      clientId: '',
      serviceId: '',
      date: '',
      time: '',
      amount: 0,
      notes: '',
    });
    setShowForm(false);
  };

  const togglePaid = (appointment: Appointment) => {
    updateAppointment({
      ...appointment,
      isPaid: !appointment.isPaid,
    });
  };

  const startEditing = (appointment: Appointment) => {
    setEditingId(appointment.id);
    setEditingAppointment(appointment);
  };

  const saveEdit = () => {
    if (editingAppointment) {
      updateAppointment(editingAppointment);
      setEditingId(null);
      setEditingAppointment(null);
    }
  };

  const toggleDetails = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const updateNotes = (id: string, notes: string) => {
    const appointment = state.appointments.find(a => a.id === id);
    if (appointment) {
      updateAppointment({
        ...appointment,
        notes,
      });
    }
  };

  return (
    <div>
      <div className={`flex ${isDesktop ? 'justify-between' : 'flex-col gap-4'} items-start mb-6`}>
        <div>
          <h1 className="page-title">Wizyty</h1>
          <p className="page-subtitle">Zarządzaj wizytami klientów</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary whitespace-nowrap"
        >
          <Plus size={18} />
          Dodaj wizytę
        </button>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h2 className="text-lg font-semibold text-gray-900">Nowa wizyta</h2>
              <button
                onClick={() => setShowForm(false)}
                className="btn-icon"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-body">
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Klient</label>
                    <select
                      required
                      value={newAppointment.clientId}
                      onChange={(e) => setNewAppointment({ ...newAppointment, clientId: e.target.value })}
                      className="form-input"
                    >
                      <option value="">Wybierz klienta</option>
                      {state.clients.map((client) => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                      ))}
                    </select>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Data</label>
                      <input
                        type="date"
                        required
                        value={newAppointment.date}
                        onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                        className="form-input"
                      />
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
              </div>
              <div className="form-footer">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
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
      )}

      <div className="space-y-4">
        {state.appointments.map((appointment) => {
          const client = state.clients.find(c => c.id === appointment.clientId);
          const service = state.services.find(s => s.id === appointment.serviceId);
          const isEditing = editingId === appointment.id;

          return (
            <div
              key={appointment.id}
              className="card"
            >
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-6">
                    <div className="text-lg font-medium text-gray-900 w-20">
                      {appointment.time}
                    </div>
                    <div className="space-y-1">
                      {isEditing ? (
                        <div className="space-y-3">
                          <select
                            value={editingAppointment?.clientId}
                            onChange={(e) => setEditingAppointment(prev => prev ? {...prev, clientId: e.target.value} : prev)}
                            className="form-input"
                          >
                            {state.clients.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                          <select
                            value={editingAppointment?.serviceId}
                            onChange={(e) => {
                              const service = state.services.find(s => s.id === e.target.value);
                              setEditingAppointment(prev => prev ? {
                                ...prev,
                                serviceId: e.target.value,
                                amount: service ? service.price : prev.amount
                              } : prev);
                            }}
                            className="form-input"
                          >
                            {state.services.map((s) => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                          <div className="flex gap-2">
                            <input
                              type="date"
                              value={editingAppointment?.date}
                              onChange={(e) => setEditingAppointment(prev => prev ? {...prev, date: e.target.value} : prev)}
                              className="form-input"
                            />
                            <input
                              type="time"
                              value={editingAppointment?.time}
                              onChange={(e) => setEditingAppointment(prev => prev ? {...prev, time: e.target.value} : prev)}
                              className="form-input"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-base font-medium text-gray-900">{client?.name}</h3>
                          <div className="flex items-center gap-3">
                            <p className="text-gray-600">{service?.name}</p>
                            <span className="text-gray-400">•</span>
                            <p className="text-gray-600">{appointment.date}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{appointment.amount} PLN</p>
                      <span className={`status-badge ${appointment.isPaid ? 'status-badge-success' : 'status-badge-pending'}`}>
                        {appointment.isPaid ? 'Opłacone' : 'Nieopłacone'}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {isEditing ? (
                        <button
                          onClick={saveEdit}
                          className="btn-icon"
                          title="Zapisz zmiany"
                        >
                          <Save size={18} />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => togglePaid(appointment)}
                            className="btn-icon"
                            title={appointment.isPaid ? 'Oznacz jako nieopłacone' : 'Oznacz jako opłacone'}
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => startEditing(appointment)}
                            className="btn-icon"
                            title="Edytuj"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => toggleDetails(appointment.id)}
                            className="btn-icon"
                            title="Szczegóły"
                          >
                            {expandedId === appointment.id ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => removeAppointment(appointment.id)}
                            className="btn-icon"
                            title="Usuń"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {expandedId === appointment.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <textarea
                      value={appointment.notes || ''}
                      onChange={(e) => updateNotes(appointment.id, e.target.value)}
                      className="form-input"
                      rows={3}
                      placeholder="Dodaj notatkę..."
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {state.appointments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Brak wizyt w bazie</p>
          </div>
        )}
      </div>
    </div>
  );
};
