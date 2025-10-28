import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Bookings & Events",
  description: "Book your private event at Lunasol Miami. Perfect for birthday celebrations, corporate events, product launches, and private parties. Premium bottle service, dedicated VIP hosting, and customizable venue options in Wynwood.",
  keywords: ["private events Miami", "venue rental Wynwood", "birthday party venue", "corporate events Miami", "private club booking", "VIP event space"],
  openGraph: {
    title: "Private Bookings & Events | Lunasol Miami",
    description: "Create unforgettable moments with private event bookings at Lunasol. From birthdays to corporate events, we make every occasion special.",
    url: "https://lunasol.com/private-bookings",
  },
};

export default function PrivateBookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
