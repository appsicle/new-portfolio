"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin, Mail, ExternalLink, Heart, Sprout } from "lucide-react";

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
    <footer 
      className="py-20 sm:py-24 relative border-t"
      style={{
        background: `
          linear-gradient(135deg, rgba(245, 245, 220, 0.8), rgba(255, 248, 225, 0.6)),
          radial-gradient(circle at 30% 20%, rgba(139, 69, 19, 0.04) 0%, transparent 60%),
          radial-gradient(circle at 70% 80%, rgba(76, 175, 80, 0.03) 0%, transparent 50%)
        `,
        borderColor: 'rgba(139, 69, 19, 0.15)'
      }}
    >
      {/* Nature decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-12 left-20 w-3 h-3 rounded-full opacity-25 leaf-float"
          style={{ backgroundColor: '#4CAF50' }}
        />
        <div 
          className="absolute bottom-16 right-24 w-4 h-4 rounded-full opacity-20"
          style={{ backgroundColor: '#8BC34A' }}
        />
        <div 
          className="absolute top-1/2 right-16 w-2 h-2 rounded-full opacity-30"
          style={{ backgroundColor: '#81C784' }}
        />
      </div>
      
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
          {/* Logo and tagline */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3"
            >
              <div 
                className="p-3 rounded-full leaf-float"
                style={{
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(139, 69, 19, 0.1))',
                  border: '1.5px solid rgba(76, 175, 80, 0.3)'
                }}
              >
                <Sprout size={24} className="text-green-600" />
              </div>
              <span 
                className="text-xl font-bold"
                style={{
                  color: '#2E7D32',
                  textShadow: '0 1px 2px rgba(139, 69, 19, 0.1)'
                }}
              >
                Albert Zhang
              </span>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-muted-foreground text-base max-w-md leading-relaxed"
              style={{ textShadow: '0 1px 1px rgba(139, 69, 19, 0.05)' }}
            >
              Cultivating beautiful, functional, and sustainable digital experiences 
              that grow and flourish like nature itself.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
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
                  className="p-3 rounded-lg transition-all duration-300 nature-hover"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.08), rgba(76, 175, 80, 0.05))',
                    border: '1px solid rgba(139, 69, 19, 0.15)',
                    color: '#2E7D32'
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: 'rgba(76, 175, 80, 0.15)',
                    borderColor: 'rgba(76, 175, 80, 0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20, 
                    delay: 0.4 + (index * 0.1) 
                  }}
                  viewport={{ once: true }}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </motion.div>
          </div>
          
          {/* Quick links */}
          <div className="space-y-6">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-lg font-semibold"
              style={{
                color: '#2E7D32',
                textShadow: '0 1px 2px rgba(139, 69, 19, 0.1)'
              }}
            >
              Explore
            </motion.h3>
            
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {[
                { name: "Projects", href: "#projects", external: false },
                { name: "About", href: "#about", external: false },
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
                    className="text-muted-foreground hover:text-primary text-base transition-all duration-300 flex items-center gap-2 group rounded-lg"
                    style={{
                      textShadow: '0 1px 1px rgba(139, 69, 19, 0.05)'
                    }}
                  >
                    {link.name}
                    {link.external && (
                      <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </div>
          
          {/* Contact */}
          <div className="space-y-6">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-lg font-semibold"
              style={{
                color: '#2E7D32',
                textShadow: '0 1px 2px rgba(139, 69, 19, 0.1)'
              }}
            >
              Let&apos;s Connect
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-muted-foreground text-base leading-relaxed"
              style={{ textShadow: '0 1px 1px rgba(139, 69, 19, 0.05)' }}
            >
              Have an idea you&apos;d like to bring to life? Let&apos;s cultivate something beautiful together.
            </motion.p>
            
            <motion.a
              href="mailto:aalbertzhang@gmail.com"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-block text-primary hover:underline text-base font-medium rounded-lg r"
              style={{
                color: '#2E7D32',
                textShadow: '0 1px 1px rgba(139, 69, 19, 0.05)'
              }}
            >
              aalbertzhang@gmail.com
            </motion.a>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t mt-20 pt-10 text-center"
          style={{ borderColor: 'rgba(139, 69, 19, 0.15)' }}
        >
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} Albert Zhang.</span>
            <span>Crafted with</span>
            <Heart size={16} className="text-red-400 mx-1" />
            <span>and sustainable code</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
} 