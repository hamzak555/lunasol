import Image from "next/image";
import { parse, isBefore, startOfDay } from "date-fns";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  image: string;
  bookingLink?: string;
  isTicketed?: boolean;
  variant?: "clickable" | "button"; // clickable for home page, button for events page
}

export function EventCard({ title, date, time, image, bookingLink, isTicketed = false, variant = "button" }: EventCardProps) {
  // Check if event date has passed
  const isEventPassed = () => {
    try {
      const eventDate = parse(date, "MMMM d, yyyy", new Date());
      const today = startOfDay(new Date());
      return isBefore(eventDate, today);
    } catch {
      return false;
    }
  };

  const hasEventPassed = isEventPassed();

  if (variant === "clickable" && bookingLink && !hasEventPassed) {
    return (
      <a
        href={bookingLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative w-full overflow-hidden rounded-lg cursor-pointer" style={{ aspectRatio: '9/16' }}>
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain rounded-lg"
            style={{ backgroundColor: '#2C2C2C' }}
          />
          {/* Ticket Icon for Ticketed Events */}
          {isTicketed && (
            <div
              className="absolute top-2 right-2 p-2 rounded-full"
              style={{
                backgroundColor: '#806D4B',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#DCD3B8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
                <path d="M13 5v2"/>
                <path d="M13 17v2"/>
                <path d="M13 11v2"/>
              </svg>
            </div>
          )}
        </div>
      </a>
    );
  }

  // If clickable variant but event has passed, show as non-clickable
  if (variant === "clickable") {
    return (
      <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '9/16' }}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain rounded-lg"
          style={{ backgroundColor: '#2C2C2C' }}
        />
        {/* Ticket Icon for Ticketed Events */}
        {isTicketed && (
          <div
            className="absolute top-2 right-2 p-2 rounded-full"
            style={{
              backgroundColor: '#806D4B',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#DCD3B8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
              <path d="M13 5v2"/>
              <path d="M13 17v2"/>
              <path d="M13 11v2"/>
            </svg>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Event Image */}
      <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '9/16' }}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain rounded-lg"
          style={{ backgroundColor: '#2C2C2C' }}
        />
        {/* Ticket Icon for Ticketed Events */}
        {isTicketed && (
          <div
            className="absolute top-2 right-2 p-2 rounded-full"
            style={{
              backgroundColor: '#806D4B',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#DCD3B8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
              <path d="M13 5v2"/>
              <path d="M13 17v2"/>
              <path d="M13 11v2"/>
            </svg>
          </div>
        )}
      </div>

      {/* Book Now / Get Tickets Button */}
      {bookingLink && !hasEventPassed && (
        <a
          href={bookingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full px-6 py-3 text-center font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#0F0F0F] rounded-md"
          style={{
            backgroundColor: '#806D4B',
            color: '#DCD3B8',
            fontFamily: 'var(--font-pangea)',
            border: '2px solid #806D4B'
          }}
        >
          {isTicketed ? "GET TICKETS" : "BOOK NOW"}
        </a>
      )}
    </div>
  );
}
