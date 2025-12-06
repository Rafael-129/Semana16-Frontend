'use client';

import { useEffect, useState } from 'react';
import { Doctor, Specialty } from '@/types/doctor.types';
import { doctorsService } from '@/services/doctors.service';
import { specialtiesService } from '@/services/specialties.service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedSpecialty]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [doctorsRes, specialtiesRes] = await Promise.all([
        doctorsService.getAll(selectedSpecialty),
        specialtiesService.getAll()
      ]);

      if (doctorsRes.data) setDoctors(doctorsRes.data);
      if (specialtiesRes.data) setSpecialties(specialtiesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Cargando doctores...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Nuestros Doctores 👨‍⚕️
        </h1>

        {/* Filter by Specialty */}
        <Card className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Filtrar por Especialidad</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!selectedSpecialty ? 'primary' : 'secondary'}
              onClick={() => setSelectedSpecialty(undefined)}
            >
              Todos
            </Button>
            {specialties.map((specialty) => (
              <Button
                key={specialty.id}
                variant={selectedSpecialty === specialty.id ? 'primary' : 'secondary'}
                onClick={() => setSelectedSpecialty(specialty.id)}
              >
                {specialty.icon} {specialty.name}
              </Button>
            ))}
          </div>
        </Card>

        {/* Doctors Grid */}
        {doctors.length === 0 ? (
          <Card>
            <p className="text-center text-gray-600 py-8">
              No se encontraron doctores
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Card key={doctor.id} hover>
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
                  <p>📧 {doctor.user.email}</p>
                  {doctor.user.phone && <p>📱 {doctor.user.phone}</p>}
                  {doctor.experience && (
                    <p>⭐ {doctor.experience} años de experiencia</p>
                  )}
                  {doctor.consultationFee && (
                    <p>💰 S/ {doctor.consultationFee} por consulta</p>
                  )}
                  {doctor.rating && (
                    <p>⭐ Rating: {doctor.rating}/5.0</p>
                  )}
                </div>

                {doctor.bio && (
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {doctor.bio}
                  </p>
                )}

                <Link href={`/appointments/new?doctorId=${doctor.id}`}>
                  <Button fullWidth>
                    Agendar Cita
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
