import "./globals.css";
import { Inter, Poppins, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const poppins = Poppins({ 
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap"
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable} ${spaceGrotesk.variable}`}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
