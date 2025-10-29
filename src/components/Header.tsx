"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSupportOpen, setIsMobileSupportOpen] = useState(false);

  return (
    <header
      className="sticky top-0 left-0 right-0 z-50 animate-fade-in"
      style={{
        backgroundColor: 'rgba(31, 31, 31, 0.9)',
        borderBottom: '1px solid #806D4B',
        animationDelay: '0.2s',
        opacity: 0,
      }}
    >
      <nav className="flex items-stretch px-4 md:px-8 py-3">
        {/* Logo */}
        <div className="flex items-stretch mr-4 md:mr-8 -my-3">
          <Link href="/" className="flex items-center">
            <Image
              src="/Images/Logo.svg"
              alt="Lunasol Logo"
              width={120}
              height={20}
              className="md:w-[160px] w-[120px]"
              priority
              style={{
                filter: 'brightness(0) saturate(100%) invert(47%) sepia(17%) saturate(738%) hue-rotate(359deg) brightness(94%) contrast(89%)'
              }}
            />
          </Link>
        </div>

        <div className="self-stretch -my-3 mr-4 md:mr-8 hidden md:block" style={{ width: '1px', backgroundColor: '#806D4B' }} />

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex items-center pl-4 pr-0 ml-auto"
          style={{ color: '#DCD3B8' }}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center relative">
            <span
              className="absolute w-5 h-0.5 transition-all duration-300 ease-in-out"
              style={{
                backgroundColor: '#DCD3B8',
                transform: isMobileMenuOpen ? 'rotate(45deg)' : 'translateY(-6px)',
              }}
            />
            <span
              className="absolute w-5 h-0.5 transition-all duration-300 ease-in-out"
              style={{
                backgroundColor: '#DCD3B8',
                opacity: isMobileMenuOpen ? 0 : 1,
              }}
            />
            <span
              className="absolute w-5 h-0.5 transition-all duration-300 ease-in-out"
              style={{
                backgroundColor: '#DCD3B8',
                transform: isMobileMenuOpen ? 'rotate(-45deg)' : 'translateY(6px)',
              }}
            />
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-stretch ml-auto -my-3">
          <div className="self-stretch" style={{ width: '1px', backgroundColor: '#806D4B' }} />

          <Link
            href="/events"
            className="flex items-center px-8 py-3 text-base tracking-wide transition-all hover:bg-[#806D4B]/20"
            style={{ color: '#DCD3B8' }}
          >
            Events
          </Link>

          <div className="self-stretch" style={{ width: '1px', backgroundColor: '#806D4B' }} />

          <Link
            href="/gallery"
            className="flex items-center px-8 py-3 text-base tracking-wide transition-all hover:bg-[#806D4B]/20"
            style={{ color: '#DCD3B8' }}
          >
            Gallery
          </Link>

          <div className="self-stretch" style={{ width: '1px', backgroundColor: '#806D4B' }} />

          <Link
            href="/family"
            className="flex items-center px-8 py-3 text-base tracking-wide transition-all hover:bg-[#806D4B]/20"
            style={{ color: '#DCD3B8' }}
          >
            Family
          </Link>

          <div className="self-stretch" style={{ width: '1px', backgroundColor: '#806D4B' }} />

          {/* Support Dropdown */}
          <div
            className="relative flex items-stretch"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              className="flex items-center gap-1 px-8 py-3 text-base tracking-wide transition-all hover:bg-[#806D4B]/20"
              style={{ color: '#DCD3B8' }}
            >
              Support
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
                className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div
                  className="absolute right-0 py-2 min-w-[200px]"
                  style={{
                    backgroundColor: '#1F1F1F',
                    border: '1px solid #806D4B',
                    top: '100%',
                  }}
                >
                <Link
                  href="/faq"
                  className="block px-6 py-3 text-base tracking-wide transition-all hover:bg-[#806D4B]/20"
                  style={{ color: '#DCD3B8' }}
                >
                  FAQ
                </Link>
                <Link
                  href="/private-bookings"
                  className="block px-6 py-3 text-base tracking-wide transition-all hover:bg-[#806D4B]/20"
                  style={{ color: '#DCD3B8' }}
                >
                  Private Bookings
                </Link>
                <Link
                  href="/contact"
                  className="block px-6 py-3 text-base tracking-wide transition-all hover:bg-[#806D4B]/20"
                  style={{ color: '#DCD3B8' }}
                >
                  Contact
                </Link>
              </div>
              </>
            )}
          </div>

          <div className="self-stretch" style={{ width: '1px', backgroundColor: '#806D4B' }} />

          {/* Instagram Icon */}
          <Link
            href="https://www.instagram.com/lunasol/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-6 py-3 transition-all hover:bg-[#806D4B]/20"
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

          <div className="self-stretch" style={{ width: '1px', backgroundColor: '#806D4B' }} />

          {/* Email Icon */}
          <Link
            href="mailto:info@lunasol-miami.com"
            className="flex items-center px-6 py-3 transition-all hover:bg-[#806D4B]/20"
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

          <div className="self-stretch" style={{ width: '1px', backgroundColor: '#806D4B' }} />

          {/* Book Now Button */}
          <Link
            href="/book"
            className="flex items-center justify-center px-8 text-base font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#0F0F0F]"
            style={{
              backgroundColor: '#806D4B',
              color: '#DCD3B8',
              fontFamily: 'var(--font-gascogne)',
              paddingTop: '0.85rem',
              paddingBottom: '0.65rem',
            }}
          >
            BOOK NOW
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden animate-slide-down"
          style={{
            backgroundColor: '#1F1F1F',
            borderTop: '1px solid #806D4B',
          }}
        >
          <div className="flex flex-col">
            <Link
              href="/events"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-6 py-4 text-base tracking-wide transition-all hover:bg-[#806D4B]/20 border-b"
              style={{ color: '#DCD3B8', borderColor: '#806D4B' }}
            >
              Events
            </Link>

            <Link
              href="/gallery"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-6 py-4 text-base tracking-wide transition-all hover:bg-[#806D4B]/20 border-b"
              style={{ color: '#DCD3B8', borderColor: '#806D4B' }}
            >
              Gallery
            </Link>

            <Link
              href="/family"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-6 py-4 text-base tracking-wide transition-all hover:bg-[#806D4B]/20 border-b"
              style={{ color: '#DCD3B8', borderColor: '#806D4B' }}
            >
              Family
            </Link>

            {/* Support Section in Mobile - Accordion */}
            <div className="border-b" style={{ borderColor: '#806D4B' }}>
              <button
                onClick={() => setIsMobileSupportOpen(!isMobileSupportOpen)}
                className="w-full flex items-center justify-between px-6 py-4 text-base tracking-wide transition-all hover:bg-[#806D4B]/20"
                style={{ color: '#DCD3B8' }}
              >
                <span className="font-semibold">Support</span>
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
                  className={`transition-transform duration-300 ${isMobileSupportOpen ? 'rotate-180' : ''}`}
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              <div className={`${isMobileSupportOpen ? 'block' : 'hidden'}`}>
                <Link
                  href="/faq"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-8 py-3 text-base tracking-wide transition-all hover:bg-[#806D4B]/20 block border-t"
                  style={{ color: '#DCD3B8', borderColor: '#806D4B' }}
                >
                  FAQ
                </Link>
                <Link
                  href="/private-bookings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-8 py-3 text-base tracking-wide transition-all hover:bg-[#806D4B]/20 block border-t"
                  style={{ color: '#DCD3B8', borderColor: '#806D4B' }}
                >
                  Private Bookings
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-8 py-3 text-base tracking-wide transition-all hover:bg-[#806D4B]/20 block border-t"
                  style={{ color: '#DCD3B8', borderColor: '#806D4B' }}
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-6 py-4 border-b" style={{ borderColor: '#806D4B' }}>
              <Link
                href="https://www.instagram.com/lunasol/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 transition-all hover:bg-[#806D4B]/20 rounded"
                style={{ color: '#DCD3B8' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
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

              <Link
                href="mailto:info@lunasol-miami.com"
                className="p-2 transition-all hover:bg-[#806D4B]/20 rounded"
                style={{ color: '#DCD3B8' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
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

            {/* Book Now Button */}
            <Link
              href="/book"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mx-6 my-4 py-3 text-center text-base font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#0F0F0F]"
              style={{
                backgroundColor: '#806D4B',
                color: '#DCD3B8',
                fontFamily: 'var(--font-gascogne)',
              }}
            >
              BOOK NOW
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
