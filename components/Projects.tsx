"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ytextract from "./yt-extract.png";
import ctc from "./ctc.png";
import Link from "next/link";

const projects = [
  {
    title: "YT Extract",
    description: "AI summarize Youtube videos",
    image: ytextract,
    tags: ["React", "Next.js", "Typescript"],
    link: "https://ytextract.com",
  },
  {
    title: "Commit the Change",
    description:
      "A pro-bono tech consulting firm serving Orange county nonprofits",
    image: ctc,
    tags: ["Vue.js", "Express", "PostgreSQL"],
    link: "https://ctc-uci.com",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 bg-muted">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center">
          Projects
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="mb-2">{project.title}</CardTitle>
                  <p className="text-muted-foreground mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-primary/10 text-primary text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={project.link}>View Details</Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
