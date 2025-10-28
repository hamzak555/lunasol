"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface Artist {
  id: string;
  name: string;
  image_url: string;
  instagram_handle: string | null;
  display_order: number;
}

export default function FamilyPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [moonTopPosition, setMoonTopPosition] = useState('50%');
  const supabase = createClient();

  useEffect(() => {
    fetchArtists();
  }, []);

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

  const fetchArtists = async () => {
    const { data, error } = await supabase
      .from('family')
      .select('*')
      .order('display_order', { ascending: true });

    if (data) {
      setArtists(data);
    }
    setLoading(false);
  };

  const handleArtistClick = (artist: Artist) => {
    if (artist.instagram_handle) {
      const instagramUrl = artist.instagram_handle.startsWith('http')
        ? artist.instagram_handle
        : `https://instagram.com/${artist.instagram_handle.replace('@', '')}`;
      window.open(instagramUrl, '_blank', 'noopener,noreferrer');
    }
  };

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

      {/* Header Navigation */}
      <Header />

      {/* Family Page Content */}
      <div
        className="relative min-h-screen pt-40 pb-20 -mt-[73px]"
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

        <div className="relative z-10 container mx-auto px-8 max-w-7xl">
          {/* Page Title */}
          <h1
            className="text-5xl font-bold tracking-wide mb-12 text-center"
            style={{
              color: '#806D4B',
              fontFamily: 'var(--font-gascogne)',
              fontWeight: '900'
            }}
          >
            FAMILY
          </h1>

          {loading ? (
            <div
              className="text-center py-20"
              style={{ color: '#DCD3B8', fontFamily: 'var(--font-pangea)' }}
            >
              Loading artists...
            </div>
          ) : artists.length === 0 ? (
            <div
              className="text-center py-20"
              style={{ color: '#DCD3B8', fontFamily: 'var(--font-pangea)' }}
            >
              No artists to display yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {artists.map((artist) => (
                <div
                  key={artist.id}
                  onClick={() => handleArtistClick(artist)}
                  className={`group relative rounded-lg overflow-hidden transition-all ${
                    artist.instagram_handle ? 'cursor-pointer hover:scale-105' : ''
                  }`}
                  style={{
                    aspectRatio: '1/1',
                    border: '2px solid #806D4B'
                  }}
                >
                  <Image
                    src={artist.image_url}
                    alt={artist.name}
                    fill
                    className="object-cover"
                  />

                  {/* Overlay with artist name */}
                  <div
                    className="absolute inset-0 flex items-end p-4 transition-opacity"
                    style={{
                      background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
                    }}
                  >
                    <div className="w-full">
                      <h3
                        className="text-lg font-bold"
                        style={{
                          color: '#DCD3B8',
                          fontFamily: 'var(--font-gascogne)'
                        }}
                      >
                        {artist.name}
                      </h3>
                      {artist.instagram_handle && (
                        <p
                          className="text-sm opacity-80 flex items-center gap-1"
                          style={{
                            color: '#DCD3B8',
                            fontFamily: 'var(--font-pangea)'
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
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
                          @{artist.instagram_handle.replace('@', '')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Hover indicator for clickable items */}
                  {artist.instagram_handle && (
                    <div
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full"
                      style={{ backgroundColor: 'rgba(128, 109, 75, 0.9)' }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#DCD3B8"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
