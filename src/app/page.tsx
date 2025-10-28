"use client";

import Image from "next/image";
import { EventsCarousel } from "@/components/EventsCarousel";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { parse, isAfter, startOfDay } from "date-fns";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  image_url: string;
  booking_link?: string;
}

export default function Home() {
  const [moonTopPosition, setMoonTopPosition] = useState('50%');
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (data) {
      const today = startOfDay(new Date());

      // Transform and filter out past events
      const transformedEvents = data
        .map(event => ({
          id: event.id,
          title: event.title,
          date: event.date,
          time: event.time,
          image_url: event.image_url,
          booking_link: event.booking_link,
          parsedDate: parse(event.date, "MMMM d, yyyy", new Date())
        }))
        .filter(event => {
          // Keep events that are today or in the future
          return isAfter(event.parsedDate, today) || event.parsedDate.getTime() === today.getTime();
        })
        .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

      setUpcomingEvents(transformedEvents);
    }
  };

  useEffect(() => {
    const updatePosition = () => {
      const footer = document.querySelector('footer');
      if (!footer) return;

      const footerTop = footer.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;
      const stopPoint = 150; // pixels before footer

      // Calculate where the icon should stop (in viewport coordinates)
      const maxTop = footerTop - stopPoint;

      // If footer is getting close, cap the position
      if (maxTop < viewportHeight / 2) {
        setMoonTopPosition(`${maxTop}px`);
      } else {
        setMoonTopPosition('50%');
      }
    };

    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);
    updatePosition(); // Call once on mount

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  const scrollToContent = () => {
    document.getElementById('content-section')?.scrollIntoView({ behavior: 'smooth' });
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

      {/* Hero Section */}
      <div className="flex h-screen items-center justify-center relative -mt-[73px]" style={{ overflow: 'visible' }}>
        {/* Hero Image Background */}
        <Image
          src="/Images/Hero Image.jpg"
          alt="Hero Background"
          fill
          priority
          className="object-cover"
          style={{ zIndex: 0, filter: 'blur(3px)', transform: 'scale(1.05)' }}
        />

        {/* Gradient overlay for seamless transition */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, transparent 70%, #1F1F1F 100%)',
            zIndex: 10
          }}
        />

        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.3'/%3E%3C/svg%3E")`,
            opacity: 0.6,
            mixBlendMode: 'overlay',
            zIndex: 20
          }}
        />

        {/* Logo Icon */}
        <main
          className="absolute left-1/2 z-30 animate-fade-in-scale"
          style={{
            top: '40%',
            animationDelay: '0.4s',
            opacity: 0,
          }}
        >
          <div className="animate-slow-spin" style={{ filter: 'brightness(0) saturate(100%) invert(88%) sepia(11%) saturate(483%) hue-rotate(358deg) brightness(96%) contrast(91%)', opacity: 0.7 }}>
            <Image
              src="/Images/Logo Icon.svg"
              alt="Lunasol Logo Icon"
              width={400}
              height={400}
              priority
            />
          </div>
        </main>

        {/* Events Section - Positioned at bottom of hero */}
        <div
          className="absolute bottom-0 left-0 right-0 z-30 overflow-visible animate-fade-in-opacity"
          style={{
            transform: 'translateY(45%)',
            animationDelay: '0.6s',
            opacity: 0,
          }}
        >
          <div className="flex items-start justify-center gap-6 px-8 overflow-visible">
            {/* Vertical Text on Left */}
            <div className="flex-shrink-0" style={{ display: 'flex', alignItems: 'flex-start' }}>
              <h2
                className="tracking-wider whitespace-nowrap"
                style={{
                  color: '#806D4B',
                  fontFamily: 'var(--font-gascogne)',
                  fontWeight: '900',
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  transform: 'rotate(180deg)',
                  fontSize: '1rem',
                  letterSpacing: '0.2em',
                  lineHeight: '1'
                }}
              >
                UPCOMING EVENTS
              </h2>
            </div>

            {/* Carousel */}
            <div className="flex-1 max-w-7xl overflow-visible">
              <EventsCarousel events={upcomingEvents} />
            </div>
          </div>
        </div>
      </div>

      {/* Extended Content Section */}
      <div
        id="content-section"
        className="relative min-h-screen overflow-hidden"
        style={{ backgroundColor: '#1F1F1F' }}
      >
        {/* Grain texture for consistency */}
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
          className="absolute top-1/2 -right-32 pointer-events-none"
          style={{ width: '800px', height: '800px', zIndex: 5, opacity: 0.3, transform: 'translateY(-50%)' }}
        >
          <Image
            src="/Images/Spotted Pattern.svg"
            alt="Spotted Pattern"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Content goes here */}
        <div className="relative z-10 flex items-center min-h-screen" style={{ paddingTop: '150px' }}>
          {/* Escape the Ordinary Section */}
          <div className="container mx-auto px-8 max-w-7xl py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Text Content */}
              <div className="space-y-6">
                <h2
                  className="text-6xl font-bold tracking-wide"
                  style={{
                    color: '#806D4B',
                    fontFamily: 'var(--font-gascogne)',
                    fontWeight: '900'
                  }}
                >
                  ESCAPE THE ORDINARY
                </h2>
                <p
                  className="text-lg leading-relaxed"
                  style={{
                    color: '#DCD3B8',
                    fontFamily: 'var(--font-pangea)'
                  }}
                >
                  Lunasol illuminates Wynwood's nightlife with a dual-concept venue that seamlessly bridges upscale cocktail lounge and high-energy nightclub. Designed for Miami's vibrant crowd, it offers the perfect transition from evening sophistication to late-night euphoria all beneath a retractable, star-filled sky.
                </p>
              </div>

              {/* Right Side - Overlapped Images */}
              <div className="relative h-[500px]">
                {/* Image 1 */}
                <div
                  className="absolute top-0 left-0 w-[70%] h-[350px] rounded-lg overflow-hidden"
                  style={{
                    border: '2px solid #806D4B',
                    backgroundColor: '#2C2C2C',
                    zIndex: 3
                  }}
                >
                  <Image
                    src="/Images/Escape Ordinary 1.jpg"
                    alt="Lunasol Venue"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* Image 2 - Overlapped */}
                <div
                  className="absolute bottom-0 right-0 w-[70%] h-[350px] rounded-lg overflow-hidden"
                  style={{
                    border: '2px solid #806D4B',
                    backgroundColor: '#2C2C2C',
                    zIndex: 2
                  }}
                >
                  <Image
                    src="/Images/Escape Ordinary 2.jpg"
                    alt="Lunasol Experience"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottle Service Section */}
      <div
        className="relative overflow-hidden"
        style={{ backgroundColor: '#1F1F1F' }}
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

        {/* Content */}
        <div className="relative z-10">
          <div className="container mx-auto px-8 max-w-7xl pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              {/* Left Side - Image */}
              <div className="relative h-[300px] w-full max-w-[500px] rounded-lg overflow-hidden" style={{ border: '2px solid #806D4B' }}>
                <Image
                  src="https://placehold.co/600x400/2C2C2C/806D4B?text=Bottle+Service"
                  alt="Bottle Service"
                  fill
                  unoptimized
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Right Side - Text Content */}
              <div className="space-y-4">
                <h2
                  className="text-5xl font-bold tracking-wide"
                  style={{
                    color: '#806D4B',
                    fontFamily: 'var(--font-gascogne)',
                    fontWeight: '900'
                  }}
                >
                  BOTTLE SERVICE
                </h2>
                <p
                  className="text-lg leading-relaxed"
                  style={{
                    color: '#DCD3B8',
                    fontFamily: 'var(--font-pangea)'
                  }}
                >
                  Reserve your private table and experience Wynwood's most sought-after nightlife destination. Premium bottle service, dedicated VIP hosting, and the energy of Miami's best nights.
                </p>
                <button
                  className="px-8 py-3 text-lg font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#2C2C2C]"
                  style={{
                    backgroundColor: '#806D4B',
                    color: '#DCD3B8',
                    fontFamily: 'var(--font-gascogne)',
                    border: '2px solid #806D4B'
                  }}
                >
                  BOOK NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guest List Section */}
      <div
        className="relative overflow-hidden"
        style={{ backgroundColor: '#1F1F1F' }}
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

        {/* Content */}
        <div className="relative z-10">
          <div className="container mx-auto px-8 max-w-7xl py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              {/* Left Side - Text Content */}
              <div className="space-y-4">
                <h2
                  className="text-5xl font-bold tracking-wide"
                  style={{
                    color: '#806D4B',
                    fontFamily: 'var(--font-gascogne)',
                    fontWeight: '900'
                  }}
                >
                  GUEST LIST
                </h2>
                <p
                  className="text-lg leading-relaxed"
                  style={{
                    color: '#DCD3B8',
                    fontFamily: 'var(--font-pangea)'
                  }}
                >
                  Skip the line and step into the night. Join our exclusive guest list for priority entry to Lunasol's most unforgettable evenings under the stars.
                </p>
                <button
                  className="px-8 py-3 text-lg font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#2C2C2C]"
                  style={{
                    backgroundColor: '#806D4B',
                    color: '#DCD3B8',
                    fontFamily: 'var(--font-gascogne)',
                    border: '2px solid #806D4B'
                  }}
                >
                  BOOK NOW
                </button>
              </div>

              {/* Right Side - Image */}
              <div className="relative h-[300px] w-full max-w-[500px] ml-auto rounded-lg overflow-hidden" style={{ border: '2px solid #806D4B' }}>
                <Image
                  src="https://placehold.co/600x400/2C2C2C/806D4B?text=Guest+List"
                  alt="Guest List"
                  fill
                  unoptimized
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
