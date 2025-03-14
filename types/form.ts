// Types for forms and referrals

export interface Form {
  id: number;
  studentId: number;
  name: string;
  type: string;
  status: string;
  sharedBy: string;
  sharedDate: string;
  lastUpdated: string;
  uploadDate: string; // Added to fix TypeScript error
  description?: string; // Added to fix TypeScript error
  filePath?: string;
}

export interface Referral {
  id: number;
  studentId: number;
  type: string;
  status: string;
  createdDate: string;
  referrer: {
    name: string;
    role: string;
  };
  comment: string;
} 