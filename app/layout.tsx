import "./globals.css";
import Footer from "../components/Footer";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";

const heading = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-heading",
});

const body = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-body",
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
    <html lang="en" className={`dark ${heading.variable} ${body.variable}`}>
      <body className="bg-background text-foreground">
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
