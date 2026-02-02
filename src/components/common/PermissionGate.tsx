import { useAuthStore } from "@/store/authStore";
import { ROLE_PERMISSIONS } from "@/src/utils/permissions";

export function PermissionGate({
  allow,
  children,
}: {
  allow: string;
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  if (!user) return null;

  const permissions = ROLE_PERMISSIONS[user.role];
  if (!permissions.actions.includes(allow)) return null;

  return <>{children}</>;
}