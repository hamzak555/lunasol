"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const CORRECT_PASSWORD = "11345";
const AUTH_KEY = "lunasol_auth";

export function LockScreen({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const auth = localStorage.getItem(AUTH_KEY);
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === CORRECT_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  // Show loading state briefly
  if (isLoading) {
    return null;
  }

  // If authenticated, show the actual site
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Show lock screen
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: '#1F1F1F' }}
    >
      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.3'/%3E%3C/svg%3E")`,
          opacity: 0.6,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Spotted Pattern - Background */}
      <div
        className="absolute top-1/2 left-1/2 pointer-events-none"
        style={{
          width: '1200px',
          height: '1200px',
          zIndex: 5,
          opacity: 0.15,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <Image
          src="/Images/Spotted Pattern.svg"
          alt="Pattern"
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md px-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/Images/Logo Icon.svg"
            alt="Lunasol"
            width={120}
            height={120}
            style={{
              filter: 'brightness(0) saturate(100%) invert(88%) sepia(11%) saturate(483%) hue-rotate(358deg) brightness(96%) contrast(91%)',
              opacity: 0.8
            }}
          />
        </div>

        <h1
          className="text-4xl font-bold text-center mb-2"
          style={{
            color: '#806D4B',
            fontFamily: 'var(--font-gascogne)',
            fontWeight: '900'
          }}
        >
          LUNASOL MIAMI
        </h1>

        <p
          className="text-center mb-8"
          style={{
            color: '#DCD3B8',
            fontFamily: 'var(--font-pangea)',
            fontSize: '0.875rem',
            opacity: 0.8
          }}
        >
          This site is password protected
        </p>

        {/* Password Form */}
        <div
          className="p-8 rounded-lg"
          style={{
            backgroundColor: '#2C2C2C',
            border: '2px solid #806D4B'
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{
                  color: '#DCD3B8',
                  fontFamily: 'var(--font-pangea)'
                }}
              >
                Enter Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoFocus
                className="w-full px-4 py-3 rounded focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: '#1F1F1F',
                  border: '1px solid #806D4B',
                  color: '#DCD3B8',
                  fontFamily: 'var(--font-pangea)',
                  borderColor: error ? '#DC2626' : '#806D4B'
                }}
              />
              {error && (
                <p
                  className="mt-2 text-sm"
                  style={{
                    color: '#DC2626',
                    fontFamily: 'var(--font-pangea)'
                  }}
                >
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-8 py-3 text-lg font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#0F0F0F]"
              style={{
                backgroundColor: '#806D4B',
                color: '#DCD3B8',
                fontFamily: 'var(--font-gascogne)',
                border: '2px solid #806D4B',
                borderRadius: '0.5rem'
              }}
            >
              ENTER
            </button>
          </form>
        </div>

        <p
          className="text-center mt-6"
          style={{
            color: '#DCD3B8',
            fontFamily: 'var(--font-pangea)',
            fontSize: '0.75rem',
            opacity: 0.5
          }}
        >
          Wynwood's Premier Nightlife Destination
        </p>
      </div>
    </div>
  );
}
