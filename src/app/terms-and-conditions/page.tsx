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

export default function TermsAndConditionsPage() {
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

  const sections = [
    {
      title: "Acceptance of Terms",
      content: "By accessing and using the Lunasol website and services, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website or services. We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of any changes."
    },
    {
      title: "Age Requirement and Entry",
      content: "Lunasol is strictly a 21+ establishment. Valid government-issued photo identification is required for entry. We reserve the right to refuse entry to anyone at our sole discretion, including for failure to meet age requirements, violation of dress code, intoxication, or disruptive behavior. Cover charges may apply and vary by event."
    },
    {
      title: "Dress Code",
      content: "We maintain an upscale nightlife dress code. Smart casual to formal attire is required. Athletic wear, shorts, sandals, flip-flops, baseball caps, and overly casual clothing are prohibited. Management reserves the right to refuse entry based on dress code violations."
    },
    {
      title: "Reservations and Bookings",
      content: "Reservations and table bookings are subject to availability and minimum spending requirements. Table minimums vary by date, time, and location. Cancellations must be made at least 48 hours in advance for a refund. No-shows and late cancellations may be charged the full table minimum. We reserve the right to reassign tables if parties arrive more than 15 minutes late."
    },
    {
      title: "Private Events",
      content: "Private event bookings require a signed contract and deposit. Deposits are non-refundable unless the venue cancels the event. Final guest counts and payment are due 7 days prior to the event. Additional charges may apply for damage to venue property or excessive cleanup requirements."
    },
    {
      title: "Conduct and Behavior",
      content: "Guests are expected to behave respectfully toward staff, other guests, and venue property. We have zero tolerance for harassment, discrimination, violence, or illegal activity. Guests may be removed without refund for violating venue policies, engaging in disruptive behavior, or breaking the law. Miami-Dade County and Florida state laws apply on premises."
    },
    {
      title: "Alcohol Service",
      content: "We reserve the right to refuse alcohol service to anyone at our discretion. Overserved guests will be cut off and may be asked to leave. Outside alcohol is strictly prohibited. We comply with all Florida alcohol service laws and regulations."
    },
    {
      title: "Photography and Filming",
      content: "By entering Lunasol, you consent to being photographed or filmed for promotional purposes. Photos and videos may be used on our website, social media, and marketing materials. Professional photography and filming require prior written approval from management."
    },
    {
      title: "Lost or Stolen Items",
      content: "Lunasol is not responsible for lost, stolen, or damaged personal property. We recommend keeping valuables secure at all times. Items found on premises will be held for 30 days before being discarded or donated."
    },
    {
      title: "Liability and Assumption of Risk",
      content: "You assume all risks associated with attending our venue, including but not limited to personal injury, property damage, or illness. Lunasol, its owners, employees, and affiliates are not liable for any injuries, losses, or damages that may occur on premises, except where prohibited by law."
    },
    {
      title: "Intellectual Property",
      content: "All content on the Lunasol website, including text, images, logos, and designs, is protected by copyright and trademark law. You may not use, reproduce, or distribute any content without written permission."
    },
    {
      title: "Severability",
      content: "If any provision of these Terms and Conditions is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect."
    },
    {
      title: "Contact Information",
      content: "For questions regarding these Terms and Conditions, please contact us at info@lunasol-miami.com or visit our Contact page."
    }
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

        <div className="relative z-10 container mx-auto px-8 max-w-4xl">
          {/* Page Title */}
          <h1
            className="text-6xl font-bold tracking-wide mb-4 text-center"
            style={{
              color: '#806D4B',
              fontFamily: 'var(--font-gascogne)',
              fontWeight: '900'
            }}
          >
            TERMS & CONDITIONS
          </h1>

          <p
            className="text-center mb-2"
            style={{
              color: '#DCD3B8',
              fontFamily: 'var(--font-pangea)',
              fontSize: '0.875rem'
            }}
          >
            Last Updated: January 2025
          </p>

          <p
            className="text-lg text-center mb-12"
            style={{
              color: '#DCD3B8',
              fontFamily: 'var(--font-pangea)'
            }}
          >
            Please read these terms carefully before using our services
          </p>

          {/* Intro Text */}
          <div
            className="mb-8 p-6 rounded-lg"
            style={{
              backgroundColor: '#2C2C2C',
              border: '2px solid #806D4B'
            }}
          >
            <p
              style={{
                color: '#DCD3B8',
                fontFamily: 'var(--font-pangea)',
                lineHeight: '1.75'
              }}
            >
              These Terms and Conditions govern your use of the Lunasol website and venue services. By accessing our website, making a reservation, or visiting our venue, you agree to comply with these terms. Please read them carefully.
            </p>
          </div>

          {/* Terms Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {sections.map((section, index) => (
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
                  {section.title}
                </AccordionTrigger>
                <AccordionContent
                  className="px-6 pb-4 pt-2"
                  style={{
                    color: '#DCD3B8',
                    fontFamily: 'var(--font-pangea)',
                    fontSize: '1rem',
                    lineHeight: '1.75'
                  }}
                >
                  {section.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <Footer />
    </>
  );
}
