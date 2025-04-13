"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";

const socialLinks = [
  { 
    icon: Github, 
    href: "https://github.com/appsicle", 
    label: "GitHub",
    color: "#333" 
  },
  { 
    icon: Linkedin, 
    href: "https://linkedin.com/in/albertzhang100", 
    label: "LinkedIn",
    color: "#0077B5" 
  },
  { 
    icon: Mail, 
    href: "mailto:aalbertzhang@gmail.com", 
    label: "Email",
    color: "#EA4335" 
  },
];

export default function Footer() {
  return (
    <footer className="relative py-16 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 grid-background opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/95" />
      
      <div className="container relative z-10 mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Logo and tagline */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center"
            >
              <Link href="/" className="font-space-grotesk text-2xl font-bold gradient-text">
                AZ
              </Link>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-foreground/70 max-w-md"
            >
              Building beautiful, functional, and performant web applications with modern technologies.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex space-x-4 pt-2"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2 rounded-full bg-background/50 border border-border/30 hover:border-primary/50 transition-all duration-300"
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: `${social.color}20`,
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20, 
                    delay: 0.3 + (index * 0.1) 
                  }}
                  viewport={{ once: true }}
                >
                  <social.icon size={18} style={{ color: social.color }} />
                </motion.a>
              ))}
            </motion.div>
          </div>
          
          {/* Quick links */}
          <div className="space-y-4">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-lg font-bold font-space-grotesk"
            >
              Quick Links
            </motion.h3>
            
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              {[
                { name: "Projects", href: "#projects" },
                { name: "About", href: "#about" },
                // { 
                //   name: "Resume", 
                //   href: "https://docs.google.com/document/d/e/2PACX-1vThj05LkyKj_BboimiYdlOvSN_luOGZU8oZF0_4HflwukXAJGM6X_kOCGt8ISwlym6pd74ktOh9yd6q/pub",
                //   external: true
                // },
              ].map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
                  viewport={{ once: true }}
                >
                  <Link 
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-foreground/70 hover:text-primary transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.name}
                    {link.external && (
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </div>
          
          {/* Contact */}
          <div className="space-y-4">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-lg font-bold font-space-grotesk"
            >
              Get In Touch
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-foreground/70"
            >
              Have a project in mind or want to chat? Feel free to reach out!
            </motion.p>
            
            <motion.a
              href="mailto:aalbertzhang@gmail.com"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-block text-primary hover:underline"
            >
              aalbertzhang@gmail.com
            </motion.a>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-border/10 mt-12 pt-6 text-center text-sm text-foreground/50"
        >
          <p>© {new Date().getFullYear()} Albert Zhang. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
} 