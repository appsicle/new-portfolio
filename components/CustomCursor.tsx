"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    const mouseDown = () => setCursorVariant("click");
    const mouseUp = () => setCursorVariant("default");
    const mouseEnterLink = () => setCursorVariant("hover");
    const mouseLeaveLink = () => setCursorVariant("default");

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);

    // Add hover effect to all links and buttons
    const links = document.querySelectorAll("a, button");
    links.forEach((link) => {
      link.addEventListener("mouseenter", mouseEnterLink);
      link.addEventListener("mouseleave", mouseLeaveLink);
      link.classList.add("hoverable");
    });

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
      
      links.forEach((link) => {
        link.removeEventListener("mouseenter", mouseEnterLink);
        link.removeEventListener("mouseleave", mouseLeaveLink);
      });
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      backgroundColor: "#8b5cf6",
    },
    hover: {
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      height: 30,
      width: 30,
      backgroundColor: "#ec4899",
    },
    click: {
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      height: 15,
      width: 15,
      backgroundColor: "#3b82f6",
    },
  };

  const followerVariants = {
    default: {
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
    },
    hover: {
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
      height: 60,
      width: 60,
      opacity: 0.5,
    },
  };

  return (
    <>
      <motion.div
        className="custom-cursor"
        variants={variants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      />
      <motion.div
        className="custom-cursor-follower"
        variants={followerVariants}
        animate={cursorVariant === "hover" ? "hover" : "default"}
        transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.8 }}
      />
    </>
  );
} 