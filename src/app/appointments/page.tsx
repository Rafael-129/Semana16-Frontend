'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Appointment } from '@/types/appointment.types';
import { appointmentsService } from '@/services/appointments.service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { STATUS_COLORS, STATUS_LABELS, ROUTES } from '@/constants';
import Link from 'next/link';

export default function AppointmentsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    } else if (isAuthenticated) {
      loadAppointments();
    }
  }, [isAuthenticated, authLoading, router]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentsService.getAll();
      if (response.data) {
        setAppointments(response.data);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('¿Estás seguro de cancelar esta cita?')) return;
    
    try {
      await appointmentsService.cancel(id);
      loadAppointments();
    } catch (error) {
      console.error('Error canceling appointment:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Cargando citas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Mis Citas 📋</h1>
          <Link href={ROUTES.NEW_APPOINTMENT}>
            <Button>+ Nueva Cita</Button>
          </Link>
        </div>

        {appointments.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-2xl text-gray-600 mb-4">No tienes citas programadas</p>
              <Link href={ROUTES.NEW_APPOINTMENT}>
                <Button>Agendar Primera Cita</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {appointments.map((appointment) => (
              <Card key={appointment.id} hover>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Dr. {appointment.doctor.user.fullName}
                    </h3>
                    <p className="text-blue-600 font-semibold">
                      {appointment.doctor.specialty.icon} {appointment.doctor.specialty.name}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[appointment.status]}`}>
                    {STATUS_LABELS[appointment.status]}
                  </span>
                </div>

                <div className="space-y-2 text-gray-700 mb-4">
                  <p>📅 <strong>Fecha:</strong> {new Date(appointment.appointmentDate).toLocaleDateString('es-PE')}</p>
                  <p>⏰ <strong>Hora:</strong> {appointment.appointmentTime}</p>
                  {appointment.reason && (
                    <p>📝 <strong>Motivo:</strong> {appointment.reason}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  {appointment.status === 'pending' && (
                    <Button
                      variant="danger"
                      onClick={() => handleCancel(appointment.id)}
                      size="sm"
                    >
                      Cancelar
                    </Button>
                  )}
                  <Link href={`/appointments/${appointment.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" fullWidth>
                      Ver Detalles
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
