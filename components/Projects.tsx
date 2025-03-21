"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import ytextract from "./yt.png";
import ctc from "./ctc.png";
import Link from "next/link";
import { StaticImageData } from "next/image";

interface Project {
  title: string;
  description: string;
  image: StaticImageData;
  tags: string[];
  link: string;
  github?: string;
}

const projects: Project[] = [
  {
    title: "YT Extract",
    description: "AI-powered platform that automatically summarizes YouTube videos, extracts key insights, and provides searchable transcripts for quick content consumption.",
    image: ytextract,
    tags: ["React", "Next.js", "TypeScript", "AI"],
    link: "https://ytextract.com",
    github: "https://github.com/appsicle/ytextract",
  },
  {
    title: "Commit the Change",
    description:
      "A pro-bono tech consulting firm serving Orange county nonprofits. Built a platform that connects nonprofits with student developers to create impactful technology solutions.",
    image: ctc,
    tags: ["Vue.js", "Express", "PostgreSQL", "Tailwind"],
    link: "https://ctc-uci.com",
    github: "https://github.com/ctc-uci",
  },
];

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <section id="projects" ref={ref} className="relative py-24 bg-background overflow-hidden">
      {/* Background grid with gradient overlay */}
      <div className="absolute inset-0 grid-background opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90" />
      
      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="inline-block text-3xl font-bold gradient-text mb-4">
            Featured Projects
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse move effect for 3D card tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    
    cardRef.current.style.transform = `
      perspective(1000px) 
      rotateY(${x * 8}deg) 
      rotateX(${y * -8}deg)
    `;
  };
  
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.2 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div 
        ref={cardRef}
        className="h-full transition-all duration-300 ease-out"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <Card className="h-full overflow-hidden border border-border/40 bg-secondary/20 backdrop-blur-sm card-hover">
          <CardHeader className="p-0">
            <div className="relative overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                width={600}
                height={400}
                className="w-full h-56 object-cover transition-transform duration-700 ease-out"
                style={{
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          </CardHeader>
          
          <CardContent className="p-6 relative z-10">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold font-space-grotesk mb-2 text-foreground">
                {project.title}
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </CardContent>
          
          <CardFooter className="px-6 pb-6 pt-0 flex gap-3">
            <Button asChild variant="default" size="sm" className="gap-2">
              <Link href={project.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={14} />
                View Project
              </Link>
            </Button>
            
            {project.github && (
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github size={14} />
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
