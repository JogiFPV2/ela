export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          created_at: string
          name: string
          phone: string
          email: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          phone: string
          email?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          phone?: string
          email?: string | null
        }
      }
      services: {
        Row: {
          id: string
          name: string
          duration: number
          price: number
        }
        Insert: {
          id?: string
          name: string
          duration: number
          price: number
        }
        Update: {
          id?: string
          name?: string
          duration?: number
          price?: number
        }
      }
      appointments: {
        Row: {
          id: string
          created_at: string
          client_id: string
          service_id: string
          date: string
          time: string
          is_paid: boolean
          amount: number
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          client_id: string
          service_id: string
          date: string
          time: string
          is_paid?: boolean
          amount: number
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          client_id?: string
          service_id?: string
          date?: string
          time?: string
          is_paid?: boolean
          amount?: number
          notes?: string | null
        }
      }
    }
  }
}
