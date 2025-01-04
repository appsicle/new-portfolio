"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import profile from "./profile.jpeg";

const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "GraphQL",
  "SQL",
  "v0",
];

export default function About() {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between	"
        >
          <Image
            src={profile}
            alt="Your Name"
            width={400}
            height={400}
            className="rounded-full shadow-lg"
          />
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-primary mb-4">About Me</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-foreground mb-6">
                  I am a software engineer with experience in web technologies
                </p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <motion.span
                      key={skill}
                      className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
