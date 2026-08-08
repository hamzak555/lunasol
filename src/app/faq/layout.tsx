import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions",
  description: "Find answers to frequently asked questions about Lunasol Miami. Learn about hours, dress code, reservations, bottle service, age requirements, and more. Plan your visit to Wynwood's premier nightclub.",
  keywords: ["Lunasol FAQ", "nightclub questions", "Miami club info", "dress code", "bottle service info", "club hours"],
  openGraph: {
    title: "FAQ | Lunasol Miami",
    description: "Everything you need to know about Lunasol Miami. Hours, dress code, reservations, and more.",
    url: "https://lunasol.com/faq",
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
