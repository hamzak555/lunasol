"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/dashboard/login");
      return;
    }

    setUser(user);

    // Check if user is admin from metadata
    const userRole = user.user_metadata?.role;
    setIsAdmin(userRole === "admin");

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/dashboard/login");
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#1F1F1F" }}
      >
        <p style={{ color: "#DCD3B8", fontFamily: "var(--font-pangea)" }}>
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex relative"
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

      {/* Left Sidebar */}
      <aside
        className="relative z-10 w-64 border-r flex flex-col h-screen sticky top-0"
        style={{
          backgroundColor: "#0F0F0F",
          borderRightColor: "#806D4B",
        }}
      >
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderBottomColor: "#806D4B" }}>
          <div className="flex items-center gap-3">
            <Image
              src="/Images/Logo Icon.svg"
              alt="Lunasol Icon"
              width={40}
              height={40}
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(88%) sepia(11%) saturate(483%) hue-rotate(358deg) brightness(96%) contrast(91%)",
                opacity: 0.7,
              }}
            />
            <div>
              <h1
                className="text-xl font-bold"
                style={{
                  color: "#806D4B",
                  fontFamily: "var(--font-gascogne)",
                }}
              >
                Lunasol
              </h1>
              <p
                className="text-xs"
                style={{
                  color: "#DCD3B8",
                  fontFamily: "var(--font-pangea)",
                  opacity: 0.6,
                }}
              >
                Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded transition-all ${
              pathname === "/dashboard" ? "bg-[#806D4B]" : "hover:bg-[#806D4B]/20"
            }`}
            style={{
              color: pathname === "/dashboard" ? "#0F0F0F" : "#DCD3B8",
              fontFamily: "var(--font-pangea)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span className="font-medium">Events</span>
          </Link>

          <Link
            href="/dashboard/gallery"
            className={`flex items-center gap-3 px-4 py-3 rounded transition-all ${
              pathname === "/dashboard/gallery" ? "bg-[#806D4B]" : "hover:bg-[#806D4B]/20"
            }`}
            style={{
              color: pathname === "/dashboard/gallery" ? "#0F0F0F" : "#DCD3B8",
              fontFamily: "var(--font-pangea)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="font-medium">Gallery</span>
          </Link>

          <Link
            href="/dashboard/family"
            className={`flex items-center gap-3 px-4 py-3 rounded transition-all ${
              pathname === "/dashboard/family" ? "bg-[#806D4B]" : "hover:bg-[#806D4B]/20"
            }`}
            style={{
              color: pathname === "/dashboard/family" ? "#0F0F0F" : "#DCD3B8",
              fontFamily: "var(--font-pangea)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="font-medium">Family</span>
          </Link>

          {isAdmin && (
            <Link
              href="/dashboard/users"
              className={`flex items-center gap-3 px-4 py-3 rounded transition-all ${
                pathname === "/dashboard/users"
                  ? "bg-[#806D4B]"
                  : "hover:bg-[#806D4B]/20"
              }`}
              style={{
                color: pathname === "/dashboard/users" ? "#0F0F0F" : "#DCD3B8",
                fontFamily: "var(--font-pangea)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="font-medium">Users</span>
              <span
                className="ml-auto text-xs px-2 py-1 rounded"
                style={{
                  backgroundColor: "rgba(128, 109, 75, 0.3)",
                  color: "#806D4B",
                }}
              >
                Admin
              </span>
            </Link>
          )}
        </nav>

        {/* User Info & Logout */}
        <div
          className="p-4 border-t space-y-3"
          style={{ borderTopColor: "#806D4B" }}
        >
          <div className="px-4">
            <p
              className="text-sm font-medium"
              style={{
                color: "#DCD3B8",
                fontFamily: "var(--font-pangea)",
              }}
            >
              {user?.email}
            </p>
            <p
              className="text-xs mt-1"
              style={{
                color: "#806D4B",
                fontFamily: "var(--font-pangea)",
              }}
            >
              {isAdmin ? "Administrator" : "Standard User"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm font-medium tracking-wide transition-all hover:bg-[#806D4B] rounded-md flex items-center justify-center gap-2"
            style={{
              color: "#DCD3B8",
              fontFamily: "var(--font-pangea)",
              border: "1px solid #806D4B",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 overflow-auto">{children}</main>
    </div>
  );
}
