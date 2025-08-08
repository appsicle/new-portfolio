"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { name: "Projects", href: "#projects" },
  { name: "About", href: "#about" },
];

const socialLinks = [
  { icon: Github, href: "https://github.com/appsicle", ariaLabel: "GitHub" },
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/albertzhang100",
    ariaLabel: "LinkedIn",
  },
  { icon: Mail, href: "mailto:aalbertzhang@gmail.com", ariaLabel: "Email" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-md py-3 shadow-lg" : "py-4"
      }`}
      style={
        scrolled
          ? {
              background:
                "linear-gradient(180deg, rgba(24,24,27,0.6), rgba(24,24,27,0.3))",
              borderBottom: "1px solid rgba(148, 163, 184, 0.15)",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
            }
          : {
              background:
                "linear-gradient(180deg, rgba(24,24,27,0.4), rgba(24,24,27,0.15))",
            }
      }
    >
      <div className="container mx-auto px-6 mt-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, rotate: -10 }}
            animate={{ opacity: 1, rotate: 0 }}
            className="flex items-center space-x-2 leaf-float"
          >
            <div
              className="p-2 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(56, 189, 248, 0.15))",
                border: "1px solid rgba(147, 51, 234, 0.3)",
              }}
            >
              <Sparkles size={20} className="text-violet-400" />
            </div>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.2 }}
                >
                  <Link
                    href={item.href}
                    locale={undefined}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    className="relative font-medium text-muted-foreground hover:text-primary transition-all duration-300 text-lg px-3 py-2 rounded-lg"
                  >
                    {item.name}
                    <span
                      className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 hover:w-full bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-300"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            <div
              className="flex items-center space-x-4 pl-6 border-l"
              style={{
                borderColor: "rgba(139, 69, 19, 0.2)",
              }}
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.ariaLabel}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className="text-muted-foreground hover:text-primary transition-all duration-300 p-2 rounded-lg"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.5 + index * 0.1,
                  }}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgba(76, 175, 80, 0.1)",
                    borderColor: "rgba(76, 175, 80, 0.3)",
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          <motion.button
            className="md:hidden text-foreground hover:text-primary transition-all duration-300 p-2 rounded-lg nature-hover"
            style={{
              background: "rgba(147, 51, 234, 0.08)",
              border: "1px solid rgba(147, 51, 234, 0.2)",
            }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            whileHover={{
              backgroundColor: "rgba(56, 189, 248, 0.12)",
              borderColor: "rgba(147, 51, 234, 0.35)",
            }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 nature-card backdrop-blur-md border-t"
            style={{
              background:
                "linear-gradient(180deg, rgba(24,24,27,0.9), rgba(24,24,27,0.6))",
              borderColor: "rgba(148, 163, 184, 0.2)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-6 py-6 space-y-4">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    locale={undefined}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    className="block py-3 px-4 text-lg font-medium text-muted-foreground hover:text-primary transition-all duration-300 rounded-lg nature-hover"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                className="flex items-center justify-center space-x-5 pt-4 mt-6 border-t"
                style={{ borderColor: "rgba(148, 163, 184, 0.15)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.ariaLabel}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 p-3 rounded-lg nature-hover"
                    style={{
                      background: "rgba(147, 51, 234, 0.08)",
                      border: "1px solid rgba(147, 51, 234, 0.2)",
                    }}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(56, 189, 248, 0.12)",
                      borderColor: "rgba(147, 51, 234, 0.35)",
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <social.icon size={22} />
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
