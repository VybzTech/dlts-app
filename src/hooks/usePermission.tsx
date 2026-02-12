import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { UserRole } from "../types";

export interface UsePermissionOptions {
  /**
   * Required roles to access this screen.
   * If user role is not in this list, they'll be redirected to login
   */
  requiredRoles?: UserRole[];

  /**
   * If true, will redirect to login if user is not authenticated
   * @default true
   */
  requireAuth?: boolean;

  /**
   * Route to redirect to if permission is denied
   * @default "/(auth)/login"
   */
  redirectTo?: string;

  /**
   * Callback when permission is denied
   */
  onPermissionDenied?: () => void;
}

/**
 * Hook to enforce authentication and authorization on screens
 *
 * @example
 * // Require authentication
 * usePermission({ requireAuth: true });
 *
 * @example
 * // Require specific role
 * usePermission({ requiredRoles: ["courier"] });
 *
 * @example
 * // Require multiple roles
 * usePermission({ requiredRoles: ["courier", "admin"] });
 */
export function usePermission(options: UsePermissionOptions = {}) {
  const {
    requiredRoles,
    requireAuth = true,
    redirectTo = "/(auth)/login",
    onPermissionDenied,
  } = options;

  const router = useRouter();
  const { isAuthenticated, user, isHydrated } = useAuthStore();

  useEffect(() => {
    // Wait for store to be hydrated before checking permissions
    if (!isHydrated) {
      return;
    }

    // Check if authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      console.log(
        `[Permission] Access denied: requireAuth=true but not authenticated`,
      );
      onPermissionDenied?.();
      router.replace(redirectTo as any);
      return;
    }

    // Check if specific roles are required
    if (requiredRoles && requiredRoles.length > 0 && user) {
      const userRole = user.role?.toLowerCase() as UserRole;

      const hasRequiredRole = requiredRoles.some((role) => role === userRole);

      if (!hasRequiredRole) {
        console.log(
          `[Permission] Access denied: user role '${userRole}' not in required roles [${requiredRoles.join(", ")}]`,
        );
        onPermissionDenied?.();
        router.replace(redirectTo as any);
        return;
      }
    }

    console.log(`[Permission] Access granted`);
  }, [isHydrated, isAuthenticated, user, requiredRoles, requireAuth]);

  return {
    isAuthenticated,
    user,
    hasPermission:
      isAuthenticated &&
      (!requiredRoles ||
        requiredRoles.some((role) => role === user?.role?.toLowerCase())),
  };
}

/**
 * Higher-order component to protect screens with authentication
 *
 * @example
 * export default withPermission(MyScreen, { requiredRoles: ["courier"] });
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  options?: UsePermissionOptions,
) {
  return function ProtectedComponent(props: P) {
    usePermission(options);
    return <Component {...props} />;
  };
}
