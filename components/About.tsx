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
      {/* Background gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-green-50 to-blue-50 opacity-70 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.08) 0%, transparent 60%),
            radial-gradient(circle at 80% 70%, rgba(74, 144, 226, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(76, 175, 80, 0.08) 0%, transparent 70%),
            radial-gradient(circle at 10% 80%, rgba(255, 193, 7, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 90% 20%, rgba(139, 69, 19, 0.06) 0%, transparent 50%)
          `,
        }}
      />
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 15% 25%, rgba(139, 69, 19, 0.02) 1px, transparent 1px),
            radial-gradient(circle at 85% 75%, rgba(76, 175, 80, 0.02) 1px, transparent 1px),
            radial-gradient(circle at 45% 60%, rgba(74, 144, 226, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px, 80px 80px, 100px 100px",
        }}
      />
      {/* Nature decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-20 right-16 w-6 h-6 rounded-full opacity-20 leaf-float"
          style={{ backgroundColor: "#4CAF50" }}
        />
        <div
          className="absolute bottom-32 left-12 w-4 h-4 rounded-full opacity-25 leaf-float"
          style={{ backgroundColor: "#8BC34A" }}
        />
        <div
          className="absolute top-1/2 left-20 w-3 h-3 rounded-full opacity-30 leaf-float"
          style={{ backgroundColor: "#81C784" }}
        />
        <div
          className="absolute bottom-16 right-1/3 w-5 h-5 rounded-full opacity-15 leaf-float"
          style={{ backgroundColor: "#A5D6A7" }}
        />
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
              className="p-3 rounded-full mr-4 leaf-float"
              style={{
                background:
                  "linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(139, 69, 19, 0.1))",
                border: "1.5px solid rgba(76, 175, 80, 0.3)",
              }}
              initial={{ scale: 0, rotate: -20 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
            >
              <Flower2 size={28} className="text-green-600" />
            </motion.div>
            <h2
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground"
              style={{
                textShadow: "0 2px 4px rgba(139, 69, 19, 0.1)",
                background:
                  "linear-gradient(135deg, #2E7D32, #4CAF50, #8BC34A)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
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
              {/* Organic border with nature elements */}
              <div
                className="relative w-full h-full rounded-full overflow-hidden"
                style={{
                  background: `
                    linear-gradient(135deg, rgba(255, 248, 225, 0.9), rgba(245, 245, 220, 0.7)),
                    radial-gradient(circle at 30% 30%, rgba(76, 175, 80, 0.1) 0%, transparent 70%)
                  `,
                  border: "3px solid rgba(139, 69, 19, 0.2)",
                  boxShadow: `
                    0 12px 40px rgba(139, 69, 19, 0.15),
                    inset 0 2px 8px rgba(255, 255, 255, 0.3),
                    0 8px 24px rgba(76, 175, 80, 0.1)
                  `,
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
                      "linear-gradient(135deg, rgba(76, 175, 80, 0.9), rgba(46, 125, 50, 0.8))",
                    color: "white",
                    border: "1px solid rgba(46, 125, 50, 0.3)",
                    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
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
                      "linear-gradient(135deg, rgba(139, 69, 19, 0.8), rgba(101, 67, 33, 0.9))",
                    color: "white",
                    border: "1px solid rgba(139, 69, 19, 0.3)",
                    boxShadow: "0 4px 12px rgba(139, 69, 19, 0.3)",
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
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
            <Card
              className="nature-card nature-hover overflow-hidden relative"
              style={{
                background: `
                  linear-gradient(135deg, rgba(255, 248, 225, 0.95), rgba(245, 245, 220, 0.9)),
                  radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.3) 0%, transparent 70%)
                `,
                border: "1.5px solid rgba(139, 69, 19, 0.15)",
                boxShadow: `
                  0 12px 40px rgba(139, 69, 19, 0.12),
                  inset 0 2px 8px rgba(255, 255, 255, 0.3),
                  0 8px 24px rgba(76, 175, 80, 0.08)
                `,
                backdropFilter: "blur(12px)",
              }}
            >
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
                  style={{
                    textShadow: "0 1px 2px rgba(139, 69, 19, 0.1)",
                    color: "#2E7D32",
                  }}
                >
                  Currently
                </h3>
                <p
                  className="text-muted-foreground text-base font-medium leading-relaxed mb-8 md:mb-10"
                  style={{ textShadow: "0 1px 1px rgba(139, 69, 19, 0.05)" }}
                >
                  building tools for short form content creation
                  <br />
                  <br />I am interested in video rendering, creator economy, AI
                  agents, and scraping projects.
                </p>

                <h4
                  className="text-xl font-bold mb-6 text-foreground"
                  style={{
                    textShadow: "0 1px 2px rgba(139, 69, 19, 0.1)",
                    color: "#2E7D32",
                  }}
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
                      className="flex items-center gap-3 p-3 rounded-lg nature-hover leaf-float"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(76, 175, 80, 0.08), rgba(139, 69, 19, 0.04))",
                        border: "1px solid rgba(76, 175, 80, 0.15)",
                      }}
                    >
                      <div
                        className="p-2 rounded-md"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(139, 69, 19, 0.08))",
                          border: "1px solid rgba(76, 175, 80, 0.2)",
                        }}
                      >
                        <skill.icon size={20} className="text-green-700" />
                      </div>
                      <span
                        className="text-muted-foreground text-sm font-medium"
                        style={{
                          color: "#2E7D32",
                          textShadow: "0 1px 1px rgba(139, 69, 19, 0.05)",
                        }}
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
