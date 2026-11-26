import React from "react";
import {
  Network,
  GitBranch,
  Database,
  Cloud,
  Box,
  Cpu,
  Terminal,
  ShieldCheck,
  Blocks,
  BarChart3,
} from "lucide-react";

const CUSTOM_BADGES = {
  cisco: {
    bg: "bg-sky-900/95 border-sky-400/40",
    iconColor: "text-cyan-300",
    labelColor: "text-sky-100",
    tag: "CISCO",
    Icon: Network,
  },
  git: {
    bg: "bg-orange-600/95 border-orange-400/40",
    iconColor: "text-white",
    labelColor: "text-orange-100",
    tag: "GIT",
    Icon: GitBranch,
  },
  supabase: {
    bg: "bg-emerald-950/95 border-emerald-400/40",
    iconColor: "text-emerald-400",
    labelColor: "text-emerald-200",
    tag: "SUPABASE",
    Icon: Database,
  },
  docker: {
    bg: "bg-blue-700/95 border-sky-300/40",
    iconColor: "text-sky-200",
    labelColor: "text-blue-100",
    tag: "DOCKER",
    Icon: Box,
  },
  aws: {
    bg: "bg-slate-900/95 border-amber-400/40",
    iconColor: "text-amber-400",
    labelColor: "text-amber-100",
    tag: "AWS",
    Icon: Cloud,
  },
  solidity: {
    bg: "bg-indigo-950/95 border-indigo-400/40",
    iconColor: "text-indigo-300",
    labelColor: "text-indigo-100",
    tag: "WEB3",
    Icon: Blocks,
  },
  linux: {
    bg: "bg-zinc-900/95 border-yellow-400/40",
    iconColor: "text-yellow-300",
    labelColor: "text-zinc-200",
    tag: "LINUX",
    Icon: Terminal,
  },
  qa: {
    bg: "bg-teal-900/95 border-teal-400/40",
    iconColor: "text-teal-300",
    labelColor: "text-teal-100",
    tag: "QA & UML",
    Icon: ShieldCheck,
  },
  ai: {
    bg: "bg-cyan-950/95 border-cyan-400/40",
    iconColor: "text-cyan-300",
    labelColor: "text-cyan-100",
    tag: "AI & IOT",
    Icon: Cpu,
  },
  tableau: {
    bg: "bg-sky-950/95 border-blue-400/40",
    iconColor: "text-sky-300",
    labelColor: "text-sky-100",
    tag: "DATA VIZ",
    Icon: BarChart3,
  },
};

const TechStackIcon = ({ TechStackIcon, Language, Category, Color }) => {
  const badge = CUSTOM_BADGES[TechStackIcon];

  return (
    <div className="group relative p-5 rounded-2xl glass-card border border-slate-200/90 hover:border-sky-300 transition-all duration-500 ease-out flex flex-col items-center justify-between gap-3 hover:-translate-y-2 hover:rotate-1 cursor-pointer shadow-md hover:shadow-2xl hover:shadow-sky-500/15 overflow-hidden">
      {/* Background Gradient Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${Color || "from-sky-400/15 to-emerald-400/10"
          } opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
      />

      {/* Top Category Badge */}
      {Category && (
        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100/90 group-hover:bg-white text-slate-600 group-hover:text-sky-700 border border-slate-200/80 transition-colors text-center">
          {Category}
        </span>
      )}

      {/* Icon Wrapper */}
      <div className="relative my-1">
        <div className="absolute -inset-2 bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 rounded-full opacity-0 group-hover:opacity-50 blur-md transition duration-500 animate-pulse" />

        {badge ? (
          <div
            className={`w-16 h-16 md:w-18 md:h-18 rounded-2xl ${badge.bg} flex flex-col items-center justify-center p-2 shadow-inner border group-hover:scale-110 transition-transform duration-300`}
          >
            <badge.Icon className={`w-7 h-7 md:w-8 md:h-8 ${badge.iconColor}`} />
            <span className={`text-[8.5px] font-black tracking-widest mt-1 uppercase ${badge.labelColor}`}>
              {badge.tag}
            </span>
          </div>
        ) : (
          <img
            src={`/${TechStackIcon}`}
            alt={`${Language} icon`}
            className="relative h-14 w-14 md:h-16 md:w-16 object-contain group-hover:scale-110 transition-transform duration-300 filter drop-shadow-sm rounded-xl"
            loading="lazy"
          />
        )}
      </div>

      {/* Language Name */}
      <span className="text-slate-800 font-extrabold text-xs md:text-sm tracking-wide group-hover:text-sky-600 transition-colors duration-300 text-center line-clamp-1">
        {Language}
      </span>
    </div>
  );
};

export default TechStackIcon;
