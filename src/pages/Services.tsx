import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Service } from '../types';

export const Services = () => {
  const { state, addService, removeService } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    duration: 30,
    price: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const service: Service = {
      ...newService,
      id: crypto.randomUUID(),
    };
    addService(service);
    setNewService({ name: '', duration: 30, price: 0 });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Usługi</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Dodaj usługę
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="form-label">Nazwa usługi</label>
              <input
                type="text"
                required
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Czas trwania (min)</label>
              <input
                type="number"
                required
                min="1"
                value={newService.duration}
                onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) })}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Cena (PLN)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
                className="form-input"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
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
      )}

      <div className="card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="table-header">Nazwa usługi</th>
              <th className="table-header">Czas trwania</th>
              <th className="table-header">Cena</th>
              <th className="table-header w-16"></th>
            </tr>
          </thead>
          <tbody>
            {state.services.map((service) => (
              <tr key={service.id} className="border-b border-gray-100">
                <td className="table-cell">{service.name}</td>
                <td className="table-cell">{service.duration} min</td>
                <td className="table-cell">{service.price.toFixed(2)} PLN</td>
                <td className="table-cell">
                  <button
                    onClick={() => removeService(service.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {state.services.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            Brak usług w bazie
          </p>
        )}
      </div>
    </div>
  );
};
