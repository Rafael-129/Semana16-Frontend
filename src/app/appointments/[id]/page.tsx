'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Appointment } from '@/types/appointment.types';
import { appointmentsService } from '@/services/appointments.service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ROUTES, STATUS_COLORS, STATUS_LABELS } from '@/constants';
import EditAppointmentModal from '@/components/appointments/EditAppointmentModal';

function AppointmentDetailContent() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    } else if (isAuthenticated) {
      loadAppointment();
    }
  }, [isAuthenticated, authLoading, router, id]);

  const loadAppointment = async () => {
    try {
      setLoading(true);
      const response = await appointmentsService.getById(parseInt(id));
      if (response.data) {
        setAppointment(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar la cita');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!appointment) return;
    
    if (!confirm('¿Estás seguro de cancelar esta cita?')) return;

    try {
      setLoading(true);
      await appointmentsService.cancel(appointment.id);
      await loadAppointment();
    } catch (err: any) {
      setError(err.message || 'Error al cancelar la cita');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Cargando detalles...</p>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <p className="text-red-600 mb-4">{error || 'Cita no encontrada'}</p>
          <Button onClick={() => router.push(ROUTES.APPOINTMENTS)}>
            Volver a Mis Citas
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Detalles de la Cita 📋
          </h1>
          <Button onClick={() => router.push(ROUTES.APPOINTMENTS)} variant="secondary">
            ← Volver
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Información del Doctor */}
          <Card>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Doctor</h2>
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">👨‍⚕️</div>
              <h3 className="text-xl font-bold text-gray-900">
                Dr. {appointment.doctor.user.fullName}
              </h3>
              <p className="text-blue-600 font-semibold">
                {appointment.doctor.specialty.icon} {appointment.doctor.specialty.name}
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-900">📧 {appointment.doctor.user.email}</p>
              {appointment.doctor.user.phone && (
                <p className="text-gray-900">📱 {appointment.doctor.user.phone}</p>
              )}
              {appointment.doctor.experience && (
                <p className="text-gray-900">⭐ {appointment.doctor.experience} años de experiencia</p>
              )}
              {appointment.doctor.consultationFee && (
                <p className="text-gray-900">💰 S/ {appointment.doctor.consultationFee}</p>
              )}
            </div>
          </Card>

          {/* Información de la Cita */}
          <Card>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Información de la Cita</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm mb-1">Estado</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[appointment.status]}`}>
                  {STATUS_LABELS[appointment.status]}
                </span>
              </div>

              <div>
                <p className="text-gray-600 text-sm mb-1">Fecha</p>
                <p className="text-gray-900 font-semibold text-lg">
                  📅 {new Date(appointment.appointmentDate).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm mb-1">Hora</p>
                <p className="text-gray-900 font-semibold text-lg">
                  🕐 {appointment.appointmentTime}
                </p>
              </div>

              {appointment.reason && (
                <div>
                  <p className="text-gray-600 text-sm mb-1">Motivo de Consulta</p>
                  <p className="text-gray-900">{appointment.reason}</p>
                </div>
              )}

              {appointment.notes && (
                <div>
                  <p className="text-gray-600 text-sm mb-1">Notas del Doctor</p>
                  <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg">{appointment.notes}</p>
                </div>
              )}

              <div>
                <p className="text-gray-600 text-sm mb-1">Creada el</p>
                <p className="text-gray-900 text-sm">
                  {new Date(appointment.createdAt).toLocaleString('es-ES')}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Acciones */}
        {appointment.status === 'pending' || appointment.status === 'confirmed' ? (
          <Card className="mt-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Acciones</h3>
            <div className="flex gap-4">
              <Button
                onClick={handleCancel}
                disabled={loading}
                className="!bg-red-500 !text-white hover:!bg-red-600"
              >
                ❌ Cancelar Cita
              </Button>
              <Button
                onClick={() => setIsEditModalOpen(true)}
                variant="secondary"
              >
                ✏️ Editar Cita
              </Button>
            </div>
          </Card>
        ) : null}

        {/* Información Adicional */}
        <Card className="mt-6 bg-blue-50">
          <h3 className="text-lg font-bold mb-2 text-gray-900">ℹ️ Información Importante</h3>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li>Llega 15 minutos antes de tu cita</li>
            <li>Trae tu documento de identidad</li>
            <li>Si necesitas cancelar, hazlo con 24 horas de anticipación</li>
            <li>Trae resultados de exámenes previos si los tienes</li>
          </ul>
        </Card>
      </div>

      <EditAppointmentModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={loadAppointment}
        appointment={appointment}
      />
    </div>
  );
}

export default function AppointmentDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Cargando...</p>
      </div>
    }>
      <AppointmentDetailContent />
    </Suspense>
  );
}
