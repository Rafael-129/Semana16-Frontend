'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ROUTES, ROLES } from '@/constants';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={ROUTES.HOME} className="flex items-center space-x-2">
              <span className="text-3xl">🏥</span>
              <span className="text-white font-bold text-xl">MediCare</span>
            </Link>
            
            {isAuthenticated && (
              <div className="hidden md:flex ml-10 space-x-4">
                <Link
                  href={ROUTES.DASHBOARD}
                  className="text-white hover:underline hover:scale-110 hover:brightness-125 active:scale-90 active:rotate-1 px-3 py-2 rounded-md font-medium transition-all duration-300 ease-out"
                >
                  Dashboard
                </Link>
                <Link
                  href={ROUTES.DOCTORS}
                  className="text-white hover:underline hover:scale-110 hover:brightness-125 active:scale-90 active:rotate-1 px-3 py-2 rounded-md font-medium transition-all duration-300 ease-out"
                >
                  Doctores
                </Link>
                <Link
                  href={ROUTES.APPOINTMENTS}
                  className="text-white hover:underline hover:scale-110 hover:brightness-125 active:scale-90 active:rotate-1 px-3 py-2 rounded-md font-medium transition-all duration-300 ease-out"
                >
                  Mis Citas
                </Link>
                {user?.role === ROLES.ADMIN && (
                  <Link
                    href={ROUTES.ADMIN}
                    className="text-white hover:underline hover:scale-110 hover:brightness-125 active:scale-90 active:rotate-1 px-3 py-2 rounded-md font-medium transition-all duration-300 ease-out"
                  >
                    Admin
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="text-white hidden md:block">
                  <p className="text-sm">Bienvenido,</p>
                  <p className="font-semibold">{user?.fullName}</p>
                </div>
                <button
                  onClick={logout}
                  className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-110 hover:shadow-lg active:scale-90 active:-rotate-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ease-out"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className="text-white hover:underline hover:scale-110 hover:brightness-125 active:scale-90 active:rotate-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ease-out"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-110 hover:shadow-lg active:scale-90 active:-rotate-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ease-out"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
