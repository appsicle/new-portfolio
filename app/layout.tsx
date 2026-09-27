import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { AnimatedThemeToggler } from "@/components/animated-theme-toggler";

const modernist = localFont({
  src: "../public/fonts/Sk-Modernist-Regular.otf",
  variable: "--font-modernist",
  weight: "400",
});

const description =
  "Albert Zhang is a software engineer in New York. Founding engineer at Launchpoint; previously Kashie, Parallel Distribution and Microsoft.";

// OG/Twitter images and icons come from the file conventions in app/
// (opengraph-image.png, twitter-image.png, icon.png, apple-icon.png, favicon.ico)
export const metadata: Metadata = {
  metadataBase: new URL("https://albertzhang.xyz"),
  title: "Albert Zhang",
  description,
  authors: [{ name: "Albert Zhang" }],
  creator: "Albert Zhang",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Albert Zhang",
    description,
    siteName: "Albert Zhang",
  },
  twitter: {
    card: "summary_large_image",
    title: "Albert Zhang",
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={modernist.variable}
      data-intro="night"
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AnimatedThemeToggler
            className="theme-toggle fixed top-6 z-50 cursor-pointer text-foreground"
            style={{ right: "clamp(1.5rem, 12vw, 12rem)" }}
          />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
