import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface UserCreateData {
  email: string;
  password: string;
}

interface Provider {
  id: string;
  name: string;
}

export const useCreateUser = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const router = useRouter();

  /*
  // Fetch authentication providers when the component mounts
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch("/api/auth/providers");
        const data = await response.json();
        setProviders(data);
      } catch (err) {
        console.error("Failed to fetch providers", err);
      }
    };

    fetchProviders(); // Call the function inside useEffect
  }, []); // Empty dependency array → runs only once on mount
*/
  const createUser = async (user: UserCreateData) => {
    setLoading(true);
    setError(null); // Reset error

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      await router.push("/auth/login"); // Redirect after signup
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading, error, providers };
};
