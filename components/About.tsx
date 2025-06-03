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
  { name: "Python", icon: Zap, color: "#8B5CF6" },
  { name: "Node.js", icon: Server, color: "#339933" },
  { name: "GraphQL", icon: Database, color: "#E535AB" },
  { name: "SQL", icon: Database, color: "#336791" },
];

import { Badge } from "@/components/ui/badge";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="about" ref={ref} className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            About Me
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
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
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-border">
                <Image
                  src={profile}
                  alt="Albert Zhang"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 256px, 320px"
                  priority
                />
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Badge variant="secondary" className="absolute -right-4 -top-4 text-sm shadow-none">Software Engineer</Badge>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Badge variant="secondary" className="absolute -left-4 -bottom-4 text-sm shadow-none">Web Developer</Badge>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="bg-card border border-border overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-3 text-foreground">My Background</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  I am a software engineer with experience in modern web technologies. I specialize in building responsive, 
                  performant web applications with a focus on user experience and clean code. My passion lies in creating 
                  innovative solutions that solve real-world problems.
                </p>
                
                <h4 className="text-lg font-semibold mb-3 text-foreground">Technical Skills</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-2">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      className="flex items-center gap-2"
                    >
                      <div className="p-1 bg-secondary rounded-md">
                        <skill.icon 
                          size={18} 
                          className="text-secondary-foreground"
                        />
                      </div>
                      <span className="text-muted-foreground">
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
