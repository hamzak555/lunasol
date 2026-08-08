"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ backgroundColor: "#1F1F1F" }}
    >
      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.3'/%3E%3C/svg%3E")`,
          opacity: 0.6,
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/Images/Logo Icon.svg"
            alt="Lunasol Icon"
            width={80}
            height={80}
            style={{
              filter:
                "brightness(0) saturate(100%) invert(88%) sepia(11%) saturate(483%) hue-rotate(358deg) brightness(96%) contrast(91%)",
              opacity: 0.7,
            }}
          />
        </div>

        {/* Login Form */}
        <div
          className="p-8 rounded-lg"
          style={{
            backgroundColor: "#0F0F0F",
            border: "1px solid #806D4B",
          }}
        >
          <h1
            className="text-3xl font-bold text-center mb-8"
            style={{
              color: "#806D4B",
              fontFamily: "var(--font-gascogne)",
            }}
          >
            Dashboard Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{
                  color: "#DCD3B8",
                  fontFamily: "var(--font-pangea)",
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "#2C2C2C",
                  border: "1px solid #806D4B",
                  color: "#DCD3B8",
                  fontFamily: "var(--font-pangea)",
                }}
                placeholder="you@example.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{
                  color: "#DCD3B8",
                  fontFamily: "var(--font-pangea)",
                }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "#2C2C2C",
                  border: "1px solid #806D4B",
                  color: "#DCD3B8",
                  fontFamily: "var(--font-pangea)",
                }}
                placeholder="••••••••"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="p-3 rounded text-sm text-center"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#ef4444",
                  fontFamily: "var(--font-pangea)",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-3 text-lg font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#2C2C2C] disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
              style={{
                backgroundColor: "#806D4B",
                color: "#DCD3B8",
                fontFamily: "var(--font-gascogne)",
                border: "2px solid #806D4B",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
