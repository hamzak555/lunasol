"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function SitemapPage() {
  const [moonTopPosition, setMoonTopPosition] = useState('50%');

  useEffect(() => {
    const updatePosition = () => {
      const footer = document.querySelector('footer');
      if (!footer) return;

      const footerTop = footer.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;
      const stopPoint = 150;

      const maxTop = footerTop - stopPoint;

      if (maxTop < viewportHeight / 2) {
        setMoonTopPosition(`${maxTop}px`);
      } else {
        setMoonTopPosition('50%');
      }
    };

    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);
    updatePosition();

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  const sitePages = [
    {
      category: "Main Pages",
      links: [
        { name: "Home", href: "/" },
        { name: "Events", href: "/events" },
        { name: "Gallery", href: "/gallery" },
      ]
    },
    {
      category: "Bookings & Reservations",
      links: [
        { name: "Private Bookings", href: "/private-bookings" },
        { name: "Book Now", href: "/book" },
      ]
    },
    {
      category: "Support & Information",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "FAQ", href: "/faq" },
      ]
    },
    {
      category: "Admin & Dashboard",
      links: [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Sign In", href: "/sign-in" },
      ]
    },
    {
      category: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms & Conditions", href: "/terms-and-conditions" },
        { name: "Sitemap", href: "/sitemap" },
      ]
    }
  ];

  return (
    <>
      {/* Moon Phases - Floating Element */}
      <div
        className="fixed z-40 hidden lg:block"
        style={{
          left: 'calc(2rem - 85px)',
          top: moonTopPosition,
          transform: 'translateY(-50%) rotate(90deg)',
          transformOrigin: 'center',
        }}
      >
        <Image
          src="/Images/Moon Phases.svg"
          alt="Moon Phases"
          width={200}
          height={50}
          style={{ opacity: 0.6 }}
        />
      </div>

      <Header />

      <div
        className="relative min-h-screen pt-[121px] pb-8 md:pb-12 lg:pb-16 -mt-[73px]"
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

        <div className="relative z-10 container mx-auto px-4 md:px-8 max-w-4xl">
          {/* Page Title */}
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-wide mb-4 text-center"
            style={{
              color: '#806D4B',
              fontFamily: 'var(--font-gascogne)',
              fontWeight: '900'
            }}
          >
            SITEMAP
          </h1>

          <p
            className="text-sm md:text-lg text-center mb-12"
            style={{
              color: '#DCD3B8',
              fontFamily: 'var(--font-pangea)'
            }}
          >
            Navigate through all pages on our website
          </p>

          {/* Sitemap Categories */}
          <div className="space-y-6">
            {sitePages.map((section, index) => (
              <div
                key={index}
                className="p-6 rounded-lg"
                style={{
                  backgroundColor: '#2C2C2C',
                  border: '2px solid #806D4B'
                }}
              >
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{
                    color: '#806D4B',
                    fontFamily: 'var(--font-gascogne)'
                  }}
                >
                  {section.category}
                </h2>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-3 transition-colors hover:text-[#806D4B] group text-sm md:text-lg"
                        style={{
                          color: '#DCD3B8',
                          fontFamily: 'var(--font-pangea)'
                        }}
                      >
                        <span
                          className="transition-colors"
                          style={{ color: '#806D4B' }}
                        >
                          →
                        </span>
                        <span className="group-hover:underline">{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div
            className="mt-12 p-6 rounded-lg text-center"
            style={{
              backgroundColor: '#2C2C2C',
              border: '2px solid #806D4B'
            }}
          >
            <h2
              className="text-2xl font-bold mb-4"
              style={{
                color: '#806D4B',
                fontFamily: 'var(--font-gascogne)'
              }}
            >
              Need Help?
            </h2>
            <p
              className="mb-6 text-sm md:text-base"
              style={{
                color: '#DCD3B8',
                fontFamily: 'var(--font-pangea)'
              }}
            >
              Can't find what you're looking for? Contact our team for assistance.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 text-lg font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#0F0F0F]"
              style={{
                backgroundColor: '#806D4B',
                color: '#DCD3B8',
                fontFamily: 'var(--font-gascogne)',
                border: '2px solid #806D4B',
                borderRadius: '0.5rem'
              }}
            >
              CONTACT US
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
