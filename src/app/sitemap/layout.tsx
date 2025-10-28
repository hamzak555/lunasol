import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Navigate all pages on Lunasol Miami's website. Find events, contact information, private bookings, FAQs, and more.",
  openGraph: {
    title: "Sitemap | Lunasol Miami",
    description: "Complete navigation of all pages on Lunasol Miami's website.",
    url: "https://lunasol.com/sitemap",
  },
};

export default function SitemapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
