export interface UserRole {
  name: string;
  id: string;
  created_at: string;
  updated_at: string;
  is_default: boolean;
}

export interface User {
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified_publisher: boolean;
  has_setup_account: boolean;
  full_name: string;
  first_name: string;
  last_name: string;
  type: string;
  gender: "male" | "female" | "other";
  institution: string;
  city: string;
  county: string;
  state: string;
  zip_code: string;
  phone_number: string;
  bio: string;
  profile_image: string;
  cover_image: string;
  date_of_birth: string;
  preferred_pronouns: string;
  organization_id: string;
  role_id: string;
  timezone: string;
  id: string;
  created_at: string;
  updated_at: string;
  role: UserRole;
}

export interface UsersResponse {
  items: User[];
  total: number;
  limit: number;
  offset: number;
}

// Request types for creating/updating users
export interface CreateUserRequest
  extends Omit<User, "id" | "created_at" | "updated_at" | "role"> {
  role_id: string;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {}
