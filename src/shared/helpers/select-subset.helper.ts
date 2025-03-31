export const businessesSubsets = {
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  name: true,
  api_key: true,
  domain: true,
  logo_path: true,
  preferred_timezone: true,
  currency: true
};

export const rolesSubsets = {
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  name: true,
  description: true,
  business_id: true
};

export const usersSubsets = {
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  last_logged_at: true,
  name: true,
  username: true,
  email: true,
  password: true,
  image_path: true,
  access_type: true,
  business_id: true,
  role_id: true,
  is_active: true,
  is_logged: true
};