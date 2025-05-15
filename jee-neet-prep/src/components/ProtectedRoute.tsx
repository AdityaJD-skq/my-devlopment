import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, isLoggedIn, hasPermission } = useAuthStore();
  
  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // If logged in but doesn't have required role, redirect based on role
  if (!hasPermission(allowedRoles)) {
    // Redirect admins and developers to admin dashboard
    if (user && ['Developer', 'Admin'].includes(user.role)) {
      return <Navigate to="/admin" replace />;
    }
    
    // Redirect teachers to teacher dashboard
    if (user && user.role === 'Teacher') {
      return <Navigate to="/admin/students" replace />;
    }
    
    // Redirect students to student dashboard
    return <Navigate to="/dashboard" replace />;
  }
  
  // If all checks pass, render the protected content
  return <>{children}</>;
} 