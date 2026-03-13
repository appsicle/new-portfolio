import "./globals.css";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { AnimatedThemeToggler } from "@/components/animated-theme-toggler";

const modernist = localFont({
  src: "../public/fonts/Sk-Modernist-Regular.otf",
  variable: "--font-modernist",
  weight: "400",
});

export const metadata = {
  title: "Albert Zhang",
  description:
    "Albert Zhang is a software engineer specializing in modern web development with React, Next.js, and TypeScript. View projects and skills.",
  keywords: [
    "Albert Zhang",
    "Software Engineer",
    "Web Developer",
    "React Developer",
    "Next.js",
    "TypeScript",
    "Portfolio",
    "Frontend Developer",
  ],
  authors: [{ name: "Albert Zhang" }],
  creator: "Albert Zhang",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://albertzhang.xyz",
    title: "Albert Zhang | Software Engineer & Web Developer",
    description: "Modern portfolio showcasing projects and skills in web development",
    siteName: "Albert Zhang Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Albert Zhang | Software Engineer & Web Developer",
    description: "Modern portfolio showcasing projects and skills in web development",
    creator: "@albertzhang",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={modernist.variable} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AnimatedThemeToggler
            className="fixed top-6 z-50 cursor-pointer text-foreground"
            style={{ right: "clamp(1.5rem, 12vw, 12rem)" }}
          />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
