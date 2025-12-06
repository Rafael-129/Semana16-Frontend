'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ROUTES, ROLES } from '@/constants';
import { Specialty } from '@/types/doctor.types';
import { specialtiesService } from '@/services/specialties.service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AdminSpecialtiesPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(ROUTES.LOGIN);
      } else if (user?.role !== ROLES.ADMIN) {
        router.push(ROUTES.DASHBOARD);
      } else {
        loadSpecialties();
      }
    }
  }, [isAuthenticated, loading, user, router]);

  const loadSpecialties = async () => {
    try {
      setLoadingSpecialties(true);
      const response = await specialtiesService.getAll();
      if (response.data) {
        setSpecialties(response.data);
      }
    } catch (error) {
      console.error('Error loading specialties:', error);
    } finally {
      setLoadingSpecialties(false);
    }
  };

  if (loading || loadingSpecialties) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Cargando...</p>
      </div>
    );
  }

  if (!user || user.role !== ROLES.ADMIN) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Gestionar Especialidades 🏥
          </h1>
          <Button onClick={() => router.push(ROUTES.ADMIN)}>
            ← Volver al Panel
          </Button>
        </div>

        {specialties.length === 0 ? (
          <Card>
            <p className="text-center text-gray-600 py-8">
              No hay especialidades registradas
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialties.map((specialty) => (
              <Card key={specialty.id} hover>
                <div className="text-center mb-4">
                  <div className="text-6xl mb-3">{specialty.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {specialty.name}
                  </h3>
                </div>

                {specialty.description && (
                  <p className="text-gray-700 text-sm mb-4 text-center">
                    {specialty.description}
                  </p>
                )}

                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="secondary" 
                    fullWidth
                    onClick={() => alert('Función de editar en desarrollo')}
                  >
                    ✏️ Editar
                  </Button>
                  <Button 
                    variant="secondary" 
                    fullWidth
                    onClick={() => {
                      if (confirm('¿Estás seguro de eliminar esta especialidad?')) {
                        alert('Función de eliminar en desarrollo');
                      }
                    }}
                    className="!bg-red-500 !text-white hover:!bg-red-600"
                  >
                    🗑️ Eliminar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Agregar Nueva Especialidad</h3>
          <p className="text-gray-600 mb-4">
            Esta funcionalidad estará disponible próximamente
          </p>
          <Button 
            variant="secondary"
            onClick={() => alert('Función en desarrollo')}
          >
            ➕ Agregar Especialidad
          </Button>
        </Card>
      </div>
    </div>
  );
}
