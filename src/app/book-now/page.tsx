"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Script from "next/script";

export default function BookNowPage() {
  const [moonTopPosition, setMoonTopPosition] = useState('50%');
  const [iframeHeight, setIframeHeight] = useState('1500px');
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Listen for height messages from the Shotgun iframe
      if (event.origin === 'https://shotgun.live') {
        if (event.data.type === 'resize' || event.data.height) {
          const height = event.data.height || event.data.value;
          if (height) {
            setIframeHeight(`${height}px`);
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

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

      {/* Book Now Content */}
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

        {/* Spotted Pattern - Right side cropped */}
        <div
          className="absolute -right-32 pointer-events-none"
          style={{ width: '800px', height: '800px', zIndex: 5, opacity: 0.3, top: '40%', transform: 'translateY(-50%)' }}
        >
          <Image
            src="/Images/Spotted Pattern.svg"
            alt="Spotted Pattern"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-8 max-w-6xl">
          {/* Page Title */}
          <div className="animate-fade-in">
            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-wide mb-6 text-center"
              style={{
                color: '#806D4B',
                fontFamily: 'var(--font-gascogne)',
                fontWeight: '900'
              }}
            >
              BOOK NOW
            </h1>

            {/* Sun Icon */}
            <div className="flex justify-center mb-12">
              <Image
                src="/Images/Sun Icon 1.svg"
                alt="Sun Icon"
                width={104}
                height={104}
                style={{ opacity: 0.7 }}
              />
            </div>
          </div>

          {/* Booking Widget */}
          <div className="animate-slide-in-up delay-200">
            <div
              className="rounded-lg overflow-hidden"
              style={{
                border: '2px solid #806D4B',
                paddingBottom: '2rem'
              }}
            >
              <iframe
                ref={iframeRef}
                src="https://shotgun.live/venues/lunasol-miami?embedded=1&ui=dark&transparentBackground=1"
                allow="payment"
                scrolling="no"
                style={{
                  width: '100%',
                  height: iframeHeight,
                  border: 0,
                  colorScheme: 'none',
                  overflow: 'hidden'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <Script src="https://shotgun.live/widget.js" />
    </>
  );
}
