"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [submitting, setSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // TODO: Add your form submission logic here
    console.log("Form submitted:", formData);

    // Simulate submission
    setTimeout(() => {
      alert("Thank you for contacting us! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
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

      {/* Contact Content */}
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
              GET IN TOUCH
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

          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
            {/* Contact Information */}
            <div className="order-1 lg:order-none">
              <div
                className="p-6 rounded-lg animate-slide-in-left delay-200"
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
                  Contact Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3
                      className="font-bold mb-2"
                      style={{
                        color: '#806D4B',
                        fontFamily: 'var(--font-gascogne)'
                      }}
                    >
                      Address
                    </h3>
                    <p
                      className="text-sm md:text-base"
                      style={{
                        color: '#DCD3B8',
                        fontFamily: 'var(--font-pangea)'
                      }}
                    >
                      158 NW 24th St<br />
                      Miami, FL 33127
                    </p>
                  </div>

                  <div>
                    <h3
                      className="font-bold mb-2"
                      style={{
                        color: '#806D4B',
                        fontFamily: 'var(--font-gascogne)'
                      }}
                    >
                      Hours
                    </h3>
                    <p
                      className="text-sm md:text-base"
                      style={{
                        color: '#DCD3B8',
                        fontFamily: 'var(--font-pangea)'
                      }}
                    >
                      Friday: 10PM - 3AM<br />
                      Saturday: 10PM - 3AM
                    </p>
                  </div>

                  <div>
                    <h3
                      className="font-bold mb-2"
                      style={{
                        color: '#806D4B',
                        fontFamily: 'var(--font-gascogne)'
                      }}
                    >
                      Email
                    </h3>
                    <a
                      href="mailto:info@lunasol-miami.com"
                      className="transition-colors hover:text-[#806D4B] text-sm md:text-base"
                      style={{
                        color: '#DCD3B8',
                        fontFamily: 'var(--font-pangea)'
                      }}
                    >
                      info@lunasol-miami.com
                    </a>
                  </div>

                  <div>
                    <h3
                      className="font-bold mb-2"
                      style={{
                        color: '#806D4B',
                        fontFamily: 'var(--font-gascogne)'
                      }}
                    >
                      Social Media
                    </h3>
                    <a
                      href="https://www.instagram.com/lunasol/?hl=en"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 transition-colors hover:text-[#806D4B] text-sm md:text-base"
                      style={{
                        color: '#DCD3B8',
                        fontFamily: 'var(--font-pangea)'
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
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
                      @lunasol
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="order-2 lg:order-none">
              <div
                className="p-8 rounded-lg animate-slide-in-right delay-400"
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
                Send Us a Message
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
                    Phone
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
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
                    Subject *
                  </label>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
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
                    Message *
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full resize-none"
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
                  {submitting ? "SENDING..." : "SEND MESSAGE"}
                </button>
              </form>
              </div>
            </div>

            {/* Quick Links */}
            <div className="order-3 lg:order-none lg:col-start-1 lg:row-start-2">
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
                  Quick Links
                </h2>
                <div className="space-y-3">
                  <a
                    href="/private-bookings"
                    className="block transition-colors hover:text-[#806D4B] text-sm md:text-base"
                    style={{
                      color: '#DCD3B8',
                      fontFamily: 'var(--font-pangea)'
                    }}
                  >
                    Private Bookings →
                  </a>
                  <a
                    href="/events"
                    className="block transition-colors hover:text-[#806D4B] text-sm md:text-base"
                    style={{
                      color: '#DCD3B8',
                      fontFamily: 'var(--font-pangea)'
                    }}
                  >
                    Upcoming Events →
                  </a>
                  <a
                    href="/faq"
                    className="block transition-colors hover:text-[#806D4B] text-sm md:text-base"
                    style={{
                      color: '#DCD3B8',
                      fontFamily: 'var(--font-pangea)'
                    }}
                  >
                    FAQ →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
