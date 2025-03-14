// Types for appointment data

export interface Student {
  id: number;
  name: string;
  age?: number;
  grade?: number;
  mentalState?: string;
  consent?: {
    studentConsent: boolean;
    parentConsent: boolean;
  };
}

export interface Counselor {
  id: number;
  name: string;
  specialization: string;
}

export interface AppointmentTime {
  date: string;
  time: string;
  endTime?: string;
  location: string;
}

export interface Note {
  title: string;
  body: string;
  date?: string;
}

export interface Activity {
  author: string;
  comment: string;
  timestamp: string;
}

export interface Appointment {
  id: number;
  student: Student;
  counselor: Counselor;
  time: AppointmentTime;
  type: string;
  status: string;
  priority: string;
  notes: Note[];
  activity?: Activity[];
  attendance?: string;
  sessionPurpose?: string;
  progressNote?: string;
  // Billing related properties
  billingStatus?: string;
  referenceNo?: string;
  billingSubmissionDate?: string;
}

export interface StudentInfo {
  phone: string;
  email: string;
  dateOfBirth: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface StudentInfoDirectory {
  [key: number]: StudentInfo;
} 