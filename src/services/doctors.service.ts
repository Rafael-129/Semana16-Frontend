import { apiClient } from './api.service';
import { Doctor } from '@/types/doctor.types';

export const doctorsService = {
  // Get all doctors
  getAll: async (specialtyId?: number) => {
    const query = specialtyId ? `?specialtyId=${specialtyId}` : '';
    return apiClient.get<Doctor[]>(`/doctors${query}`);
  },

  // Get doctor by ID
  getById: async (id: number) => {
    return apiClient.get<Doctor>(`/doctors/${id}`);
  },

  // Create doctor (Admin only)
  create: async (data: any) => {
    return apiClient.post<Doctor>('/doctors', data);
  },

  // Update doctor (Admin only)
  update: async (id: number, data: any) => {
    return apiClient.put<Doctor>(`/doctors/${id}`, data);
  },

  // Delete doctor (Admin only)
  delete: async (id: number) => {
    return apiClient.delete(`/doctors/${id}`);
  }
};
