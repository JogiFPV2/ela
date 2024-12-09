export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
}

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  date: string;
  time: string;
  isPaid: boolean;
  amount: number;
  notes?: string;
}

export interface AppState {
  clients: Client[];
  services: Service[];
  appointments: Appointment[];
}
