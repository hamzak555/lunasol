'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Image from 'next/image';

type GalleryItem = {
  id: string;
  media_url: string;
  media_type: 'image' | 'video';
  position: number;
  created_at: string;
};

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageDimensions, setImageDimensions] = useState<Record<string, { width: number; height: number }>>({});
  const [moonTopPosition, setMoonTopPosition] = useState('50%');
  const supabase = createClient();

  useEffect(() => {
    loadGalleryItems();
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

  async function loadGalleryItems() {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;

      setItems(data || []);

      // Load image dimensions for all items
      if (data) {
        data.forEach((item) => {
          loadImageDimensions(item);
        });
      }
    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      setLoading(false);
    }
  }

  function loadImageDimensions(item: GalleryItem) {
    if (item.media_type === 'image') {
      const img = new window.Image();
      img.onload = () => {
        setImageDimensions(prev => ({
          ...prev,
          [item.id]: { width: img.width, height: img.height }
        }));
      };
      img.src = item.media_url;
    } else {
      // For videos, we'll treat them as square by default
      setImageDimensions(prev => ({
        ...prev,
        [item.id]: { width: 1, height: 1 }
      }));
    }
  }

  function getGridSpan(item: GalleryItem) {
    const dims = imageDimensions[item.id];
    if (!dims) return { colSpan: 1, rowSpan: 1 };

    const aspectRatio = dims.width / dims.height;

    // Extra wide landscape images
    if (aspectRatio > 2.0) {
      return { colSpan: 2, rowSpan: 1 };
    }
    // Wide landscape images
    else if (aspectRatio > 1.4) {
      return { colSpan: 2, rowSpan: 1 };
    }
    // Tall portrait images (less emphasis on height)
    else if (aspectRatio < 0.6) {
      return { colSpan: 1, rowSpan: 1 };
    }
    // Normal
    else {
      return { colSpan: 1, rowSpan: 1 };
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1F1F1F' }}>
        <div style={{ color: '#DCD3B8', fontFamily: 'var(--font-pangea)' }}>Loading gallery...</div>
      </div>
    );
  }

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

      <div className="min-h-screen relative overflow-hidden -mt-[73px]" style={{ backgroundColor: '#1F1F1F' }}>
        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.3'/%3E%3C/svg%3E")`,
            opacity: 0.6,
            mixBlendMode: 'overlay',
            zIndex: 1
          }}
        />

        {/* Spotted Pattern - Right side */}
        <div
          className="absolute top-0 md:top-1/4 -right-32 pointer-events-none"
          style={{ width: '800px', height: '800px', zIndex: 2, opacity: 0.2, transform: 'translateY(-50%)' }}
        >
          <Image
            src="/Images/Spotted Pattern.svg"
            alt="Spotted Pattern"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Hero Section */}
        <div className="relative z-10 pt-[121px] pb-8 md:pb-12 lg:pb-16">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            <div className="text-center mb-16 animate-fade-in">
              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-wide mb-4"
                style={{
                  color: '#806D4B',
                  fontFamily: 'var(--font-gascogne)',
                  fontWeight: '900'
                }}
              >
                GALLERY
              </h1>

              {/* Split Moon Icon */}
              <div className="flex justify-center">
                <Image
                  src="/Images/Split Moon.svg"
                  alt="Split Moon Icon"
                  width={104}
                  height={104}
                  style={{ opacity: 0.7 }}
                />
              </div>
            </div>

            {/* Masonry Grid */}
            {items.length === 0 ? (
              <div className="text-center py-20">
                <p
                  className="text-sm md:text-lg"
                  style={{
                    color: '#806D4B',
                    fontFamily: 'var(--font-pangea)'
                  }}
                >
                  No gallery items yet. Check back soon!
                </p>
              </div>
            ) : (
              <div className="masonry-grid animate-slide-up delay-200">
                {items.map((item) => {
                  const { colSpan, rowSpan } = getGridSpan(item);
                  return (
                    <div
                      key={item.id}
                      className="masonry-item"
                      style={{
                        gridColumn: `span ${colSpan}`,
                        gridRow: `span ${rowSpan}`,
                      }}
                    >
                      <div
                        className="rounded-lg overflow-hidden transition-all duration-300 h-full"
                        style={{ border: '2px solid #806D4B' }}
                      >
                        {item.media_type === 'image' ? (
                          <img
                            src={item.media_url}
                            alt=""
                            className="w-full h-full block"
                            loading="lazy"
                            style={{ display: 'block', objectFit: 'cover' }}
                          />
                        ) : (
                          <video
                            src={item.media_url}
                            className="w-full h-full block"
                            autoPlay
                            loop
                            muted
                            playsInline
                            disablePictureInPicture
                            controlsList="nodownload nofullscreen noremoteplayback"
                            style={{ display: 'block', objectFit: 'cover' }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .masonry-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          grid-auto-rows: 280px;
          gap: 1rem;
          grid-auto-flow: dense;
        }

        @media (min-width: 640px) {
          .masonry-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 320px;
            gap: 1.25rem;
          }
        }

        @media (min-width: 768px) {
          .masonry-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 350px;
          }
        }

        @media (min-width: 1024px) {
          .masonry-grid {
            grid-template-columns: repeat(3, 1fr);
            grid-auto-rows: 380px;
            gap: 1.5rem;
          }
        }

        @media (min-width: 1280px) {
          .masonry-grid {
            grid-template-columns: repeat(3, 1fr);
            grid-auto-rows: 400px;
          }
        }

        @media (min-width: 1536px) {
          .masonry-grid {
            grid-template-columns: repeat(4, 1fr);
            grid-auto-rows: 420px;
          }
        }

        .masonry-item {
          position: relative;
          overflow: hidden;
        }

        .masonry-item > div {
          width: 100%;
          height: 100%;
        }

        .masonry-item img,
        .masonry-item video {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .masonry-item:hover img,
        .masonry-item:hover video {
          transform: scale(1.05);
        }

        /* Hide video controls completely */
        video::-webkit-media-controls {
          display: none !important;
        }

        video::-webkit-media-controls-enclosure {
          display: none !important;
        }

        video::-webkit-media-controls-panel {
          display: none !important;
        }

        video::-webkit-media-controls-start-playback-button {
          display: none !important;
        }
      `}</style>
    </>
  );
}
