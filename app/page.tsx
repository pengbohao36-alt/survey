"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-panel p-10 md:p-14 max-w-2xl mx-auto flex flex-col items-center"
      >
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="mb-8 p-4 bg-white/10 rounded-full"
        >
          <Sparkles className="w-12 h-12 text-fuchsia-300" />
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">
          環保意識<span className="text-gradient">問卷調查</span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed max-w-xl">
          感謝您撥空填寫這一份問卷，本問卷目的是在探討您的環保知多少。問卷採匿名的方式，而且您在問卷中所提供的資訊，僅作為學術研究之用，不會提供其他單位，敬請安心填寫。
          <br /><br />
          您的意見對我們非常重要，衷心期盼您依自己的實際感受填答。感謝您的熱情支持與協助！敬祝　平安快樂，萬事如意！
        </p>

        <Link
          href="/survey"
          className="glass-button text-white text-lg bg-gradient-to-r from-fuchsia-600 to-cyan-600 border-transparent hover:shadow-[0_0_20px_rgba(232,121,249,0.5)]"
        >
          Start Survey <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </div>
  );
}
