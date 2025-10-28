"use client";

import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="relative border-t"
      style={{
        backgroundColor: '#0F0F0F',
        borderTopColor: '#806D4B'
      }}
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.3'/%3E%3C/svg%3E")`,
          opacity: 0.6,
          mixBlendMode: 'overlay'
        }}
      />

      <div className="relative z-10 container mx-auto px-8 py-12 max-w-7xl">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row gap-36 mb-12">
          {/* Logo */}
          <div className="space-y-6">
            <Image
              src="/Images/Logo Icon.svg"
              alt="Lunasol Icon"
              width={80}
              height={80}
              style={{
                filter: 'brightness(0) saturate(100%) invert(88%) sepia(11%) saturate(483%) hue-rotate(358deg) brightness(96%) contrast(91%)',
                opacity: 0.7
              }}
            />
          </div>

          {/* Navigation Links - Column 1 */}
          <div className="space-y-4">
            <h3
              className="text-lg font-bold tracking-wide mb-4"
              style={{
                color: '#806D4B',
                fontFamily: 'var(--font-gascogne)'
              }}
            >
              Browse
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/events"
                className="text-sm transition-colors hover:text-[#806D4B]"
                style={{ color: '#DCD3B8', fontFamily: 'var(--font-pangea)' }}
              >
                Events
              </Link>
              <Link
                href="/gallery"
                className="text-sm transition-colors hover:text-[#806D4B]"
                style={{ color: '#DCD3B8', fontFamily: 'var(--font-pangea)' }}
              >
                Gallery
              </Link>
              <Link
                href="/family"
                className="text-sm transition-colors hover:text-[#806D4B]"
                style={{ color: '#DCD3B8', fontFamily: 'var(--font-pangea)' }}
              >
                Family
              </Link>
            </nav>
          </div>

          {/* Navigation Links - Column 2 */}
          <div className="space-y-4">
            <h3
              className="text-lg font-bold tracking-wide mb-4"
              style={{
                color: '#806D4B',
                fontFamily: 'var(--font-gascogne)'
              }}
            >
              Support
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/faq"
                className="text-sm transition-colors hover:text-[#806D4B]"
                style={{ color: '#DCD3B8', fontFamily: 'var(--font-pangea)' }}
              >
                FAQ
              </Link>
              <Link
                href="/private-bookings"
                className="text-sm transition-colors hover:text-[#806D4B]"
                style={{ color: '#DCD3B8', fontFamily: 'var(--font-pangea)' }}
              >
                Private Bookings
              </Link>
              <Link
                href="/contact"
                className="text-sm transition-colors hover:text-[#806D4B]"
                style={{ color: '#DCD3B8', fontFamily: 'var(--font-pangea)' }}
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Hours and Address */}
          <div className="space-y-2">
            <div>
              <h3
                className="text-lg font-bold tracking-wide mb-4"
                style={{
                  color: '#806D4B',
                  fontFamily: 'var(--font-gascogne)'
                }}
              >
                Hours
              </h3>
              <div
                className="text-sm leading-relaxed space-y-2"
                style={{
                  color: '#DCD3B8',
                  fontFamily: 'var(--font-pangea)'
                }}
              >
                <p>Friday <span>10PM - 3AM</span></p>
                <p>Saturday <span>10PM - 3AM</span></p>
              </div>
            </div>

            <div
              className="text-sm"
              style={{
                color: '#DCD3B8',
                fontFamily: 'var(--font-pangea)'
              }}
            >
              <a
                href="https://share.google/EfIq9ftP9jbcRhPF4"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#806D4B] hover:underline"
              >
                158 NW 24th St, Miami, FL
              </a>
            </div>
          </div>

          {/* Social Icons and Book Now Button */}
          <div className="flex flex-col items-center gap-4">
            {/* Book Now Button */}
            <Link
              href="/book"
              className="px-6 py-2 text-sm font-medium tracking-wide transition-all hover:bg-[#806D4B] hover:text-[#0F0F0F]"
              style={{
                color: '#DCD3B8',
                fontFamily: 'var(--font-pangea)',
                border: '1px solid #806D4B'
              }}
            >
              BOOK NOW
            </Link>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {/* Instagram Icon */}
              <Link
                href="https://www.instagram.com/lunasol/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#806D4B]"
                style={{ color: '#DCD3B8' }}
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
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </Link>

              {/* Email Icon */}
              <Link
                href="mailto:info@lunasol-miami.com"
                className="transition-colors hover:text-[#806D4B]"
                style={{ color: '#DCD3B8' }}
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
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m2 7 10 6 10-6"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-start md:items-center gap-4" style={{ borderTopColor: '#806D4B' }}>
          <p
            className="text-sm"
            style={{
              color: '#DCD3B8',
              fontFamily: 'var(--font-pangea)'
            }}
          >
            &copy; {new Date().getFullYear()} Lunasol Miami. All rights reserved.
          </p>

          <nav className="flex gap-6">
            <Link
              href="/privacy-policy"
              className="text-sm transition-colors hover:text-[#806D4B]"
              style={{ color: '#DCD3B8', fontFamily: 'var(--font-pangea)' }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="text-sm transition-colors hover:text-[#806D4B]"
              style={{ color: '#DCD3B8', fontFamily: 'var(--font-pangea)' }}
            >
              Terms and Conditions
            </Link>
            <Link
              href="/sitemap"
              className="text-sm transition-colors hover:text-[#806D4B]"
              style={{ color: '#DCD3B8', fontFamily: 'var(--font-pangea)' }}
            >
              Sitemap
            </Link>
            <Link
              href="/dashboard/login"
              className="text-sm transition-colors hover:text-[#806D4B]"
              style={{ color: '#DCD3B8', fontFamily: 'var(--font-pangea)' }}
            >
              Login
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
