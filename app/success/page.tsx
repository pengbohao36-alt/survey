"use client";

import Link from "next/link";
import { CheckCircle, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function SuccessPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
        className="glass-panel p-10 md:p-14 max-w-xl mx-auto flex flex-col items-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
          className="mb-8"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.5)]">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </motion.div>
        
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-white">
          Thank You!
        </h1>
        
        <p className="text-lg text-white/80 mb-10 leading-relaxed">
          Your response has been recorded. We appreciate your time and valuable feedback.
        </p>

        <Link
          href="/"
          className="glass-button text-white"
        >
          <Home className="w-5 h-5 mr-2" /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
