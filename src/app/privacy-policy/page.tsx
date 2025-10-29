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

export default function PrivacyPolicyPage() {
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
      title: "Information We Collect",
      content: "We collect information you provide directly to us when you make a reservation, join our guest list, book a private event, or contact us. This may include your name, email address, phone number, and event preferences. We also automatically collect certain information about your device when you visit our website, including your IP address, browser type, and browsing behavior."
    },
    {
      title: "How We Use Your Information",
      content: "We use the information we collect to process reservations, manage guest lists, communicate with you about events and promotions, respond to your inquiries, improve our services, and comply with legal obligations. We may also use your information to send you marketing communications, which you can opt out of at any time."
    },
    {
      title: "Information Sharing",
      content: "We do not sell your personal information to third parties. We may share your information with service providers who assist us in operating our venue and website, with law enforcement when required by law, and with our affiliates and business partners for legitimate business purposes. All third parties are required to maintain the confidentiality of your information."
    },
    {
      title: "Data Security",
      content: "We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security. We retain your information only as long as necessary to fulfill the purposes outlined in this policy."
    },
    {
      title: "Cookies and Tracking",
      content: "We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences. Some features of our website may not function properly if cookies are disabled."
    },
    {
      title: "Your Rights",
      content: "You have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing of your data. To exercise these rights, please contact us using the information provided below. We will respond to your request within a reasonable timeframe."
    },
    {
      title: "Age Requirements",
      content: "Lunasol is a 21+ venue. We do not knowingly collect information from individuals under 21 years of age. If we learn that we have collected information from someone under 21, we will delete that information immediately."
    },
    {
      title: "Changes to This Policy",
      content: "We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the 'Last Updated' date. Your continued use of our services after changes are posted constitutes acceptance of the updated policy."
    },
    {
      title: "Contact Us",
      content: "If you have questions or concerns about this Privacy Policy or our data practices, please contact us at info@lunasol-miami.com or visit our Contact page."
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
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-wide mb-4 text-center"
            style={{
              color: '#806D4B',
              fontFamily: 'var(--font-gascogne)',
              fontWeight: '900'
            }}
          >
            PRIVACY POLICY
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
            className="text-sm md:text-lg text-center mb-12"
            style={{
              color: '#DCD3B8',
              fontFamily: 'var(--font-pangea)'
            }}
          >
            Your privacy is important to us
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
              className="text-sm md:text-base"
              style={{
                color: '#DCD3B8',
                fontFamily: 'var(--font-pangea)',
                lineHeight: '1.75'
              }}
            >
              This Privacy Policy describes how Lunasol ("we," "us," or "our") collects, uses, and protects your personal information when you visit our website or use our services. By accessing our website or providing us with your information, you agree to the practices described in this policy.
            </p>
          </div>

          {/* Privacy Policy Accordion */}
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
                  className="px-6 pb-4 pt-2 text-sm md:text-base"
                  style={{
                    color: '#DCD3B8',
                    fontFamily: 'var(--font-pangea)',
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
