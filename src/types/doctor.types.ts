export interface Specialty {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: number;
  userId: number;
  specialtyId: number;
  licenseNumber: string;
  experience?: number;
  bio?: string;
  consultationFee?: number;
  rating?: number;
  availableHours?: any;
  user: {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
  };
  specialty: Specialty;
  createdAt: string;
  updatedAt: string;
}
