import { useState } from 'react';
import { Plus, Trash2, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { Client } from '../types';

export const Clients = () => {
  const navigate = useNavigate();
  const { state, addClient, removeClient } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client: Client = {
      ...newClient,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    addClient(client);
    setNewClient({ name: '', phone: '' });
    setShowForm(false);
  };

  const navigateToHistory = (client: Client) => {
    navigate('/history', { state: { selectedClient: client } });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Klienci</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Dodaj klienta
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Imię i nazwisko</label>
              <input
                type="text"
                required
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Telefon</label>
              <input
                type="tel"
                required
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
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
              <th className="table-header">Imię i nazwisko</th>
              <th className="table-header">Telefon</th>
              <th className="table-header">Data dodania</th>
              <th className="table-header w-32"></th>
            </tr>
          </thead>
          <tbody>
            {state.clients.map((client) => (
              <tr key={client.id} className="border-b border-gray-100">
                <td className="table-cell">{client.name}</td>
                <td className="table-cell">{client.phone}</td>
                <td className="table-cell">
                  {new Date(client.createdAt).toLocaleDateString()}
                </td>
                <td className="table-cell">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => navigateToHistory(client)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Historia wizyt"
                    >
                      <History size={20} />
                    </button>
                    <button
                      onClick={() => removeClient(client.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Usuń klienta"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {state.clients.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            Brak klientów w bazie
          </p>
        )}
      </div>
    </div>
  );
};
