import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { BackToTop } from "@/components/BackToTop";
import { FB_PIXEL_ID } from "@/lib/fbpixel";

const gascogne = localFont({
  src: [
    {
      path: "../../public/Fonts/Gascogne Serial/Gascogne Serial.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/Fonts/Gascogne Serial/Gascogne Serial Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/Fonts/Gascogne Serial/Gascogne Serial Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/Fonts/Gascogne Serial/Gascogne Serial Heavy.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-gascogne",
});

const pangea = localFont({
  src: [
    {
      path: "../../public/Fonts/Pangea/Pangea-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/Fonts/Pangea/Pangea-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/Fonts/Pangea/Pangea-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/Fonts/Pangea/Pangea-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/Fonts/Pangea/Pangea-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pangea",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lunasol.com'),
  title: {
    default: "Lunasol Miami | Premier Nightclub in Wynwood - Bottle Service & Events",
    template: "%s | Lunasol Miami"
  },
  description: "Experience Wynwood's most exclusive nightlife destination. Lunasol offers upscale cocktail lounge vibes and high-energy nightclub atmosphere with premium bottle service, retractable roof, and unforgettable Miami nights. Open Friday & Saturday 10PM-3AM.",
  keywords: ["Lunasol Miami", "Wynwood nightclub", "Miami nightlife", "bottle service Miami", "Wynwood nightlife", "Miami club", "private events Miami", "VIP nightclub", "Miami parties", "Miami events", "nightclub near me"],
  authors: [{ name: "Lunasol Miami" }],
  creator: "Lunasol Miami",
  publisher: "Lunasol Miami",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: "Lunasol Miami | Premier Nightclub in Wynwood",
    description: "Escape the ordinary at Wynwood's most exclusive nightlife destination. Premium bottle service, world-class DJs, and unforgettable nights under the stars.",
    url: "https://lunasol.com",
    siteName: "Lunasol Miami",
    images: [
      {
        url: "/Images/Hero Image.jpg",
        width: 1200,
        height: 630,
        alt: "Lunasol Miami Nightclub"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lunasol Miami | Premier Nightclub in Wynwood",
    description: "Experience Wynwood's most exclusive nightlife destination with premium bottle service and unforgettable nights.",
    images: ["/Images/Hero Image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${gascogne.variable} ${pangea.variable} antialiased overflow-x-hidden`}
        style={{ fontFamily: 'var(--font-pangea)' }}
      >
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
