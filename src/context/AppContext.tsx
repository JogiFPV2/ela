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
    // Initial data fetch
    const fetchData = async () => {
      try {
        const [
          { data: clients, error: clientsError }, 
          { data: services, error: servicesError }, 
          { data: appointments, error: appointmentsError }
        ] = await Promise.all([
          supabase.from('clients').select('*'),
          supabase.from('services').select('*'),
          supabase.from('appointments').select('*')
        ]);

        if (clientsError) throw clientsError;
        if (servicesError) throw servicesError;
        if (appointmentsError) throw appointmentsError;

        setState(prev => ({
          ...prev,
          clients: clients?.map(c => ({
            id: c.id,
            name: c.name,
            phone: c.phone,
            email: c.email || undefined,
            createdAt: c.created_at
          })) || [],
          services: services || [],
          appointments: appointments?.map(a => ({
            id: a.id,
            clientId: a.client_id,
            serviceId: a.service_id,
            date: a.date,
            time: a.time,
            isPaid: a.is_paid,
            amount: a.amount,
            notes: a.notes || undefined
          })) || [],
          isLoading: false
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchData();

    // Real-time subscriptions
    const clientsSubscription = supabase
      .channel('clients')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, 
        payload => {
          setState(prev => {
            const updatedClients = [...prev.clients];
            if (payload.eventType === 'INSERT') {
              const newClient = {
                id: payload.new.id,
                name: payload.new.name,
                phone: payload.new.phone,
                email: payload.new.email || undefined,
                createdAt: payload.new.created_at
              };
              updatedClients.push(newClient);
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
              const newAppointment = {
                id: payload.new.id,
                clientId: payload.new.client_id,
                serviceId: payload.new.service_id,
                date: payload.new.date,
                time: payload.new.time,
                isPaid: payload.new.is_paid,
                amount: payload.new.amount,
                notes: payload.new.notes || undefined
              };
              updatedAppointments.push(newAppointment);
            } else if (payload.eventType === 'DELETE') {
              const index = updatedAppointments.findIndex(a => a.id === payload.old.id);
              if (index !== -1) updatedAppointments.splice(index, 1);
            } else if (payload.eventType === 'UPDATE') {
              const index = updatedAppointments.findIndex(a => a.id === payload.new.id);
              if (index !== -1) {
                updatedAppointments[index] = {
                  id: payload.new.id,
                  clientId: payload.new.client_id,
                  serviceId: payload.new.service_id,
                  date: payload.new.date,
                  time: payload.new.time,
                  isPaid: payload.new.is_paid,
                  amount: payload.new.amount,
                  notes: payload.new.notes || undefined
                };
              }
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
      const { error } = await supabase
        .from('clients')
        .insert([{
          name: client.name,
          phone: client.phone,
          email: client.email || null
        }]);

      if (error) throw error;
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
    } catch (error) {
      console.error('Error removing client:', error);
      throw error;
    }
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    try {
      const { error } = await supabase
        .from('services')
        .insert([service]);

      if (error) throw error;
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
    } catch (error) {
      console.error('Error removing service:', error);
      throw error;
    }
  };

  const addAppointment = async (appointment: Omit<Appointment, 'id'>) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .insert([{
          client_id: appointment.clientId,
          service_id: appointment.serviceId,
          date: appointment.date,
          time: appointment.time,
          is_paid: appointment.isPaid,
          amount: appointment.amount,
          notes: appointment.notes || null
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error adding appointment:', error);
      throw error;
    }
  };

  const updateAppointment = async (appointment: Appointment) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          client_id: appointment.clientId,
          service_id: appointment.serviceId,
          date: appointment.date,
          time: appointment.time,
          is_paid: appointment.isPaid,
          amount: appointment.amount,
          notes: appointment.notes || null
        })
        .eq('id', appointment.id);

      if (error) throw error;
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
