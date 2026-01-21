import { fetchInitialData } from "@/src/services/bootstrapService";
import { useAdminStore } from "@/src/store/adminStore";
import { useAuthStore } from "@/src/store/authStore";
import { useCourierStore } from "@/src/store/courierStore";
import { useDeliveryStore } from "@/src/store/deliveryStore";
import { useMgtStore } from "@/src/store/mgtStore";
import { useEffect } from "react";

export default function AppBootstrap() {
  const { user, isAuthenticated } = useAuthStore();

  const setDeliveries = useDeliveryStore((s) => s.setDeliveries);
  const setAllDeliveries = useAdminStore((s) => s.setAllDeliveries);
  const setCouriers = useAdminStore((s) => s.setCouriers);
  const setAssignedDeliveries = useCourierStore((s) => s.setAssignedDeliveries);
  const setSubmittedLetters = useMgtStore((s) => s.setSubmittedLetters);
  const setLoading = useDeliveryStore((s) => s.setLoading);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    setLoading(true);
    fetchInitialData(user)
      .then((data) => {
        // Shared
        setDeliveries(data.mockDeliveries);

        // Role-specific hydration
        if (user.role === "admin") {
          setAllDeliveries(data.mockDeliveries);
          setCouriers(data.couriers);
        }

        if (user.role === "courier") {
          setAssignedDeliveries(
            data.mockDeliveries.filter(
              (d) => d.assignedCourierId === `COU-${user.id}`,
            ),
          );
        }

        if (user.role === "mgt") {
          setSubmittedLetters(data.mockDeliveries);
        }
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, user]);

  return null;
}
