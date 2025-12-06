import { apiClient } from './api.service';
import { Appointment, CreateAppointmentData, AppointmentStatus } from '@/types/appointment.types';

export const appointmentsService = {
  // Get all appointments
  getAll: async (status?: AppointmentStatus) => {
    const query = status ? `?status=${status}` : '';
    return apiClient.get<Appointment[]>(`/appointments${query}`);
  },

  // Get appointment by ID
  getById: async (id: number) => {
    return apiClient.get<Appointment>(`/appointments/${id}`);
  },

  // Create appointment
  create: async (data: CreateAppointmentData) => {
    return apiClient.post<Appointment>('/appointments', data);
  },

  // Update appointment
  update: async (id: number, data: Partial<CreateAppointmentData>) => {
    return apiClient.put<Appointment>(`/appointments/${id}`, data);
  },

  // Update appointment status
  updateStatus: async (id: number, status: AppointmentStatus) => {
    return apiClient.patch<Appointment>(`/appointments/${id}/status`, { status });
  },

  // Cancel appointment
  cancel: async (id: number) => {
    return apiClient.patch<Appointment>(`/appointments/${id}/cancel`);
  },

  // Get available slots
  getAvailableSlots: async (doctorId: number, date: string) => {
    return apiClient.get<string[]>(`/appointments/available-slots?doctorId=${doctorId}&date=${date}`);
  }
};
