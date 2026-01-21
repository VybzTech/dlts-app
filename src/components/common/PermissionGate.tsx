// import { useAuthStore } from "@/src/store/authStore";
// import { UserRole } from "@/src/types";

// export function PermissionGate({
//   allow,
//   children,
// }: {
//   allow: UserRole[];
//   children: React.ReactNode;
// }) {
//   const { user } = useAuthStore();
//   if (!user || !allow.includes(user.role)) return null;
//   return <>{children}</>;
// }
import { useAuthStore } from "@/src/store/authStore";
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