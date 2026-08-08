import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Lunasol Miami. Contact us for reservations, private events, VIP services, or general inquiries. Located at 158 NW 24th St in Wynwood. Open Friday & Saturday 10PM-3AM.",
  keywords: ["Lunasol contact", "Miami nightclub contact", "Wynwood nightclub", "club reservations Miami", "VIP booking"],
  openGraph: {
    title: "Contact Us | Lunasol Miami",
    description: "Get in touch with Lunasol Miami for reservations and inquiries. We're here to help create your perfect night out.",
    url: "https://lunasol.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
