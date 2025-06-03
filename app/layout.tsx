import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `html { --font-plus-jakarta-sans: 'Plus Jakarta Sans', sans-serif; }` }} />
      </head>
      <body className="font-sans">
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
