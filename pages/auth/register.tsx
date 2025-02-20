import { useCreateUser } from "@/lib-client/react-query/auth/useCreateUser";
import { useState, ChangeEvent, FormEvent } from "react";

const SignupForm = () => {
  const { createUser, loading, error, providers } = useCreateUser();
  const [formData, setFormData] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await createUser(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display available authentication providers */}
      <h3>Or sign up with:</h3>
      <ul>
        {providers.map((provider) => (
          <li key={provider.id}>
            <button onClick={() => console.log(`Sign up with ${provider.name}`)}>
              {provider.name}
            </button>
          </li>
        ))}
      </ul>
    </form>
  );
};

export default SignupForm;
