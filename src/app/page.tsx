import Link from 'next/link';
import { ROUTES } from '@/constants';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Bienvenido a MediCare
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Tu salud es nuestra prioridad. Agenda tus citas médicas fácilmente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={ROUTES.REGISTER}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
              >
                Comenzar Ahora
              </Link>
              <Link
                href={ROUTES.DOCTORS}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-all"
              >
                Ver Doctores
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            ¿Por qué elegir MediCare?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Fácil Agendamiento</h3>
              <p className="text-gray-600">
                Agenda tus citas médicas en pocos clics. Simple y rápido.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-all">
              <div className="text-6xl mb-4">👨‍⚕️</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Mejores Doctores</h3>
              <p className="text-gray-600">
                Accede a los mejores especialistas en diversas áreas médicas.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-purple-50 hover:bg-purple-100 transition-all">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">100% Seguro</h3>
              <p className="text-gray-600">
                Tu información está protegida con los más altos estándares de seguridad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Especialidades Médicas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '❤️', name: 'Cardiología' },
              { icon: '🧠', name: 'Neurología' },
              { icon: '👶', name: 'Pediatría' },
              { icon: '🦴', name: 'Traumatología' },
              { icon: '👁️', name: 'Oftalmología' },
              { icon: '🦷', name: 'Odontología' },
              { icon: '💊', name: 'Medicina General' },
              { icon: '🩺', name: 'Dermatología' },
            ].map((specialty, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all text-center"
              >
                <div className="text-4xl mb-2">{specialty.icon}</div>
                <p className="font-semibold text-gray-800">{specialty.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para cuidar tu salud?
          </h2>
          <p className="text-xl mb-8">
            Únete a miles de pacientes que confían en MediCare para su atención médica.
          </p>
          <Link
            href={ROUTES.REGISTER}
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all shadow-lg"
          >
            Registrarse Gratis
          </Link>
        </div>
      </section>
    </div>
  );
}

