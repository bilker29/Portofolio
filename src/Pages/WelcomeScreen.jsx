import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Github, User, CheckCircle2 } from "lucide-react";

const TypewriterEffect = ({ text }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 180);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className="inline-block">
      {displayText}
      <span className="animate-pulse text-sky-600 font-bold ml-0.5">|</span>
    </span>
  );
};

const WelcomeScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(1);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let current = 1;
    const interval = setInterval(() => {
      // Smooth non-linear progress easing
      const remaining = 100 - current;
      const step = Math.max(1, Math.min(remaining, Math.floor(Math.random() * 4) + 1));
      current += step;

      if (current >= 100) {
        current = 100;
        setProgress(100);
        setIsDone(true);
        clearInterval(interval);

        // Brief delay upon reaching 100% for user satisfaction before revealing website
        setTimeout(() => {
          onLoadingComplete?.();
        }, 600);
      } else {
        setProgress(current);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  // Handle skip on click or key press
  const handleSkip = () => {
    setProgress(100);
    setIsDone(true);
    setTimeout(() => {
      onLoadingComplete?.();
    }, 150);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.05,
        filter: "blur(14px)",
        transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
      }}
      onClick={handleSkip}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#e0f2fe] via-[#f0f9ff] to-[#ecfdf5] select-none cursor-pointer overflow-hidden px-4"
    >
      {/* Soft Blue & Mint Ambient Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-sky-300/35 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-200/35 rounded-full blur-3xl animate-blob [animation-delay:4s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-sky-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* 3 Circular Icon Buttons from User's Screenshot (Image 2) */}
        <div className="flex justify-center gap-3 sm:gap-5 mb-5 sm:mb-7">
          {[Code2, User, Github].map((Icon, index) => (
            <div key={index} className="relative group hover:scale-110 transition-transform duration-300">
              <div className="absolute -inset-2 bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-300" />
              <div className="relative p-2.5 sm:p-3.5 bg-white/90 backdrop-blur-md rounded-full border border-sky-200 shadow-md">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-sky-700" />
              </div>
            </div>
          ))}
        </div>

        {/* Welcome Title from User's Screenshot (Image 2) */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            <span className="block text-slate-900 drop-shadow-xs">
              Welcome To My
            </span>
            <span className="block mt-1 bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent filter drop-shadow-xs">
              Portfolio Website
            </span>
          </h1>
        </div>

        {/* HUD CAPSULE LOADER (Soft-Blue Frosted Glass - NOT BLACK) */}
        <div className="relative my-3 sm:my-4 group">
          {/* Ambient Glow Aura in Soft Blue & Mint */}
          <div
            className={`absolute -inset-1 rounded-full bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 blur-md transition-all duration-500 ${
              isDone ? "opacity-100 scale-105" : "opacity-80 animate-capsule-glow"
            }`}
          />

          {/* Left Connection Tip Dot */}
          <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-sky-500 shadow-[0_0_10px_#38bdf8] flex items-center justify-center z-20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>

          {/* Soft-Blue Frosted Glass Capsule Body */}
          <div className="relative flex items-center justify-between gap-6 sm:gap-10 px-6 sm:px-8 py-3.5 sm:py-4 min-w-[290px] sm:min-w-[360px] md:min-w-[400px] bg-white/90 backdrop-blur-2xl rounded-full border-2 border-sky-300/90 shadow-2xl overflow-hidden">
            {/* Interior Progress Bar Fill */}
            <div
              className="absolute left-0 bottom-0 h-1.5 bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 transition-all duration-75 ease-out shadow-[0_0_10px_#0284c7]"
              style={{ width: `${progress}%` }}
            />

            {/* Left Side: LOADING / WELCOME Text */}
            <div className="flex items-center gap-2.5">
              <span className="text-slate-900 text-xs sm:text-sm md:text-base font-black tracking-[0.25em] uppercase font-sans">
                {isDone ? "WELCOME" : "LOADING"}
              </span>
            </div>

            {/* Right Side: Counter + Cursor Block */}
            <div className="flex items-center gap-1.5 font-mono text-slate-800 text-xs sm:text-sm md:text-base font-black tracking-wider">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-700 via-teal-700 to-emerald-700 font-extrabold">
                {progress}%
              </span>
              {/* Cyan cursor block indicator */}
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
              ) : (
                <span className="inline-block w-2.5 h-4 sm:h-4.5 bg-sky-600 shadow-[0_0_8px_#0284c7] animate-pulse" />
              )}
            </div>
          </div>
        </div>

        {/* Typewriter Effect with Author Name (Image 2) */}
        <div className="mt-6 sm:mt-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full relative group hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-200/60 to-emerald-200/60 rounded-full blur-md group-hover:blur-lg transition-all duration-300" />
            <div className="relative flex items-center gap-2 text-base sm:text-xl font-bold bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-sky-200 shadow-sm">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
              <span className="bg-gradient-to-r from-sky-700 via-teal-700 to-emerald-700 bg-clip-text text-transparent font-extrabold">
                <TypewriterEffect text="Billy Wicaksono" />
              </span>
            </div>
          </div>
        </div>

        {/* Skip hint */}
        <div className="pt-5 text-[11px] font-mono text-slate-500 hover:text-sky-700 transition-colors">
          [ Klik di mana saja untuk melewati ]
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeScreen;
