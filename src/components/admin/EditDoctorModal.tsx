'use client';

import { useState, useEffect } from 'react';
import { doctorsService } from '@/services/doctors.service';
import { specialtiesService } from '@/services/specialties.service';
import { Doctor } from '@/types/doctor.types';

interface EditDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  doctor: Doctor | null;
}

interface Specialty {
  id: number;
  name: string;
}

export default function EditDoctorModal({ isOpen, onClose, onSuccess, doctor }: EditDoctorModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialtyId: '',
    licenseNumber: '',
    experience: '',
    consultationFee: '',
    bio: '',
  });
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && doctor) {
      setFormData({
        fullName: doctor.user.fullName,
        email: doctor.user.email,
        phone: doctor.user.phone || '',
        specialtyId: doctor.specialtyId.toString(),
        licenseNumber: doctor.licenseNumber,
        experience: doctor.experience?.toString() || '',
        consultationFee: doctor.consultationFee?.toString() || '',
        bio: doctor.bio || '',
      });
      loadSpecialties();
    }
  }, [isOpen, doctor]);

  const loadSpecialties = async () => {
    try {
      const response = await specialtiesService.getAll();
      setSpecialties(response.data || []);
    } catch (err) {
      console.error('Error loading specialties:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor) return;

    setLoading(true);
    setError('');

    try {
      const data = {
        userId: doctor.userId,
        specialtyId: parseInt(formData.specialtyId),
        licenseNumber: formData.licenseNumber,
        experience: formData.experience ? parseInt(formData.experience) : undefined,
        consultationFee: formData.consultationFee ? parseFloat(formData.consultationFee) : undefined,
        bio: formData.bio || undefined,
        user: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone || undefined,
        }
      };

      await doctorsService.update(doctor.id, data);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error updating doctor:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar el doctor';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Editar Doctor</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="specialtyId" className="block text-sm font-medium text-gray-700 mb-1">
                Especialidad *
              </label>
              <select
                id="specialtyId"
                name="specialtyId"
                required
                value={formData.specialtyId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">Seleccionar especialidad</option>
                {specialties.map((specialty) => (
                  <option key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Número de Licencia *
              </label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                required
                value={formData.licenseNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Años de Experiencia
                </label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  min="0"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700 mb-1">
                  Tarifa de Consulta (S/)
                </label>
                <input
                  type="number"
                  id="consultationFee"
                  name="consultationFee"
                  min="0"
                  step="0.01"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Biografía
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 transition font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
