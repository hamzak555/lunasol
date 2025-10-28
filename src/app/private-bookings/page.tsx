"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

export default function PrivateBookingsPage() {
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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guestCount: "",
    eventType: "",
    message: ""
  });
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // TODO: Add your form submission logic here
    const submissionData = {
      ...formData,
      eventDate: eventDate ? format(eventDate, "MMMM d, yyyy") : ""
    };
    console.log("Booking submitted:", submissionData);

    // Simulate submission
    setTimeout(() => {
      alert("Thank you for your interest! Our events team will contact you within 24 hours.");
      setFormData({ name: "", email: "", phone: "", guestCount: "", eventType: "", message: "" });
      setEventDate(undefined);
      setSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

      <Header />

      {/* Private Bookings Content */}
      <div
        className="relative min-h-screen pt-40 pb-16 -mt-[73px]"
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

        {/* Spotted Pattern - Left side cropped */}
        <div
          className="absolute top-1/2 -left-32 pointer-events-none"
          style={{ width: '800px', height: '800px', zIndex: 5, opacity: 0.3, transform: 'translateY(-50%)' }}
        >
          <Image
            src="/Images/Spotted Pattern.svg"
            alt="Spotted Pattern"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-8 max-w-6xl">
          {/* Page Title */}
          <div className="animate-fade-in">
            <h1
              className="text-6xl font-bold tracking-wide mb-4 text-center"
              style={{
                color: '#806D4B',
                fontFamily: 'var(--font-gascogne)',
                fontWeight: '900'
              }}
            >
              PRIVATE BOOKINGS
            </h1>

            {/* Sun Icon */}
            <div className="flex justify-center mb-12">
              <Image
                src="/Images/Sun Icon 2.svg"
                alt="Sun Icon"
                width={104}
                height={104}
                style={{ opacity: 0.7 }}
              />
            </div>
          </div>

          {/* Intro Section */}
          <div
            className="mb-12 p-8 rounded-lg animate-slide-up delay-200"
            style={{
              backgroundColor: '#2C2C2C',
              border: '2px solid #806D4B'
            }}
          >
            <p
              className="text-lg leading-relaxed mb-6"
              style={{
                color: '#DCD3B8',
                fontFamily: 'var(--font-pangea)'
              }}
            >
              Lunasol offers an exclusive setting for private events, celebrations, and corporate gatherings.
              Our dual-concept venue seamlessly transforms from an upscale cocktail lounge to a high-energy nightclub,
              providing the perfect atmosphere for any occasion.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{
                    color: '#806D4B',
                    fontFamily: 'var(--font-gascogne)'
                  }}
                >
                  Premium Bottle Service
                </h3>
                <p
                  style={{
                    color: '#DCD3B8',
                    fontFamily: 'var(--font-pangea)'
                  }}
                >
                  Curated selection of spirits and champagne with dedicated VIP hosting
                </p>
              </div>
              <div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{
                    color: '#806D4B',
                    fontFamily: 'var(--font-gascogne)'
                  }}
                >
                  Flexible Spaces
                </h3>
                <p
                  style={{
                    color: '#DCD3B8',
                    fontFamily: 'var(--font-pangea)'
                  }}
                >
                  VIP sections, full venue buyouts, and customizable layouts available
                </p>
              </div>
              <div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{
                    color: '#806D4B',
                    fontFamily: 'var(--font-gascogne)'
                  }}
                >
                  Unforgettable Experience
                </h3>
                <p
                  style={{
                    color: '#DCD3B8',
                    fontFamily: 'var(--font-pangea)'
                  }}
                >
                  State-of-the-art sound system, lighting, and retractable roof
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Booking Form */}
            <div
              className="p-8 rounded-lg animate-slide-in-left delay-300"
              style={{
                backgroundColor: '#2C2C2C',
                border: '2px solid #806D4B'
              }}
            >
              <h2
                className="text-2xl font-bold mb-6"
                style={{
                  color: '#806D4B',
                  fontFamily: 'var(--font-gascogne)'
                }}
              >
                Request a Booking
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{
                      color: '#DCD3B8',
                      fontFamily: 'var(--font-pangea)'
                    }}
                  >
                    Name *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full"
                    style={{
                      backgroundColor: '#1F1F1F',
                      border: '1px solid #806D4B',
                      color: '#DCD3B8',
                      fontFamily: 'var(--font-pangea)'
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{
                      color: '#DCD3B8',
                      fontFamily: 'var(--font-pangea)'
                    }}
                  >
                    Email *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                    style={{
                      backgroundColor: '#1F1F1F',
                      border: '1px solid #806D4B',
                      color: '#DCD3B8',
                      fontFamily: 'var(--font-pangea)'
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{
                      color: '#DCD3B8',
                      fontFamily: 'var(--font-pangea)'
                    }}
                  >
                    Phone *
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full"
                    style={{
                      backgroundColor: '#1F1F1F',
                      border: '1px solid #806D4B',
                      color: '#DCD3B8',
                      fontFamily: 'var(--font-pangea)'
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{
                      color: '#DCD3B8',
                      fontFamily: 'var(--font-pangea)'
                    }}
                  >
                    Preferred Event Date *
                  </label>
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="w-full px-4 py-3 rounded focus:outline-none focus:ring-2 flex items-center justify-start gap-2"
                        style={{
                          backgroundColor: "#1F1F1F",
                          border: "1px solid #806D4B",
                          color: "#DCD3B8",
                          fontFamily: "var(--font-pangea)",
                        }}
                      >
                        <CalendarIcon className="h-4 w-4" style={{ color: "#806D4B" }} />
                        {eventDate ? (
                          format(eventDate, "MMMM d, yyyy")
                        ) : (
                          <span style={{ opacity: 0.5 }}>Pick a date</span>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      style={{ backgroundColor: "#2C2C2C", border: "1px solid #806D4B" }}
                    >
                      <Calendar
                        mode="single"
                        selected={eventDate}
                        onSelect={(selectedDate) => {
                          setEventDate(selectedDate);
                          setDatePickerOpen(false);
                        }}
                        initialFocus
                        className="rounded-md"
                        classNames={{
                          day_selected: "!bg-white !text-[#2C2C2C] !font-bold"
                        }}
                        style={{ backgroundColor: "#2C2C2C", color: "#DCD3B8" }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{
                      color: '#DCD3B8',
                      fontFamily: 'var(--font-pangea)'
                    }}
                  >
                    Expected Guest Count *
                  </label>
                  <Input
                    type="number"
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full"
                    style={{
                      backgroundColor: '#1F1F1F',
                      border: '1px solid #806D4B',
                      color: '#DCD3B8',
                      fontFamily: 'var(--font-pangea)'
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{
                      color: '#DCD3B8',
                      fontFamily: 'var(--font-pangea)'
                    }}
                  >
                    Event Type *
                  </label>
                  <Input
                    type="text"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                    placeholder="Birthday, Corporate Event, etc."
                    className="w-full"
                    style={{
                      backgroundColor: '#1F1F1F',
                      border: '1px solid #806D4B',
                      color: '#DCD3B8',
                      fontFamily: 'var(--font-pangea)'
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{
                      color: '#DCD3B8',
                      fontFamily: 'var(--font-pangea)'
                    }}
                  >
                    Additional Details
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full resize-none"
                    placeholder="Tell us more about your event..."
                    style={{
                      backgroundColor: '#1F1F1F',
                      border: '1px solid #806D4B',
                      color: '#DCD3B8',
                      fontFamily: 'var(--font-pangea)'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-8 py-3 text-lg font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#0F0F0F] disabled:opacity-50"
                  style={{
                    backgroundColor: '#806D4B',
                    color: '#DCD3B8',
                    fontFamily: 'var(--font-gascogne)',
                    border: '2px solid #806D4B',
                    borderRadius: '0.5rem'
                  }}
                >
                  {submitting ? "SUBMITTING..." : "REQUEST BOOKING"}
                </button>
              </form>
            </div>

            {/* Event Types & Information */}
            <div className="space-y-6 animate-slide-in-right delay-500">
              <div
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
                  Perfect For
                </h2>
                <ul className="space-y-3">
                  {[
                    "Birthday Celebrations",
                    "Corporate Events",
                    "Product Launches",
                    "Bachelor/Bachelorette Parties",
                    "Private Concerts",
                    "Networking Events",
                    "Holiday Parties",
                    "Full Venue Buyouts"
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3"
                      style={{
                        color: '#DCD3B8',
                        fontFamily: 'var(--font-pangea)'
                      }}
                    >
                      <span style={{ color: '#806D4B' }}>→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div
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
                  What to Expect
                </h2>
                <div className="space-y-4">
                  <p
                    style={{
                      color: '#DCD3B8',
                      fontFamily: 'var(--font-pangea)'
                    }}
                  >
                    Our events team will contact you within 24 hours to discuss your requirements,
                    available packages, and pricing options.
                  </p>
                  <p
                    style={{
                      color: '#DCD3B8',
                      fontFamily: 'var(--font-pangea)'
                    }}
                  >
                    Table minimums and availability vary by date and day of the week.
                    We recommend booking at least 2-3 weeks in advance for optimal availability.
                  </p>
                </div>
              </div>

              <div
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
                  Questions?
                </h2>
                <p
                  className="mb-4"
                  style={{
                    color: '#DCD3B8',
                    fontFamily: 'var(--font-pangea)'
                  }}
                >
                  For immediate assistance or general inquiries, please contact us directly.
                </p>
                <a
                  href="/contact"
                  className="inline-block px-6 py-2 text-base font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#0F0F0F]"
                  style={{
                    backgroundColor: '#806D4B',
                    color: '#DCD3B8',
                    fontFamily: 'var(--font-gascogne)',
                    border: '2px solid #806D4B',
                    borderRadius: '0.5rem'
                  }}
                >
                  CONTACT US
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
