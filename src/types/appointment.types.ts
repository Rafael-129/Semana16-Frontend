import { User } from './user.types';
import { Doctor } from './doctor.types';

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  diagnosis?: string;
  prescription?: string;
  patient: User;
  doctor: Doctor;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentData {
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  reason?: string;
}
