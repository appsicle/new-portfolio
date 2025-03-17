"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import profile from "./profile.jpeg";
import { Code, Globe, Server, Database, Zap } from "lucide-react";

interface Skill {
  name: string;
  icon: React.ElementType;
  color: string;
}

const skills: Skill[] = [
  { name: "React", icon: Code, color: "#61DAFB" },
  { name: "Next.js", icon: Globe, color: "#ffffff" },
  { name: "TypeScript", icon: Code, color: "#3178C6" },
  { name: "Node.js", icon: Server, color: "#339933" },
  { name: "GraphQL", icon: Database, color: "#E535AB" },
  { name: "SQL", icon: Database, color: "#336791" },
  { name: "v0", icon: Zap, color: "#8B5CF6" },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="about" ref={ref} className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 grid-background opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/90" />
      
      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="inline-block text-3xl font-bold gradient-text mb-4">
            About Me
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Software engineer passionate about building innovative web applications and exploring new technologies.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative mx-auto md:ml-auto md:mr-0 w-64 h-64 md:w-80 md:h-80">
              {/* Decorative elements */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/20 to-primary/5 blur-xl animate-pulse" />
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/30 to-primary/10 blur-md" />
              
              {/* Profile image with mask */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-primary/20 glow-border">
                <Image
                  src={profile}
                  alt="Albert Zhang"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 256px, 320px"
                  priority
                />
              </div>
              
              {/* Floating badges */}
              <motion.div
                className="absolute -right-4 -top-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50 text-sm font-medium shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <span className="text-primary">Software Engineer</span>
              </motion.div>
              
              <motion.div
                className="absolute -left-4 -bottom-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50 text-sm font-medium shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <span className="text-primary">Web Developer</span>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="bg-secondary/10 backdrop-blur-sm border border-border/40 overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold font-space-grotesk mb-4">My Background</h3>
                <p className="text-foreground/80 mb-6 leading-relaxed">
                  I am a software engineer with experience in modern web technologies. I specialize in building responsive, 
                  performant web applications with a focus on user experience and clean code. My passion lies in creating 
                  innovative solutions that solve real-world problems.
                </p>
                
                <h4 className="text-lg font-semibold mb-4 font-space-grotesk">Technical Skills</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-2">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      className="flex items-center gap-2 group"
                    >
                      <div 
                        className="p-2 rounded-md transition-colors duration-300"
                        style={{ backgroundColor: `${skill.color}20` }}
                      >
                        <skill.icon 
                          size={18} 
                          style={{ color: skill.color }} 
                          className="transition-transform duration-300 group-hover:scale-110" 
                        />
                      </div>
                      <span className="text-foreground/80 group-hover:text-foreground transition-colors duration-300">
                        {skill.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
