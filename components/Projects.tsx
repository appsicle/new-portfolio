"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, TreePine } from "lucide-react";
import ytextract from "./yt.png";
import ctc from "./ctc.png";
import Link from "next/link";
import { StaticImageData } from "next/image";

interface Project {
  title: string;
  description: string;
  image: StaticImageData;
  tags?: string[];
  link: string;
  github?: string;
}

const projects: Project[] = [
  {
    title: "YT Extract",
    description:
      "Ok, I built this before Gemini could one shot video analysis for free. It's a simple app that allows you to analyze a YouTube video based on the transcript.",
    image: ytextract,
    tags: ["React", "Next.js", "TypeScript", "AI"],
    link: "https://ytextract.com",
    github: "https://github.com/appsicle/ytextract",
  },
  {
    title: "Commit the Change",
    description:
      "Worked with a group of college friends to start a club during Covid. We built apps for nonprofits in Orange County. This gave life meaning during the pandemic.",
    image: ctc,
    link: "https://ctc-uci.com",
    github: "https://github.com/ctc-uci",
  },
];

import { Badge } from "@/components/ui/badge";
// ... (other imports)

export default function Projects() {
  const ref = useRef(null);

  return (
    <section
      id="projects"
      ref={ref}
      className="py-20 sm:py-24 lg:py-32 relative overflow-hidden"
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
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-10 left-10 w-3 h-3 rounded-full opacity-30 leaf-float"
          style={{ backgroundColor: "#8BC34A" }}
        />
        <div
          className="absolute top-32 right-20 w-2 h-2 rounded-full opacity-40 leaf-float"
          style={{ backgroundColor: "#4CAF50" }}
        />
        <div
          className="absolute bottom-20 left-1/4 w-4 h-4 rounded-full opacity-25 leaf-float"
          style={{ backgroundColor: "#81C784" }}
        />
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="flex items-center justify-center mb-6 pb-4">
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
              <TreePine size={28} className="text-green-600" />
            </motion.div>
            <h2
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground pb-2"
              style={{
                textShadow: "0 2px 4px rgba(139, 69, 19, 0.1)",
                background:
                  "linear-gradient(135deg, #2E7D32, #4CAF50, #8BC34A)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Featured Projects
            </h2>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-16">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.2 }}
      viewport={{ once: true, amount: 0.3 }}
      className="h-full"
    >
      <div className="h-full">
        <Card
          className="h-full overflow-hidden nature-hover group relative"
          style={{
            background: `
              linear-gradient(135deg, rgba(255, 248, 225, 0.95), rgba(245, 245, 220, 0.9)),
              radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 70%)
            `,
            border: "1.5px solid rgba(139, 69, 19, 0.15)",
            boxShadow: `
              0 8px 32px rgba(139, 69, 19, 0.1),
              inset 0 1px 3px rgba(255, 255, 255, 0.3),
              0 4px 12px rgba(76, 175, 80, 0.05)
            `,
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Wood grain texture overlay */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: `
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 1px,
                  rgba(139, 69, 19, 0.02) 1px,
                  rgba(139, 69, 19, 0.02) 2px
                ),
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 8px,
                  rgba(139, 69, 19, 0.01) 8px,
                  rgba(139, 69, 19, 0.01) 9px
                )
              `,
            }}
          />

          <CardHeader className="p-0 relative overflow-hidden">
            <div className="relative overflow-hidden rounded-t-lg">
              <Image
                src={project.image}
                alt={project.title}
                width={600}
                height={400}
                className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Nature overlay on image */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(45deg, rgba(76, 175, 80, 0.3), rgba(139, 69, 19, 0.2))",
                }}
              />
            </div>
          </CardHeader>

          <CardContent className="p-8 md:p-10 relative">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3
                className="text-2xl md:text-3xl font-bold text-foreground mb-4"
                style={{
                  textShadow: "0 1px 2px rgba(139, 69, 19, 0.1)",
                }}
              >
                {project.title}
              </h3>
              <p
                className="text-muted-foreground text-base leading-relaxed mb-6"
                style={{ textShadow: "0 1px 1px rgba(139, 69, 19, 0.05)" }}
              >
                {project.description}
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {project.tags?.map((tag: string) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-sm px-3 py-1 leaf-float"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(139, 69, 19, 0.05))",
                      borderColor: "rgba(76, 175, 80, 0.3)",
                      color: "#2E7D32",
                      textShadow: "0 1px 1px rgba(139, 69, 19, 0.05)",
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </CardContent>

          <CardFooter className="px-8 md:px-10 pb-8 md:pb-10 pt-0 flex gap-4">
            <Button
              asChild
              variant="default"
              size="default"
              className="gap-2 wood-button text-white font-medium flex-1"
              style={{
                background:
                  "linear-gradient(135deg, rgba(76, 175, 80, 0.9), rgba(46, 125, 50, 1))",
                border: "1px solid rgba(46, 125, 50, 0.3)",
                boxShadow:
                  "0 4px 12px rgba(76, 175, 80, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)",
              }}
            >
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={16} />
                View Project
              </Link>
            </Button>

            {project.github && (
              <Button
                asChild
                variant="outline"
                size="default"
                className="gap-2 nature-hover"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 248, 225, 0.9), rgba(245, 245, 220, 0.7))",
                  borderColor: "rgba(139, 69, 19, 0.3)",
                  color: "#5D4037",
                  boxShadow:
                    "0 2px 8px rgba(139, 69, 19, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.3)",
                }}
              >
                <Link
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={16} />
                  Code
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
}
