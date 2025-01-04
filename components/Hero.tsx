"use client"

import { motion } from 'framer-motion'
import { Badge } from "@/components/ui/badge"

const technologies = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "GraphQL",
  "SQL",
  "v0"
]

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 to-blue-400 gradient-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center text-white max-w-4xl px-4 py-20"
      >
        <h1 className="text-7xl font-extralight tracking-wide mb-4">Albert Zhang</h1>
        <h2 className="text-3xl font-extralight tracking-wide mb-8">Software Engineer</h2>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {technologies.map((tech) => (
            <Badge
              key={tech}
              className="bg-blue-600/40 hover:bg-blue-600/50 text-white border-none text-sm px-4 py-1"
            >
              {tech}
            </Badge>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

