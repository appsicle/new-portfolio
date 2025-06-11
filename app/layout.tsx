import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Albert Zhang | Software Engineer & Web Developer",
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
    "Frontend Developer"
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
    <html lang="en" suppressHydrationWarning className={jakarta.variable}>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="min-h-screen flex flex-col bg-background nature-background grid-background">
            <Navigation />
            <main className="flex-grow relative z-10">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
