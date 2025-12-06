import { apiClient } from './api.service';
import { Specialty } from '@/types/doctor.types';

export const specialtiesService = {
  // Get all specialties
  getAll: async () => {
    return apiClient.get<Specialty[]>('/specialties');
  },

  // Create specialty (Admin only)
  create: async (data: { name: string; description?: string; icon?: string }) => {
    return apiClient.post<Specialty>('/specialties', data);
  },

  // Update specialty (Admin only)
  update: async (id: number, data: any) => {
    return apiClient.put<Specialty>(`/specialties/${id}`, data);
  },

  // Delete specialty (Admin only)
  delete: async (id: number) => {
    return apiClient.delete(`/specialties/${id}`);
  }
};
