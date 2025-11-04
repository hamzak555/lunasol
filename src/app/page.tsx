"use client";

import Image from "next/image";
import Link from "next/link";
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
  is_ticketed?: boolean;
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
          is_ticketed: event.is_ticketed,
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
      <div className="flex h-[70vh] md:h-screen items-center justify-center relative -mt-[73px] overflow-visible">
        {/* Hero Image Background - Contained */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/Images/Hero Image.jpg"
            alt="Hero Background"
            fill
            priority
            className="object-cover"
            style={{ zIndex: 0, filter: 'blur(3px)', transform: 'scale(1.05)' }}
          />
        </div>

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
          className="absolute left-1/2 z-30 animate-fade-in-scale top-[37%] md:top-[40%]"
          style={{
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
        {upcomingEvents.length > 0 && (
          <div
            className="absolute bottom-0 left-0 right-0 z-30 animate-fade-in-opacity translate-y-[25%] md:translate-y-[45%]"
            style={{
              animationDelay: '0.6s',
              opacity: 0,
            }}
          >
            <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-3 md:gap-6 px-4 md:px-8">
              {/* Horizontal Text on Mobile, Vertical on Desktop */}
              <div className="flex-shrink-0 md:hidden mb-1">
                <h2
                  className="tracking-wider whitespace-nowrap text-center"
                  style={{
                    color: '#806D4B',
                    fontFamily: 'var(--font-gascogne)',
                    fontWeight: '900',
                    fontSize: '0.75rem',
                    letterSpacing: '0.2em',
                  }}
                >
                  UPCOMING EVENTS
                </h2>
              </div>

              {/* Vertical Text on Desktop */}
              <div className="hidden md:flex flex-shrink-0" style={{ alignItems: 'flex-start' }}>
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
              <div className="flex-1 max-w-7xl w-full">
                <EventsCarousel events={upcomingEvents} />
              </div>
            </div>
          </div>
        )}
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
        <div className="relative z-10 flex items-center min-h-screen pt-[80px] md:pt-[120px] lg:pt-[150px]">
          {/* Escape the Ordinary Section */}
          <div className="container mx-auto px-4 md:px-8 max-w-7xl py-8 md:py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
              {/* Left Side - Text Content */}
              <div className="space-y-4 md:space-y-6 animate-slide-in-left text-center md:text-left">
                <h2
                  className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-wide"
                  style={{
                    color: '#806D4B',
                    fontFamily: 'var(--font-gascogne)',
                    fontWeight: '900'
                  }}
                >
                  ESCAPE THE ORDINARY
                </h2>
                <p
                  className="text-sm md:text-lg leading-relaxed"
                  style={{
                    color: '#DCD3B8',
                    fontFamily: 'var(--font-pangea)'
                  }}
                >
                  Lunasol illuminates Wynwood's nightlife with a dual-concept venue that seamlessly bridges upscale cocktail lounge and high-energy nightclub. Designed for Miami's vibrant crowd, it offers the perfect transition from evening sophistication to late-night euphoria all beneath a retractable, star-filled sky.
                </p>
              </div>

              {/* Right Side - Overlapped Images */}
              <div className="relative h-[400px] md:h-[500px]">
                {/* Image 1 */}
                <div
                  className="absolute top-0 left-0 w-[70%] h-[250px] md:h-[350px] rounded-lg overflow-hidden animate-slide-in-right delay-200"
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
                  className="absolute bottom-0 right-0 w-[70%] h-[250px] md:h-[350px] rounded-lg overflow-hidden animate-slide-in-right delay-400"
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

        {/* Bottle Service Content */}
        <div className="relative z-10 overflow-visible">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl py-8 md:py-12 lg:py-16 overflow-visible">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-20 items-center overflow-visible">
              {/* Text Content - First on mobile, second on desktop */}
              <div className="space-y-4 md:space-y-6 animate-slide-in-right delay-200 lg:order-2 text-center md:text-left">
                <h2
                  className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide"
                  style={{
                    color: '#806D4B',
                    fontFamily: 'var(--font-gascogne)',
                    fontWeight: '900'
                  }}
                >
                  BOTTLE SERVICE
                </h2>
                <p
                  className="text-sm md:text-lg leading-relaxed"
                  style={{
                    color: '#DCD3B8',
                    fontFamily: 'var(--font-pangea)'
                  }}
                >
                  Reserve your private table and experience Wynwood's most sought-after nightlife destination. Premium bottle service, dedicated VIP hosting, and the energy of Miami's best nights.
                </p>
                <Link
                  href="/book-now"
                  className="inline-block px-6 md:px-8 py-2 md:py-3 text-base md:text-lg font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#2C2C2C] rounded-md"
                  style={{
                    backgroundColor: '#806D4B',
                    color: '#DCD3B8',
                    fontFamily: 'var(--font-gascogne)',
                    border: '2px solid #806D4B'
                  }}
                >
                  BOOK NOW
                </Link>
              </div>

              {/* Image - Second on mobile, first on desktop */}
              <div className="relative h-[250px] md:h-[300px] w-full max-w-[500px] rounded-lg overflow-hidden md:overflow-visible animate-slide-in-left lg:order-1">
                {/* Sun and Moon - Behind Image as Accent */}
                <div className="absolute -top-28 -left-32 pointer-events-none hidden lg:block" style={{ zIndex: 0 }}>
                  <Image
                    src="/Images/Sun and Moon.svg"
                    alt="Sun and Moon"
                    width={250}
                    height={250}
                    style={{
                      opacity: 0.3,
                      filter: 'brightness(0) saturate(100%) invert(47%) sepia(17%) saturate(738%) hue-rotate(359deg) brightness(94%) contrast(89%)'
                    }}
                  />
                </div>
                {/* Bottle Service Image */}
                <div className="relative h-full w-full" style={{ border: '2px solid #806D4B', borderRadius: '0.5rem', zIndex: 1 }}>
                  <Image
                    src="/Images/Bottle Service.jpg"
                    alt="Bottle Service"
                    fill
                    style={{ objectFit: 'cover', borderRadius: '0.5rem' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guest List Section - Hidden */}
      {/* <div
        className="relative overflow-hidden"
        style={{ backgroundColor: '#1F1F1F' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.3'/%3E%3C/svg%3E")`,
            opacity: 0.6,
            mixBlendMode: 'overlay'
          }}
        />

        <div className="relative z-10">
          <div className="container mx-auto px-8 max-w-7xl py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
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
                  className="px-8 py-3 text-lg font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#2C2C2C] rounded-md"
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

              <div className="relative h-[300px] w-full max-w-[500px] ml-auto rounded-lg overflow-visible" style={{ border: '2px solid #806D4B' }}>
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <Image
                    src="/Images/Guest List.jpg"
                    alt="Guest List"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="absolute bottom-8 left-1/2 pointer-events-none" style={{ transform: 'translateX(-50%)', zIndex: 10 }}>
                  <Image
                    src="/Images/Split Moon.svg"
                    alt="Split Moon"
                    width={120}
                    height={120}
                    style={{
                      filter: 'brightness(0) saturate(100%) invert(47%) sepia(17%) saturate(738%) hue-rotate(359deg) brightness(94%) contrast(89%)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Call to Action - View All Events */}
      <div
        className="relative overflow-hidden md:overflow-visible"
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
          <div className="container mx-auto px-4 md:px-8 max-w-7xl py-8 md:py-12 lg:py-16">
            {/* Outlined CTA Box */}
            <div
              className="relative rounded-lg overflow-hidden animate-slide-up"
              style={{
                border: '3px solid #806D4B',
                backgroundColor: 'rgba(31, 31, 31, 0.5)'
              }}
            >
              {/* Splat Background Accent */}
              <div className="absolute top-1/2 -right-64 pointer-events-none hidden lg:block" style={{ transform: 'translateY(-50%)', zIndex: 0 }}>
                <Image
                  src="/Images/Splat.svg"
                  alt="Splat"
                  width={600}
                  height={600}
                  style={{
                    opacity: 0.3,
                    filter: 'brightness(0) saturate(100%) invert(47%) sepia(17%) saturate(738%) hue-rotate(359deg) brightness(94%) contrast(89%)'
                  }}
                />
              </div>

              {/* Content */}
              <div className="relative z-10 py-10 md:py-12 lg:py-16 px-6 md:px-12 text-center">
                <h2
                  className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide mb-4 md:mb-6"
                  style={{
                    color: '#806D4B',
                    fontFamily: 'var(--font-gascogne)',
                    fontWeight: '900'
                  }}
                >
                  DISCOVER WHAT'S NEXT
                </h2>
                <p
                  className="text-sm md:text-lg lg:text-xl leading-relaxed mb-6 md:mb-8 max-w-2xl mx-auto"
                  style={{
                    color: '#DCD3B8',
                    fontFamily: 'var(--font-pangea)'
                  }}
                >
                  From live performances to exclusive nights under the stars, explore our full calendar of upcoming events and experiences.
                </p>
                <Link
                  href="/events"
                  className="inline-block px-8 md:px-12 py-3 md:py-4 text-base md:text-xl font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#2C2C2C] rounded-md"
                  style={{
                    backgroundColor: '#806D4B',
                    color: '#DCD3B8',
                    fontFamily: 'var(--font-gascogne)',
                    border: '2px solid #806D4B'
                  }}
                >
                  VIEW ALL EVENTS
                </Link>
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
