'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ROUTES, ROLES } from '@/constants';
import { Doctor } from '@/types/doctor.types';
import { doctorsService } from '@/services/doctors.service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AddDoctorModal from '@/components/admin/AddDoctorModal';
import EditDoctorModal from '@/components/admin/EditDoctorModal';

export default function AdminDoctorsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(ROUTES.LOGIN);
      } else if (user?.role !== ROLES.ADMIN) {
        router.push(ROUTES.DASHBOARD);
      } else {
        loadDoctors();
      }
    }
  }, [isAuthenticated, loading, user, router]);

  const loadDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const response = await doctorsService.getAll();
      if (response.data) {
        setDoctors(response.data);
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleModalSuccess = () => {
    loadDoctors(); // Reload the doctors list after successful creation
  };

  const handleEdit = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (doctorId: number, doctorName: string) => {
    if (!confirm(`¿Estás seguro de eliminar al Dr. ${doctorName}?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await doctorsService.delete(doctorId);
      alert('Doctor eliminado exitosamente');
      loadDoctors(); // Reload the list
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar el doctor');
      console.error('Error deleting doctor:', error);
    }
  };

  if (loading || loadingDoctors) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Cargando...</p>
      </div>
    );
  }

  if (!user || user.role !== ROLES.ADMIN) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Gestionar Doctores 👨‍⚕️
          </h1>
          <div className="flex gap-4">
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="!bg-green-500 !text-white hover:!bg-green-600"
            >
              ➕ Agregar Doctor
            </Button>
            <Button onClick={() => router.push(ROUTES.ADMIN)} variant="secondary">
              ← Volver al Panel
            </Button>
          </div>
        </div>

        {doctors.length === 0 ? (
          <Card>
            <p className="text-center text-gray-600 py-8">
              No hay doctores registrados
            </p>
            <div className="text-center mt-4">
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="!bg-green-500 !text-white hover:!bg-green-600"
              >
                ➕ Agregar Primer Doctor
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Card key={doctor.id}>
                <div className="text-center mb-4">
                  <div className="text-6xl mb-3">👨‍⚕️</div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Dr. {doctor.user.fullName}
                  </h3>
                  <p className="text-blue-600 font-semibold">
                    {doctor.specialty.icon} {doctor.specialty.name}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p className="text-gray-900">📧 {doctor.user.email}</p>
                  {doctor.user.phone && <p className="text-gray-900">📱 {doctor.user.phone}</p>}
                  {doctor.experience && (
                    <p className="text-gray-900">⭐ {doctor.experience} años de experiencia</p>
                  )}
                  {doctor.consultationFee && (
                    <p className="text-gray-900">💰 S/ {doctor.consultationFee} por consulta</p>
                  )}
                  {doctor.rating && (
                    <p className="text-gray-900">⭐ Rating: {doctor.rating}/5.0</p>
                  )}
                </div>

                {doctor.bio && (
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {doctor.bio}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button 
                    variant="secondary" 
                    fullWidth
                    onClick={() => handleEdit(doctor)}
                  >
                    ✏️ Editar
                  </Button>
                  <Button 
                    variant="secondary" 
                    fullWidth
                    onClick={() => handleDelete(doctor.id, doctor.user.fullName)}
                    className="!bg-red-500 !text-white hover:!bg-red-600"
                  >
                    🗑️ Eliminar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AddDoctorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      <EditDoctorModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDoctor(null);
        }}
        onSuccess={handleModalSuccess}
        doctor={selectedDoctor}
      />
    </div>
  );
}
