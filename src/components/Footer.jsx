import React from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Code2, Lock } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = (e) => {
    e?.preventDefault?.();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative border-t border-slate-200/80 bg-white/65 backdrop-blur-xl mt-12 py-10 px-[5%] sm:px-[5%] lg:px-[10%]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand Info */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-[#0284c7] via-[#0d9488] to-[#059669] text-white shadow-md shadow-sky-500/20">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <a
              href="#Home"
              onClick={scrollToTop}
              className="text-lg font-black bg-gradient-to-r from-slate-900 via-sky-900 to-emerald-800 bg-clip-text text-transparent tracking-tight"
            >
              Billy Wicaksono
            </a>
            <p className="text-xs text-slate-500 font-medium">
              Google Student Ambassador & GDGoC Core Team | Software Engineer
            </p>
          </div>
        </div>

        {/* Copyright + Subtle Admin Link */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center text-xs text-slate-500 font-semibold">
          <span>© {currentYear} BilKer. Built with passion & precision</span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-slate-400 hover:text-sky-600 transition-colors"
            title="Admin Dashboard Login"
          >
            <Lock className="w-3 h-3" />
            <span>Admin</span>
          </Link>
        </div>

        {/* Back To Top Button */}
        <button
          onClick={scrollToTop}
          className="p-3 rounded-full glass-card border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-sky-600 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 group"
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
