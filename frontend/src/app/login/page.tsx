"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // reset l'erreur

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la connexion");
      }

      console.log("Connexion réussie :", data);
      alert("Connexion réussie !");
      
      // Ici tu peux stocker le token en localStorage si besoin
      localStorage.setItem("token", data.token);

      // Rediriger sur une page après connexion
      router.push("/dashboard");
      
    } catch (err: unknown) {
      console.error("Erreur lors de la connexion :", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
    }
  };

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold">Connexion</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6 w-80">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Se connecter
          </button>
        </form>
      </main>
    </>
  );
}
