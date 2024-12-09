import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Client, Service, Appointment } from '../types';

const AppContext = createContext<{
  state: {
    clients: Client[];
    services: Service[];
    appointments: Appointment[];
    isLoading: boolean;
  };
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Promise<void>;
  removeClient: (id: string) => Promise<void>;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  removeService: (id: string) => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>;
  updateAppointment: (appointment: Appointment) => Promise<void>;
  removeAppointment: (id: string) => Promise<void>;
}>({
  state: { clients: [], services: [], appointments: [], isLoading: true },
  addClient: async () => {},
  removeClient: async () => {},
  addService: async () => {},
  removeService: async () => {},
  addAppointment: async () => {},
  updateAppointment: async () => {},
  removeAppointment: async () => {},
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<{
    clients: Client[];
    services: Service[];
    appointments: Appointment[];
    isLoading: boolean;
  }>({
    clients: [],
    services: [],
    appointments: [],
    isLoading: true,
  });

  useEffect(() => {
    // Początkowe pobranie danych
    const fetchData = async () => {
      try {
        const [
          { data: clients }, 
          { data: services }, 
          { data: appointments }
        ] = await Promise.all([
          supabase.from('clients').select('*'),
          supabase.from('services').select('*'),
          supabase.from('appointments').select('*')
        ]);

        setState(prev => ({
          ...prev,
          clients: clients || [],
          services: services || [],
          appointments: appointments || [],
          isLoading: false
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchData();

    // Subskrypcje real-time
    const clientsSubscription = supabase
      .channel('clients')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, 
        payload => {
          setState(prev => {
            const updatedClients = [...prev.clients];
            if (payload.eventType === 'INSERT') {
              updatedClients.push(payload.new as Client);
            } else if (payload.eventType === 'DELETE') {
              const index = updatedClients.findIndex(c => c.id === payload.old.id);
              if (index !== -1) updatedClients.splice(index, 1);
            }
            return { ...prev, clients: updatedClients };
          });
        }
      )
      .subscribe();

    const servicesSubscription = supabase
      .channel('services')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' },
        payload => {
          setState(prev => {
            const updatedServices = [...prev.services];
            if (payload.eventType === 'INSERT') {
              updatedServices.push(payload.new as Service);
            } else if (payload.eventType === 'DELETE') {
              const index = updatedServices.findIndex(s => s.id === payload.old.id);
              if (index !== -1) updatedServices.splice(index, 1);
            }
            return { ...prev, services: updatedServices };
          });
        }
      )
      .subscribe();

    const appointmentsSubscription = supabase
      .channel('appointments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' },
        payload => {
          setState(prev => {
            const updatedAppointments = [...prev.appointments];
            if (payload.eventType === 'INSERT') {
              updatedAppointments.push(payload.new as Appointment);
            } else if (payload.eventType === 'DELETE') {
              const index = updatedAppointments.findIndex(a => a.id === payload.old.id);
              if (index !== -1) updatedAppointments.splice(index, 1);
            } else if (payload.eventType === 'UPDATE') {
              const index = updatedAppointments.findIndex(a => a.id === payload.new.id);
              if (index !== -1) updatedAppointments[index] = payload.new as Appointment;
            }
            return { ...prev, appointments: updatedAppointments };
          });
        }
      )
      .subscribe();

    return () => {
      clientsSubscription.unsubscribe();
      servicesSubscription.unsubscribe();
      appointmentsSubscription.unsubscribe();
    };
  }, []);

  const addClient = async (client: Omit<Client, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([client])
        .select()
        .single();

      if (error) throw error;

      setState(prev => ({
        ...prev,
        clients: [...prev.clients, data]
      }));
    } catch (error) {
      console.error('Error adding client:', error);
      throw error;
    }
  };

  const removeClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        clients: prev.clients.filter(c => c.id !== id),
        appointments: prev.appointments.filter(a => a.clientId !== id)
      }));
    } catch (error) {
      console.error('Error removing client:', error);
      throw error;
    }
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([service])
        .select()
        .single();

      if (error) throw error;

      setState(prev => ({
        ...prev,
        services: [...prev.services, data]
      }));
    } catch (error) {
      console.error('Error adding service:', error);
      throw error;
    }
  };

  const removeService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        services: prev.services.filter(s => s.id !== id),
        appointments: prev.appointments.filter(a => a.serviceId !== id)
      }));
    } catch (error) {
      console.error('Error removing service:', error);
      throw error;
    }
  };

  const addAppointment = async (appointment: Omit<Appointment, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointment])
        .select()
        .single();

      if (error) throw error;

      setState(prev => ({
        ...prev,
        appointments: [...prev.appointments, data]
      }));
    } catch (error) {
      console.error('Error adding appointment:', error);
      throw error;
    }
  };

  const updateAppointment = async (appointment: Appointment) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update(appointment)
        .eq('id', appointment.id);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        appointments: prev.appointments.map(a =>
          a.id === appointment.id ? appointment : a
        )
      }));
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  };

  const removeAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        appointments: prev.appointments.filter(a => a.id !== id)
      }));
    } catch (error) {
      console.error('Error removing appointment:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        state,
        addClient,
        removeClient,
        addService,
        removeService,
        addAppointment,
        updateAppointment,
        removeAppointment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
