'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Doctor } from '@/types/doctor.types';
import { doctorsService } from '@/services/doctors.service';
import { appointmentsService } from '@/services/appointments.service';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/constants';

export default function NewAppointmentPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    } else if (isAuthenticated) {
      loadDoctors();
      const doctorId = searchParams.get('doctorId');
      if (doctorId) {
        setSelectedDoctor(parseInt(doctorId));
      }
    }
  }, [isAuthenticated, authLoading, router, searchParams]);

  useEffect(() => {
    if (selectedDoctor && appointmentDate) {
      loadAvailableSlots();
    }
  }, [selectedDoctor, appointmentDate]);

  const loadDoctors = async () => {
    try {
      const response = await doctorsService.getAll();
      if (response.data) {
        setDoctors(response.data);
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedDoctor || !appointmentDate) return;
    
    try {
      const response = await appointmentsService.getAvailableSlots(selectedDoctor, appointmentDate);
      if (response.data) {
        setAvailableSlots(response.data);
      }
    } catch (error) {
      console.error('Error loading slots:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      setError('Por favor completa todos los campos requeridos');
      setLoading(false);
      return;
    }

    try {
      await appointmentsService.create({
        doctorId: selectedDoctor,
        appointmentDate,
        appointmentTime,
        reason
      });
      
      alert('¡Cita agendada exitosamente!');
      router.push(ROUTES.APPOINTMENTS);
    } catch (err: any) {
      setError(err.message || 'Error al agendar la cita');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Agendar Nueva Cita 📅</h1>

        <Card>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Seleccionar Doctor <span className="text-red-500">*</span>
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedDoctor === doctor.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <p className="font-bold text-gray-900">Dr. {doctor.user.fullName}</p>
                    <p className="text-sm text-blue-600">{doctor.specialty.icon} {doctor.specialty.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <Input
              label="Fecha de la Cita"
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />

            {appointmentDate && availableSlots.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Horario Disponible <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setAppointmentTime(slot)}
                      className={`p-3 border-2 rounded-lg font-semibold transition-all ${
                        appointmentTime === slot
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Motivo de la Consulta
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe el motivo de tu consulta..."
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder-gray-400"
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || !selectedDoctor || !appointmentDate || !appointmentTime}
                fullWidth
              >
                {loading ? 'Agendando...' : 'Agendar Cita'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
