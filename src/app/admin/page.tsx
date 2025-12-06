'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ROUTES, ROLES } from '@/constants';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default function AdminPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(ROUTES.LOGIN);
      } else if (user?.role !== ROLES.ADMIN) {
        router.push(ROUTES.DASHBOARD);
      }
    }
  }, [isAuthenticated, loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Cargando...</p>
      </div>
    );
  }

  if (!user || user.role !== ROLES.ADMIN) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Panel de Administrador 🔧
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          <Link href={ROUTES.ADMIN_DOCTORS}>
            <Card hover className="cursor-pointer bg-gradient-to-br from-blue-500 to-blue-600 text-white h-full">
              <div className="text-6xl mb-4">👨‍⚕️</div>
              <h3 className="text-2xl font-bold mb-2">Gestionar Doctores</h3>
              <p className="text-blue-100">Agregar, editar o eliminar doctores</p>
            </Card>
          </Link>

          <Link href={ROUTES.ADMIN_SPECIALTIES}>
            <Card hover className="cursor-pointer bg-gradient-to-br from-purple-500 to-purple-600 text-white h-full">
              <div className="text-6xl mb-4">🏥</div>
              <h3 className="text-2xl font-bold mb-2">Especialidades</h3>
              <p className="text-purple-100">Gestionar especialidades médicas</p>
            </Card>
          </Link>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold mb-2">Estadísticas</h3>
            <p className="text-green-100">Ver reportes del sistema</p>
          </Card>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Acciones Rápidas</h3>
            <div className="space-y-3">
              <Link
                href={ROUTES.ADMIN_DOCTORS}
                className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all"
              >
                <p className="font-semibold text-blue-900">➕ Agregar Nuevo Doctor</p>
              </Link>
              <Link
                href={ROUTES.ADMIN_SPECIALTIES}
                className="block p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all"
              >
                <p className="font-semibold text-purple-900">➕ Agregar Especialidad</p>
              </Link>
              <Link
                href={ROUTES.APPOINTMENTS}
                className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-all"
              >
                <p className="font-semibold text-green-900">📋 Ver Todas las Citas</p>
              </Link>
            </div>
          </Card>

          <Card>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Información del Sistema</h3>
            <div className="space-y-3 text-gray-700">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Versión del Sistema</p>
                <p className="font-bold text-lg">v1.0.0</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Administrador</p>
                <p className="font-bold text-lg">{user.fullName}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Estado del Sistema</p>
                <p className="font-bold text-lg text-green-600">✅ Operativo</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
