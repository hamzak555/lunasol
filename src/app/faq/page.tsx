"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
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

  const faqs = [
    {
      question: "What are your operating hours?",
      answer: "Lunasol is open Friday and Saturday from 10PM to 3AM. We're closed Sunday through Thursday."
    },
    {
      question: "Do I need a reservation?",
      answer: "While walk-ins are welcome based on availability, we highly recommend making a reservation to guarantee entry and the best experience. Book your table or join our guest list through our website."
    },
    {
      question: "What is your dress code?",
      answer: "We maintain an upscale nightlife dress code. Smart casual to formal attire is required. No athletic wear, shorts, sandals, or baseball caps. Management reserves the right to refuse entry based on dress code."
    },
    {
      question: "Is there a cover charge?",
      answer: "Cover charges vary depending on the night and event. Guest list members may receive reduced or waived cover. Please check our events page or contact us for specific pricing."
    },
    {
      question: "What is your age requirement?",
      answer: "Lunasol is strictly 21+ only. Valid government-issued photo ID is required for entry. We do not make exceptions."
    },
    {
      question: "Do you offer bottle service?",
      answer: "Yes! We offer premium bottle service with dedicated VIP hosting. Table minimums vary by night and location. Contact us for private booking inquiries and pricing."
    },
    {
      question: "Where are you located?",
      answer: "We're located in the heart of Wynwood at 158 NW 24th St, Miami, FL. Street parking and nearby lots are available."
    },
    {
      question: "Can I host a private event at Lunasol?",
      answer: "Absolutely! Lunasol is available for private events and buyouts. Please visit our Private Bookings page or contact us directly to discuss your event needs."
    },
  ];

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

      {/* FAQ Content */}
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

        <div className="relative z-10 container mx-auto px-4 md:px-8 max-w-4xl">
          {/* Page Title */}
          <div className="animate-fade-in">
            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-wide mb-4 text-center"
              style={{
                color: '#806D4B',
                fontFamily: 'var(--font-gascogne)',
                fontWeight: '900'
              }}
            >
              FREQUENTLY ASKED QUESTIONS
            </h1>

            <p
              className="text-sm md:text-lg text-center mb-12"
              style={{
                color: '#DCD3B8',
                fontFamily: 'var(--font-pangea)'
              }}
            >
              Everything you need to know about Lunasol Miami
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-4 animate-slide-up delay-200">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-lg overflow-hidden"
                style={{
                  backgroundColor: '#2C2C2C',
                  border: '1px solid #806D4B'
                }}
              >
                <AccordionTrigger
                  className="px-6 py-4 hover:no-underline hover:bg-[#806D4B]/20 transition-all"
                  style={{
                    color: '#806D4B',
                    fontFamily: 'var(--font-gascogne)',
                    fontSize: '1.125rem',
                    fontWeight: '700'
                  }}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent
                  className="px-6 pb-4 pt-2 text-sm md:text-base"
                  style={{
                    color: '#DCD3B8',
                    fontFamily: 'var(--font-pangea)',
                    lineHeight: '1.75'
                  }}
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Still Have Questions Section */}
          <div
            className="mt-16 p-8 rounded-lg text-center"
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
              Still Have Questions?
            </h2>
            <p
              className="mb-6 text-sm md:text-base"
              style={{
                color: '#DCD3B8',
                fontFamily: 'var(--font-pangea)'
              }}
            >
              Our team is here to help. Reach out to us directly.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 text-lg font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#0F0F0F]"
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

      <Footer />
    </>
  );
}
