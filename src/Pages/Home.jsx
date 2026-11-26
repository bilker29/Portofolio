import React, { useState, useEffect, useCallback, memo } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Instagram,
  Sparkles,
  PlayCircle,
  Code2,
  Terminal,
  ShieldCheck,
  Award,
  ChevronDown,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import IdCard from "../components/IdCard";

const StatusBadge = memo(() => (
  <div
    className="inline-block animate-float-slow"
    data-aos="zoom-in"
    data-aos-delay="250"
  >
    <div className="relative group cursor-pointer">
      <div className="absolute -inset-1 bg-gradient-to-r from-[#0284c7] via-[#0d9488] to-[#059669] rounded-full blur-md opacity-45 group-hover:opacity-90 transition duration-700 animate-pulse" />
      <div className="relative px-4 py-2 rounded-full bg-white/90 backdrop-blur-xl border border-emerald-300 shadow-md flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-600 animate-spin-slow" />
        <span className="bg-gradient-to-r from-[#0284c7] via-[#0d9488] to-[#059669] text-transparent bg-clip-text sm:text-sm text-xs font-extrabold tracking-wide">
          GSA & GDGoC Core Team | GPA 3.76
        </span>
      </div>
    </div>
  </div>
));

const MainTitle = memo(() => (
  <div className="space-y-3" data-aos="fade-up" data-aos-delay="350">
    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[1.08]">
      <span className="relative inline-block text-slate-900">
        Billy
      </span>
      <br />
      <span className="relative inline-block mt-1 bg-gradient-to-r from-[#0284c7] via-[#0d9488] to-[#059669] bg-clip-text text-transparent filter drop-shadow-sm">
        Wicaksono
      </span>
    </h1>
  </div>
));

const TYPING_SPEED = 85;
const ERASING_SPEED = 45;
const PAUSE_DURATION = 2200;
const WORDS = [
  "Informatics Engineering Student",
  "Junior Software Engineer",
  "IT Infrastructure & Cloud Enthusiast",
  "Google Student Ambassador 2026",
];

// Isolated typewriter state so typing animation never causes 3D IdCard re-renders
const RoleTypewriter = memo(() => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText((prev) => prev + WORDS[wordIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      } else {
        setWordIndex((prev) => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    );
    return () => clearTimeout(timeout);
  }, [handleTyping, isTyping]);

  return (
    <div
      className="h-10 flex items-center"
      data-aos="fade-up"
      data-aos-delay="450"
    >
      <span className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
        {text}
      </span>
      <span className="w-1 h-7 bg-[#0284c7] ml-1.5 animate-pulse rounded-full" />
    </div>
  );
});

const TechStackPill = memo(({ tech }) => (
  <div className="px-3.5 py-1.5 rounded-xl bg-white/85 backdrop-blur-md border border-slate-200/90 text-xs sm:text-sm font-semibold text-slate-700 hover:text-sky-700 hover:bg-white hover:border-sky-400 shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md cursor-default">
    {tech}
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon, primary = false }) => (
  <a href={href} className="w-[160px] block">
    <button className="group relative w-full overflow-hidden rounded-xl p-[2px] transition-all duration-300 active:scale-95">
      <div
        className={`absolute inset-0 bg-gradient-to-r ${
          primary
            ? "from-[#0284c7] via-[#0d9488] to-[#059669]"
            : "from-slate-300 via-sky-300 to-emerald-300"
        } rounded-xl opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105`}
      />
      <div
        className={`relative flex items-center justify-center gap-2 h-11 px-5 rounded-[10px] text-sm font-extrabold transition-all duration-300 overflow-hidden ${
          primary
            ? "bg-gradient-to-r from-[#0284c7] via-[#0d9488] to-[#059669] text-white shadow-md shadow-sky-500/20 group-hover:shadow-sky-500/40"
            : "bg-white/95 backdrop-blur-xl text-slate-800 hover:bg-white"
        }`}
      >
        {primary && (
          <span className="absolute inset-0 w-1/2 bg-white/20 blur-sm animate-shine pointer-events-none" />
        )}
        <span className="relative z-10">{text}</span>
        <Icon
          className={`w-4 h-4 transition-transform duration-300 z-10 ${
            text === "Contact" ? "group-hover:translate-x-1" : "group-hover:rotate-45"
          }`}
        />
      </div>
    </button>
  </a>
));

const SocialLink = memo(({ icon: Icon, link, label }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="group relative p-2.5 rounded-xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-sm hover:border-sky-400 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-[#0284c7] to-[#059669] rounded-xl opacity-0 group-hover:opacity-10 transition-opacity" />
    <Icon className="w-5 h-5 text-slate-600 group-hover:text-sky-600 transition-colors" />
  </a>
));

const FloatingBadge = memo(({ icon: Icon, label, positionClass, delayClass }) => (
  <div
    className={`absolute z-20 hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/90 backdrop-blur-xl border border-sky-200/80 shadow-lg shadow-sky-500/10 hover:scale-110 transition-all duration-300 pointer-events-auto ${positionClass} ${delayClass}`}
  >
    <div className="p-1.5 rounded-xl bg-sky-50 text-sky-600">
      <Icon className="w-4 h-4" />
    </div>
    <span className="text-xs font-bold text-slate-800 whitespace-nowrap">
      {label}
    </span>
  </div>
));

const TECH_STACK = [
  "Java (OOP)",
  "PHP & SQL",
  "JavaScript",
  "Solidity & Hardhat",
  "Bootstrap & CSS3",
  "Docker & AWS",
  "Cisco Packet Tracer",
  "QA Testing & UML",
  "Git & Linux",
];

const SOCIAL_LINKS = [
  {
    icon: Github,
    link: "https://github.com/bilker29",
    label: "GitHub Profile",
  },
  {
    icon: Linkedin,
    link: "https://www.linkedin.com/in/billy-wicaksono-315898372",
    label: "LinkedIn Profile",
  },
  {
    icon: Instagram,
    link: "https://www.instagram.com/billy.w.2005?igsh=NmJsaGJpenZrYm05&utm_source=qr",
    label: "Instagram Profile",
  },
  {
    icon: PlayCircle,
    link: "https://www.tiktok.com/@gemers2905?_r=1&_t=ZS-94DfruR8pPA",
    label: "TikTok Profile",
  },
];

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: false,
        offset: 10,
      });
    };

    initAOS();
    window.addEventListener("resize", initAOS);
    return () => window.removeEventListener("resize", initAOS);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  return (
    <>
      <Helmet>
        <title>Billy Wicaksono — Software Engineer & IT Infrastructure</title>
        <meta
          name="description"
          content="Official Portfolio of Billy Wicaksono — Informatics Engineering Student at Universitas Pasundan (GPA 3.76/4.00), BNSP-certified Computer and Network Technician, Google Student Ambassador & GDGoC Core Team."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://billy-wicaksono-website-portofolio.vercel.app/" />
        <meta property="og:title" content="Billy Wicaksono — Software Engineer & IT Infrastructure" />
        <meta
          property="og:description"
          content="Informatics Engineering Undergraduate (GPA 3.76/4.00) | Full-Stack Web, Web3/Blockchain, Cloud AWS & Cisco Infrastructure."
        />
        <meta property="og:url" content="https://billy-wicaksono-website-portofolio.vercel.app/" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Billy Wicaksono",
            "jobTitle": "Informatics Engineering Student & Software Engineer",
            "url": "https://billy-wicaksono-website-portofolio.vercel.app/",
            "email": "billywicaksono.999@gmail.com",
            "sameAs": [
              "https://github.com/bilker29",
              "https://www.linkedin.com/in/billy-wicaksono-315898372",
              "https://www.instagram.com/billy.w.2005?igsh=NmJsaGJpenZrYm05&utm_source=qr",
              "https://www.tiktok.com/@gemers2905?_r=1&_t=ZS-94DfruR8pPA"
            ]
          }
        `}</script>
      </Helmet>

      <div
        className="min-h-screen relative overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] pt-24 sm:pt-28 pb-10 flex flex-col justify-between"
        id="Home"
      >
        <div
          className={`relative z-10 transition-all duration-1000 my-auto ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between min-h-[calc(100vh-160px)] gap-12 lg:gap-12">
              {/* Left Column */}
              <div
                className="w-full lg:w-1/2 space-y-6 text-left order-1"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <div className="space-y-5">
                  <StatusBadge />
                  <MainTitle />
                  <RoleTypewriter />

                  {/* Description */}
                  <p
                    className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal"
                    data-aos="fade-up"
                    data-aos-delay="550"
                  >
                    Detail-oriented Informatics Engineering undergraduate at Universitas Pasundan (GPA 3.76/4.00, KIP-Kuliah Scholar) and BNSP-certified Computer & Network Technician with practical experience in full-stack web development, software QA, cloud & network infrastructure, as well as mentoring peers as a Lab & Teaching Assistant, Google Student Ambassador, and GDGoC Core Team member.
                  </p>

                  {/* Tech Stack Pills */}
                  <div
                    className="flex flex-wrap gap-2 sm:gap-2.5 justify-start pt-1"
                    data-aos="fade-up"
                    data-aos-delay="650"
                  >
                    {TECH_STACK.map((tech, index) => (
                      <TechStackPill key={index} tech={tech} />
                    ))}
                  </div>

                  {/* CTA Buttons & Social Links */}
                  <div
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3"
                    data-aos="fade-up"
                    data-aos-delay="750"
                  >
                    <div className="flex gap-3">
                      <CTAButton
                        href="#Portofolio"
                        text="Projects"
                        icon={ExternalLink}
                        primary={true}
                      />
                      <CTAButton
                        href="#Contact"
                        text="Contact"
                        icon={Mail}
                        primary={false}
                      />
                    </div>

                    <div className="flex gap-2 items-center sm:pl-3 sm:border-l sm:border-slate-200">
                      {SOCIAL_LINKS.map((social, index) => (
                        <SocialLink key={index} {...social} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Interactive Transparent 3D Hanging ID Card */}
              <div
                className="w-full lg:w-1/2 relative flex items-center justify-center order-2 py-4 lg:py-0"
                data-aos="fade-left"
                data-aos-delay="250"
              >
                <FloatingBadge
                  icon={Code2}
                  label="Full-Stack & Web3"
                  positionClass="top-6 -left-2 xl:left-0 pointer-events-none"
                  delayClass="animate-float-slow"
                />
                <FloatingBadge
                  icon={ShieldCheck}
                  label="BNSP & Dicoding"
                  positionClass="top-24 -right-2 xl:right-0 pointer-events-none"
                  delayClass="animate-float-reverse"
                />
                <FloatingBadge
                  icon={Terminal}
                  label="AWS, Docker & Cisco"
                  positionClass="bottom-32 -left-2 xl:left-0 pointer-events-none"
                  delayClass="animate-float-slow"
                />
                <FloatingBadge
                  icon={Award}
                  label="GDGoC & GSA 2026"
                  positionClass="bottom-28 -right-2 xl:right-0 pointer-events-none"
                  delayClass="animate-float-reverse"
                />

                {/* Soft Ambient Halo Behind Transparent 3D Card */}
                <div className="absolute inset-8 bg-gradient-to-tr from-sky-400/20 via-teal-400/20 to-emerald-400/20 rounded-full blur-3xl opacity-60 pointer-events-none" />

                <div className="relative z-10 w-full flex items-center justify-center">
                  <IdCard />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Micro-Indicator */}
        <motion.a
          href="#About"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:flex mx-auto items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/75 backdrop-blur-md border border-sky-200/80 text-xs font-bold text-slate-500 hover:text-sky-600 shadow-sm transition-colors"
        >
          <span>Scroll Down</span>
          <ChevronDown className="w-3.5 h-3.5 text-sky-600" />
        </motion.a>
      </div>
    </>
  );
};

export default memo(Home);
