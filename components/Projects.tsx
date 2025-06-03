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
  tags?: string[];
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
    link: "https://ctc-uci.com",
    github: "https://github.com/ctc-uci",
  },
];

import { Badge } from "@/components/ui/badge";
// ... (other imports)

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <section id="projects" ref={ref} className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl font-bold text-foreground">
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.2 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="h-full">
        <Card className="h-full overflow-hidden bg-card border border-border card-hover">
          <CardHeader className="p-0">
            <div className="relative overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                width={600}
                height={400}
                className="w-full h-56 object-cover"
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {project.title}
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5">{tag}</Badge>
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
