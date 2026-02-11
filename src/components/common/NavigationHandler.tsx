// components/common/NavigationHandler.tsx
import { useAuthStore } from "@/store/authStore";
import { useRouter, useSegments, useRootNavigationState } from "expo-router";
import { useEffect, useRef } from "react";

export default function NavigationHandler() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const rootNavigation = useRootNavigationState();
  const navigationAttempted = useRef(false);

  useEffect(() => {
    // Wait for root navigation to be ready
    if (!rootNavigation?.key) {
      return;
    }

    // Only attempt navigation once per auth state
    // We wrap this in a small timeout to ensure the Root Layout is actually 'mounted'
    // in the UI before we try to perform a router.replace
    const timer = setTimeout(() => {
      if (navigationAttempted.current) {
        return;
      }

      navigationAttempted.current = true;

      // Determine current location
      const currentSegment = segments?.[0];
      const inAuthStack = currentSegment === "(auth)";

      console.log("[Navigation] State check:", {
        currentSegment,
        isAuthenticated,
        userRole: user?.role,
      });

      if (isAuthenticated && user) {
        // User is authenticated, route by role
        const roleRoutes: Record<string, string> = {
          courier: "/(courier)",
          admin: "/(admin)",
          mgt: "/(mgt)",
        };

        const role = user.role?.toLowerCase() || "courier";
        const targetRoute = roleRoutes[role] || "/(courier)";

        // Check if we are already in the correct stack
        const isInCorrectStack = segments?.includes(
          targetRoute.replace("/", "") as any,
        );

        if (inAuthStack || !isInCorrectStack) {
          console.log(
            `[Navigation] Redirecting to ${targetRoute} (Current: ${currentSegment})`,
          );
          router.replace(targetRoute as any);
        }
      } else {
        // User is not authenticated, show login
        if (!inAuthStack) {
          console.log(
            `[Navigation] Unauthenticated, redirecting to login (Current: ${currentSegment})`,
          );
          router.replace("/(auth)/login");
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [rootNavigation?.key, isAuthenticated, user, segments, router]);

  return null; // This component only handles navigation logic
}
