import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events Calendar",
  description: "View upcoming events at Lunasol Miami. Check our calendar for the latest parties, DJ performances, and special nights at Wynwood's premier nightclub. Book tickets and reserve your table today.",
  keywords: ["Lunasol events", "Miami nightclub events", "Wynwood events", "Miami parties", "club events Miami", "nightlife calendar"],
  openGraph: {
    title: "Events Calendar | Lunasol Miami",
    description: "Discover upcoming events and parties at Lunasol Miami. World-class DJs, exclusive nights, and unforgettable experiences.",
    url: "https://lunasol.com/events",
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
