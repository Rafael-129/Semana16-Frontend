'use client';

import { useState, useEffect } from 'react';
import { doctorsService } from '@/services/doctors.service';
import { specialtiesService } from '@/services/specialties.service';

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Specialty {
  id: number;
  name: string;
}

export default function AddDoctorModal({ isOpen, onClose, onSuccess }: AddDoctorModalProps) {
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
  const [success, setSuccess] = useState<{ email: string; password: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadSpecialties();
    }
  }, [isOpen]);

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
    setLoading(true);
    setError('');
    setSuccess(null);

    try {
      const data = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        specialtyId: parseInt(formData.specialtyId),
        licenseNumber: formData.licenseNumber,
        experience: formData.experience ? parseInt(formData.experience) : undefined,
        consultationFee: formData.consultationFee ? parseFloat(formData.consultationFee) : undefined,
        bio: formData.bio || undefined,
      };

      console.log('Sending data to backend:', data); // Debug log
      const response = await doctorsService.createComplete(data);
      console.log('Response from server:', response); // Debug log
      
      setSuccess({
        email: response.data?.credentials?.email || response.data?.doctor?.user?.email || '',
        password: response.data?.credentials?.defaultPassword || '',
      });
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        specialtyId: '',
        licenseNumber: '',
        experience: '',
        consultationFee: '',
        bio: '',
      });
    } catch (err: any) {
      console.error('Error creating doctor:', err); // Debug log
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear el doctor';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!success) {
      onClose();
    } else {
      setSuccess(null);
      onSuccess();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Agregar Doctor</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-green-600 text-5xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¡Doctor creado exitosamente!
              </h3>
              <p className="text-gray-700 mb-4">
                Se ha creado el usuario y el perfil del doctor. Estas son las credenciales:
              </p>
              <div className="bg-white border border-green-300 rounded-lg p-4 mb-4">
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-900 font-mono">{success.email}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Contraseña:</span>
                  <span className="ml-2 text-gray-900 font-mono">{success.password}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Por favor, guarda estas credenciales y compártelas con el doctor.
              </p>
              <button
                onClick={handleClose}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Cerrar
              </button>
            </div>
          ) : (
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
                  placeholder="Ej: Dr. Juan Pérez"
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
                  placeholder="doctor@ejemplo.com"
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
                  placeholder="+51 999 999 999"
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
                  placeholder="CMP-12345"
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
                    placeholder="5"
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
                    placeholder="100.00"
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
                  placeholder="Breve descripción profesional del doctor..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                >
                  {loading ? 'Creando...' : 'Crear Doctor'}
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
          )}
        </div>
      </div>
    </div>
  );
}
