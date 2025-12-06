'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ROUTES, ROLES } from '@/constants';
import Card from '@/components/ui/Card';

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Cargando...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ¡Hola, {user.fullName}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Bienvenido a tu panel de control
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href={ROUTES.NEW_APPOINTMENT}>
            <Card hover className="cursor-pointer bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-2xl font-bold mb-2">Agendar Cita</h3>
              <p className="text-blue-100">Programa una nueva consulta médica</p>
            </Card>
          </Link>

          <Link href={ROUTES.APPOINTMENTS}>
            <Card hover className="cursor-pointer bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-2xl font-bold mb-2">Mis Citas</h3>
              <p className="text-indigo-100">Ver todas tus citas programadas</p>
            </Card>
          </Link>

          <Link href={ROUTES.DOCTORS}>
            <Card hover className="cursor-pointer bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="text-5xl mb-4">👨‍⚕️</div>
              <h3 className="text-2xl font-bold mb-2">Doctores</h3>
              <p className="text-purple-100">Encuentra el especialista ideal</p>
            </Card>
          </Link>
        </div>

        {/* User Info */}
        <Card>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Tu Información</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-1">Nombre Completo</p>
              <p className="font-semibold text-lg text-gray-900">{user.fullName}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Email</p>
              <p className="font-semibold text-lg text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Rol</p>
              <p className="font-semibold text-lg capitalize text-gray-900">{user.role}</p>
            </div>
            {user.phone && (
              <div>
                <p className="text-gray-600 mb-1">Teléfono</p>
                <p className="font-semibold text-lg text-gray-900">{user.phone}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Admin Section */}
        {user.role === ROLES.ADMIN && (
          <div className="mt-8">
            <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              <h2 className="text-2xl font-bold mb-4">Panel de Administrador</h2>
              <p className="mb-4">Gestiona doctores, especialidades y más</p>
              <Link
                href={ROUTES.ADMIN}
                className="inline-block bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
              >
                Ir al Panel Admin
              </Link>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
