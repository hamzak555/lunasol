"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EventCard } from "@/components/EventCard";
import { createClient } from "@/lib/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  parse,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth
} from "date-fns";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  image_url: string;
  booking_link?: string;
  is_ticketed?: boolean;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [moonTopPosition, setMoonTopPosition] = useState('50%');
  const supabase = createClient();

  useEffect(() => {
    fetchEvents();
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

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (data) {
      setEvents(data);
    }
    setLoading(false);
  };

  // Get events for the selected date
  const getEventsForDate = (date: Date | undefined) => {
    if (!date) return [];
    return events.filter(event => {
      try {
        const eventDate = parse(event.date, "MMMM d, yyyy", new Date());
        return isSameDay(eventDate, date);
      } catch {
        return false;
      }
    });
  };

  // Get all dates that have events
  const getEventDates = () => {
    return events.map(event => {
      try {
        return parse(event.date, "MMMM d, yyyy", new Date());
      } catch {
        return null;
      }
    }).filter(date => date !== null) as Date[];
  };

  // Get events for current month
  const getEventsForMonth = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    return events.filter(event => {
      try {
        const eventDate = parse(event.date, "MMMM d, yyyy", new Date());
        return eventDate >= monthStart && eventDate <= monthEnd;
      } catch {
        return false;
      }
    });
  };

  // Generate calendar grid
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const selectedDateEvents = getEventsForDate(selectedDate);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

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

      {/* Full Page Calendar */}
      <div
        className="relative min-h-screen pt-40 pb-8 -mt-[73px]"
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

        <div className="relative z-10 container mx-auto px-8 max-w-7xl h-full">
          {loading ? (
            <div className="text-center py-20">
              <p style={{ color: '#DCD3B8', fontFamily: 'var(--font-pangea)' }}>
                Loading events...
              </p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 h-full">
              {/* Left Side - Calendar (40%) */}
              <div className="flex flex-col lg:w-[40%] animate-slide-in-left">
                {/* Calendar Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={prevMonth}
                      className="p-3 rounded-full transition-all hover:bg-[#806D4B]"
                      style={{ color: '#DCD3B8' }}
                    >
                      <ChevronLeft className="h-8 w-8" />
                    </button>

                    <h1
                      className="text-4xl font-bold tracking-wide"
                      style={{
                        color: '#806D4B',
                        fontFamily: 'var(--font-gascogne)',
                        fontWeight: '900'
                      }}
                    >
                      {format(currentMonth, 'MMMM yyyy')}
                    </h1>

                    <button
                      onClick={nextMonth}
                      className="p-3 rounded-full transition-all hover:bg-[#806D4B]"
                      style={{ color: '#DCD3B8' }}
                    >
                      <ChevronRight className="h-8 w-8" />
                    </button>
                  </div>

                  {/* Full Date Display */}
                  {selectedDate && (
                    <h2
                      className="text-2xl font-bold text-center"
                      style={{
                        color: '#DCD3B8',
                        fontFamily: 'var(--font-gascogne)'
                      }}
                    >
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </h2>
                  )}
                </div>

                <div className="flex flex-col flex-1">
                  {/* Weekday Headers */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div
                        key={day}
                        className="text-center py-2 font-bold text-sm"
                        style={{
                          color: '#806D4B',
                          fontFamily: 'var(--font-gascogne)'
                        }}
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2 flex-1">
                  {calendarDays.map((day, index) => {
                    const dayEvents = getEventsForDate(day);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);

                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedDate(day)}
                        className="relative rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105"
                        style={{
                          backgroundColor: isSelected ? '#806D4B' : '#2C2C2C',
                          border: `2px solid ${isSelected ? '#DCD3B8' : '#806D4B'}`,
                          opacity: isCurrentMonth ? 1 : 0.4,
                          aspectRatio: '9/16'
                        }}
                      >
                        {/* Date Number */}
                        <div
                          className="absolute top-1 left-1 z-10 text-sm font-bold"
                          style={{
                            color: '#DCD3B8',
                            fontFamily: 'var(--font-pangea)'
                          }}
                        >
                          {format(day, 'd')}
                        </div>

                        {/* Event Image */}
                        {dayEvents.length > 0 && (
                          <div className="absolute inset-0">
                            <Image
                              src={dayEvents[0].image_url}
                              alt={dayEvents[0].title}
                              fill
                              className="object-cover opacity-60"
                            />
                            {dayEvents.length > 1 && (
                              <div
                                className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-bold"
                                style={{
                                  backgroundColor: '#806D4B',
                                  color: '#DCD3B8',
                                  fontFamily: 'var(--font-pangea)'
                                }}
                              >
                                +{dayEvents.length - 1}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  </div>
                </div>
              </div>

              {/* Right Side - Events Display (60%) */}
              <div className="flex flex-col lg:w-[60%] animate-slide-in-right delay-200">
                {/* Spacer to align with calendar header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between opacity-0">
                    <div className="p-3">
                      <ChevronLeft className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-wide">Spacer</h1>
                    <div className="p-3">
                      <ChevronRight className="h-8 w-8" />
                    </div>
                  </div>
                  {selectedDate && (
                    <h2 className="text-2xl font-bold text-center opacity-0">
                      Spacer Date
                    </h2>
                  )}
                </div>

                {/* Events aligned with calendar grid */}
                <div className="flex flex-col flex-1 justify-center">
                {selectedDate && selectedDateEvents.length > 0 ? (
                  <div className="w-full px-4">
                    <Carousel
                      opts={{
                        align: "start",
                        loop: true,
                      }}
                      className="w-full"
                    >
                      <CarouselContent className="-ml-4">
                        {selectedDateEvents.map((event) => (
                          <CarouselItem key={event.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                            <EventCard
                              title={event.title}
                              date={event.date}
                              time={event.time}
                              image={event.image_url}
                              bookingLink={event.booking_link}
                              isTicketed={event.is_ticketed}
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {selectedDateEvents.length >= 4 && (
                        <>
                          <CarouselPrevious
                            className="hidden md:flex -left-6 !w-12 !h-12 !border-[#806D4B] transition-all hover:!border-[#DCD3B8] hover:!border-2"
                            style={{
                              borderColor: '#806D4B',
                              color: '#DCD3B8',
                              backgroundColor: '#806D4B'
                            }}
                          />
                          <CarouselNext
                            className="hidden md:flex -right-6 !w-12 !h-12 !border-[#806D4B] transition-all hover:!border-[#DCD3B8] hover:!border-2"
                            style={{
                              borderColor: '#806D4B',
                              color: '#DCD3B8',
                              backgroundColor: '#806D4B'
                            }}
                          />
                        </>
                      )}
                    </Carousel>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div
                      className="text-center p-12 rounded-lg max-w-lg"
                      style={{
                        backgroundColor: '#2C2C2C',
                        border: '2px solid #806D4B',
                        minHeight: '450px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >
                      {selectedDate ? (
                        <>
                          <div className="flex justify-center mb-6">
                            <Image
                              src="/Images/Sun Icon 2.svg"
                              alt="Sun Icon"
                              width={120}
                              height={120}
                              style={{ opacity: 0.7 }}
                            />
                          </div>
                          <h3
                            className="text-2xl font-bold mb-4"
                            style={{
                              color: '#806D4B',
                              fontFamily: 'var(--font-gascogne)'
                            }}
                          >
                            No Public Events This Date
                          </h3>
                          <p
                            className="text-lg mb-6"
                            style={{
                              color: '#DCD3B8',
                              fontFamily: 'var(--font-pangea)'
                            }}
                          >
                            Looking to host your own celebration? Make this date yours with a private booking at Lunasol.
                          </p>
                          <Link
                            href="/private-bookings"
                            className="inline-block px-8 py-3 text-lg font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#2C2C2C] rounded-md"
                            style={{
                              backgroundColor: '#806D4B',
                              color: '#DCD3B8',
                              fontFamily: 'var(--font-gascogne)',
                              border: '2px solid #806D4B',
                            }}
                          >
                            BOOK A PRIVATE EVENT
                          </Link>
                        </>
                      ) : (
                        <>
                          <p
                            className="text-xl mb-4"
                            style={{
                              color: '#DCD3B8',
                              fontFamily: 'var(--font-pangea)'
                            }}
                          >
                            Select a date to view events
                          </p>
                          <p
                            className="text-sm"
                            style={{
                              color: '#806D4B',
                              fontFamily: 'var(--font-pangea)',
                              opacity: 0.8
                            }}
                          >
                            Click on any date in the calendar
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
