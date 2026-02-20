"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/boards");
      if (res.ok) {
        router.push("/boards");
      } else {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  if (checkingAuth) {
    return <div>Cargando...</div>;
  }
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (password.length < 6) {
        setMessage("La contraseña debe tener al menos 6 caracteres");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(errorData?.message || "Error al registrar usuario");
        setLoading(false);
        return;
      }

      setMessage("Usuario registrado con éxito ✅");
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage("Error de conexión");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Video de fondo con loop perfecto */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-10"
      >
        <source src="/videos/background_loop_perfecto_240f.webm" type="video/webm" />
      </video>
      {/* Overlay oscuro para mejorar legibilidad */}
      <div className="fixed inset-0 bg-black/12 -z-10" />
      
      {/* Navbar fija en la parte superior */}
      <div className="fixed top-0 left-0 right-0 z-20 w-full">
        <Navbar />
      </div>
      
      {/* Contenido del formulario */}
      <div className="relative z-10 max-w-md w-full mx-auto p-6  backdrop-blur-sm rounded-lg shadow-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-white">Registro</h1>
        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-2 border border-gray-300 rounded-lg  text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-2 border border-gray-300 rounded-lg  text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow-sm hover:bg-gray-500 hover:shadow-md active:scale-97 active:bg-gray-500 transition-all duration-50 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center text-sm ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
            {message}
          </p>
        )}
        <p className="mt-4 text-center text-sm text-white/90">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="font-medium text-white hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}
