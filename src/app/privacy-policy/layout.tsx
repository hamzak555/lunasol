import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read Lunasol Miami's privacy policy. Learn how we collect, use, and protect your personal information when you visit our website or venue.",
  openGraph: {
    title: "Privacy Policy | Lunasol Miami",
    description: "Lunasol Miami's privacy policy and data protection practices.",
    url: "https://lunasol.com/privacy-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
