export const companiesSubsets = {
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
  company_id: true
};

export const usersSubsets = {
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  last_login_at: true,
  name: true,
  username: true,
  email: true,
  password: true,
  image_path: true,
  company_id: true,
  role_id: true,
  is_active: true,
  is_role_based_access: true,
  is_logged: true
};