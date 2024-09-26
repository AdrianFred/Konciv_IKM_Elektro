// components/Sidebar.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaUser, FaCog, FaBars } from "react-icons/fa";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const sidebarVariants = {
  hidden: { width: "4rem" },
  visible: { width: "16rem" },
};

const menuItems = [
  { name: "Home", icon: FaHome, href: "/" },
  { name: "Profile", icon: FaUser, href: "/profile" },
  { name: "Settings", icon: FaCog, href: "/settings" },
];

export default function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed top-0 left-0 h-full bg-gray-800 shadow-lg z-20" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <motion.div
        className="flex flex-col h-full text-white"
        variants={sidebarVariants}
        initial="hidden"
        animate={isHovered ? "visible" : "hidden"}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-center py-4">
          <FaBars className="h-8 w-8 text-white" />
        </div>
        <nav className="flex flex-col space-y-2 mt-4">
          {menuItems.map((item) => (
            <a key={item.name} href={item.href} className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md">
              <item.icon className="h-6 w-6" />
              <AnimatePresence>
                {isHovered && (
                  <motion.span className="ml-4 text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </a>
          ))}
        </nav>
      </motion.div>
    </div>
  );
}
