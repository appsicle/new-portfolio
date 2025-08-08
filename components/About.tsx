"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import profile from "./profile.jpeg";
import {
  Code,
  Globe,
  Server,
  Database,
  Zap,
  Flower2,
  Play,
} from "lucide-react";

interface Skill {
  name: string;
  icon: React.ElementType;
  color: string;
}

const skills: Skill[] = [
  { name: "Remotion", icon: Play, color: "#61DAFB" },
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
    <section
      id="about"
      ref={ref}
      className="py-24 sm:py-28 lg:py-36 relative overflow-hidden"
    >
      {/* Neon background layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 animate-gradient-xy" style={{
          background:
            "radial-gradient(1200px 800px at 10% -10%, rgba(120,119,198,0.2) 0%, transparent 60%), radial-gradient(1000px 700px at 110% 20%, rgba(56,189,248,0.2) 0%, transparent 55%), radial-gradient(800px 600px at 30% 120%, rgba(34,197,94,0.18) 0%, transparent 60%)"
        }} />
        <div className="absolute inset-0" style={{
          background:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 60px), repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 60px)"
        }} />
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              className="p-3 rounded-full mr-4 leaf-float border border-violet-500/30 bg-violet-500/10"
              initial={{ scale: 0, rotate: -20 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
            >
              <Flower2 size={28} className="text-violet-400" />
            </motion.div>
            <h2
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground"
            >
              About Me
            </h2>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div // Image column
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <div className="relative mx-auto md:ml-auto md:mr-0 w-72 h-72 md:w-96 md:h-96">
              <div
                className="relative w-full h-full rounded-full overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(24,24,27,0.9), rgba(24,24,27,0.6))",
                  border: "3px solid rgba(148,163,184,0.25)",
                  boxShadow:
                    "0 12px 40px rgba(0,0,0,0.35), inset 0 2px 8px rgba(255,255,255,0.04)",
                  padding: "8px",
                }}
              >
                <div className="w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={profile}
                    alt="Albert Zhang"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 288px, 384px"
                    priority
                  />
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Badge
                  variant="secondary"
                  className="absolute -right-6 -top-6 text-sm shadow-lg leaf-float"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(147, 51, 234, 0.95), rgba(20,184,166, 0.95))",
                    color: "white",
                    border: "1px solid rgba(147, 51, 234, 0.3)",
                    boxShadow: "0 4px 12px rgba(20,184,166,0.3)",
                  }}
                >
                  Software Engineer
                </Badge>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Badge
                  variant="secondary"
                  className="absolute -left-6 -bottom-6 text-sm shadow-lg leaf-float"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(56,189,248, 0.95), rgba(147, 51, 234, 0.95))",
                    color: "white",
                    border: "1px solid rgba(56,189,248, 0.3)",
                    boxShadow: "0 4px 12px rgba(147, 51, 234, 0.3)",
                  }}
                >
                  Extreme vibe coder
                </Badge>
              </motion.div>
            </div>
          </motion.div>

          <motion.div // Text card column
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <Card className="nature-card nature-hover overflow-hidden relative">
              {/* Subtle wood texture */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  background: `
                    repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 2px,
                      rgba(139, 69, 19, 0.03) 2px,
                      rgba(139, 69, 19, 0.03) 4px
                    )
                  `,
                }}
              />

              <CardContent className="p-10 md:p-12 relative">
                <h3
                  className="text-2xl font-bold mb-6 text-foreground"
                >
                  Currently
                </h3>
                <p
                  className="text-muted-foreground text-base font-medium leading-relaxed mb-8 md:mb-10"
                >
                  building tools for short form content creation
                  <br />
                  <br />I am interested in video rendering, creator economy, AI
                  agents, and scraping projects.
                </p>

                <h4
                  className="text-xl font-bold mb-6 text-foreground"
                >
                  My Tools
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-4">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      className="flex items-center gap-3 p-3 rounded-lg nature-hover leaf-float border border-violet-500/20 bg-violet-500/5"
                    >
                      <div
                        className="p-2 rounded-md border border-violet-500/30 bg-violet-500/10"
                      >
                        <skill.icon size={20} className="text-violet-300" />
                      </div>
                      <span
                        className="text-muted-foreground text-sm font-medium"
                      >
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
