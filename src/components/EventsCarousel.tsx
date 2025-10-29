"use client";

import { EventCard } from "./EventCard";
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

interface EventsCarouselProps {
  events: Event[];
}

export function EventsCarousel({ events }: EventsCarouselProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <div className="overflow-hidden">
          <CarouselContent className="-ml-2 md:-ml-4">
          {events.map((event) => (
            <CarouselItem key={event.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
              <EventCard
                title={event.title}
                date={event.date}
                time={event.time}
                image={event.image_url}
                bookingLink={event.booking_link}
                isTicketed={event.is_ticketed}
                variant="clickable"
              />
            </CarouselItem>
          ))}
          </CarouselContent>
        </div>
        <CarouselPrevious
          className="flex -left-5 md:-left-6 !w-10 !h-10 md:!w-12 md:!h-12 !border-[#806D4B] transition-all hover:!border-[#DCD3B8] hover:!border-2"
          style={{
            borderColor: '#806D4B',
            color: '#DCD3B8',
            backgroundColor: '#806D4B'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </CarouselPrevious>
        <CarouselNext
          className="flex -right-5 md:-right-6 !w-10 !h-10 md:!w-12 md:!h-12 !border-[#806D4B] transition-all hover:!border-[#DCD3B8] hover:!border-2"
          style={{
            borderColor: '#806D4B',
            color: '#DCD3B8',
            backgroundColor: '#806D4B'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </CarouselNext>
      </Carousel>
    </div>
  );
}
