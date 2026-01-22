import { useAuthStore } from "@/src/store/authStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function UnAuth() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      // router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Access Denied</Text>
        <Text style={styles.message}>
          You must be logged in to access this page.
        </Text>

        <Button
          title="Go to Login"
          onPress={() => router.push("/login")}
          color="#4F46E5"
        />

        <Button
          title="Back to Home"
          onPress={() => router.push("/")}
          color="#E5E7EB"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0F2FE", // Gradient equivalent
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    color: "#4B5563",
    marginBottom: 20,
  },
});
