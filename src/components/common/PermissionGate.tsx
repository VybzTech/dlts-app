import { useAuthStore } from "@/src/store/authStore";
import { UserRole } from "@/src/types";

export function PermissionGate({
  allow,
  children,
}: {
  allow: UserRole[];
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  if (!user || !allow.includes(user.role)) return null;
  return <>{children}</>;
}
