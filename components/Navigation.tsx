"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { name: "Projects", href: "#projects" },
  { name: "About", href: "#about" },
  {
    name: "Resume",
    href: "https://docs.google.com/document/d/e/2PACX-1vThj05LkyKj_BboimiYdlOvSN_luOGZU8oZF0_4HflwukXAJGM6X_kOCGt8ISwlym6pd74ktOh9yd6q/pub",
  },
];

const socialLinks = [
  { icon: Github, href: "https://github.com/appsicle", ariaLabel: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/albertzhang100", ariaLabel: "LinkedIn" },
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-background/80 backdrop-blur-md py-3 shadow-md" : "bg-transparent py-5"
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="font-space-grotesk text-2xl font-bold gradient-text">
              AZ
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    locale={undefined}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    className="relative font-medium text-foreground/80 hover:text-primary transition-colors duration-300 group"
                  >
                    {item.name}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className="flex items-center space-x-4 pl-6 border-l border-border/30">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.ariaLabel}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className="text-foreground/70 hover:text-primary transition-colors duration-300"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20, 
                    delay: 0.5 + (index * 0.1) 
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          <motion.button
            className="md:hidden text-foreground hover:text-primary transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-6 py-4 space-y-4">
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
                    className="block py-2 text-lg font-medium text-foreground hover:text-primary transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div 
                className="flex items-center space-x-5 pt-4 border-t border-border/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {socialLinks.map((social) => (
                  <a
                    key={social.ariaLabel}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel}
                    className="text-foreground/70 hover:text-primary transition-colors duration-300"
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

