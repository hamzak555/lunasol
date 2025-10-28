import Image from "next/image";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  image: string;
  bookingLink?: string;
  variant?: "clickable" | "button"; // clickable for home page, button for events page
}

export function EventCard({ title, date, time, image, bookingLink, variant = "button" }: EventCardProps) {
  if (variant === "clickable" && bookingLink) {
    return (
      <a
        href={bookingLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative w-full overflow-hidden rounded-lg cursor-pointer transition-all hover:scale-105" style={{ aspectRatio: '9/16' }}>
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain rounded-lg"
            style={{ backgroundColor: '#2C2C2C' }}
          />
        </div>
      </a>
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
      </div>

      {/* Book Now Button */}
      {bookingLink && (
        <a
          href={bookingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full px-6 py-3 text-center font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#0F0F0F]"
          style={{
            backgroundColor: '#806D4B',
            color: '#DCD3B8',
            fontFamily: 'var(--font-pangea)',
            border: '2px solid #806D4B',
            borderRadius: '0.5rem'
          }}
        >
          BOOK NOW
        </a>
      )}
    </div>
  );
}
