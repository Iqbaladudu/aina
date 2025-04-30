import { Access, FieldAccess } from 'payload'

// Check if user is an admin
export const isAdmin: Access = ({ req: { user } }) => {
  // Grant access if user exists and has role 'admin'
  return Boolean(user?.collection === 'admin')
}

// Check if user is admin or self (for user-specific access control)
export const isAdminOrSelf: Access = ({ req: { user }, id }) => {
  // If no user logged in, deny access
  if (!user) return false

  // If user is admin, grant access
  if (user.collection === 'admin') return true

  // Check if user is accessing their own resource
  return user.id === id
}

// For fields that only admin can modify
export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  return Boolean(user?.collection === 'admin')
}
