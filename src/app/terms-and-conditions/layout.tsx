import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read Lunasol Miami's terms and conditions. Important information about venue policies, entry requirements, reservations, and guest conduct.",
  openGraph: {
    title: "Terms & Conditions | Lunasol Miami",
    description: "Lunasol Miami's terms of service and venue policies.",
    url: "https://lunasol.com/terms-and-conditions",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
