import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabase";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import Certificate from "../components/Certificate";
import { Code, Award, Boxes, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="px-5 py-2.5 bg-white/90 hover:bg-white text-slate-800 hover:text-sky-700 text-sm font-extrabold rounded-xl border border-slate-200 hover:border-sky-300 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 group active:scale-95"
  >
    <span>{isShowingMore ? "See Less" : "See More"}</span>
    {isShowingMore ? (
      <ChevronUp className="w-4 h-4 text-sky-600 transition-transform group-hover:-translate-y-0.5" />
    ) : (
      <ChevronDown className="w-4 h-4 text-sky-600 transition-transform group-hover:translate-y-0.5" />
    )}
  </button>
);

const FALLBACK_PROJECTS = [
  {
    id: 1,
    Title: "VERIDEX — AI & Blockchain Credentialing",
    Description:
      "Platform sertifikat digital anti-pemalsuan untuk Monad Blitz Hackathon menggunakan Next.js, Gemini 1.5 Flash API, Solidity (Monad Testnet), serta verifikasi Merkle Tree & SHA-256.",
    Img: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop",
    TechStack: ["Solidity", "Monad Testnet", "Next.js", "Gemini AI", "SHA-256"],
    Features: ["Batch Issuance Merkle Tree", "Client-Side SHA-256 Verification", "AI Data Extraction"],
    Link: "https://github.com/bilker29",
    Github: "https://github.com/bilker29",
  },
  {
    id: 2,
    Title: "PUSTANI — Agricultural Library & Cloud",
    Description:
      "Sistem informasi perpustakaan agrikultur berbasis microservices yang di-deploy ke AWS dengan Docker, Nginx API Gateway, Java, PHP, MySQL, serta GitHub Actions CI/CD.",
    Img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop",
    TechStack: ["AWS", "Docker", "Nginx", "Java", "PHP", "MySQL"],
    Features: ["Microservices Architecture", "Automated CI/CD Pipeline", "Hardened DB Security"],
    Link: "https://github.com/bilker29",
    Github: "https://github.com/bilker29",
  },
  {
    id: 3,
    Title: "Otty Sobat Siaga Banjir — 2D Game",
    Description:
      "Game edukasi kesiapsiagaan bencana 2D interaktif untuk anak usia 6–12 tahun dengan fitur kuis interaktif dan simulasi penyusunan tas siaga bencana banjir.",
    Img: "https://images.unsplash.com/photo-1556438064-2d7646166914?q=80&w=800&auto=format&fit=crop",
    TechStack: ["Game Design", "Interactive 2D", "UI/UX", "Education"],
    Features: ["Interactive Disaster Quiz", "Emergency Kit Sorting Simulation", "Child-Friendly UI"],
    Link: "https://github.com/bilker29",
    Github: "https://github.com/bilker29",
  },
  {
    id: 4,
    Title: "Enterprise Network — Sentani Airport",
    Description:
      "Simulasi topologi jaringan kompleks multi-departemen Bandara Sentani menggunakan Cisco Packet Tracer dengan VLAN, inter-VLAN routing, DHCP, dan OSPF.",
    Img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop",
    TechStack: ["Cisco Packet Tracer", "VLAN", "OSPF", "DHCP"],
    Features: ["Multi-Department Segmentation", "Dynamic Routing OSPF", "High Availability Topology"],
    Link: "https://github.com/bilker29",
    Github: "https://github.com/bilker29",
  },
  {
    id: 5,
    Title: "E-Commerce Sales & Database System",
    Description:
      "Perancangan skema basis data relasional ternormalisasi menggunakan SQL untuk mencatat transaksi ritel online, inventaris, riwayat pesanan, dan stored procedures.",
    Img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    TechStack: ["SQL", "MySQL", "Database Design", "Stored Procedures"],
    Features: ["Normalized Relational Schema", "Inventory Tracking", "Integrity Constraints"],
    Link: "https://github.com/bilker29",
    Github: "https://github.com/bilker29",
  },
  {
    id: 6,
    Title: "University Library Management System",
    Description:
      "Platform web sirkulasi perpustakaan kampus full-stack menggunakan PHP, Bootstrap, dan MySQL dengan operasi CRUD lengkap untuk katalog buku dan peminjaman real-time.",
    Img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop",
    TechStack: ["PHP", "Bootstrap", "MySQL", "HTML5", "CSS3"],
    Features: ["Full CRUD Operations", "Book Cataloging & Members", "Real-Time Borrowing Workflow"],
    Link: "https://billy-wicaksono-website-portofolio.vercel.app/",
    Github: "https://github.com/bilker29",
  },
];

const FALLBACK_CERTIFICATES = [
  {
    id: 1,
    Title: "Sertifikasi Kompetensi Teknisi Komputer dan Jaringan – LSP BNSP",
    Img: "https://images.unsplash.com/photo-1589330694653-aded6fac0243?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    Title: "Sertifikasi IT Dicoding Indonesia",
    Img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    Title: "Sertifikasi Kemampuan Bahasa Inggris TOEIC",
    Img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    Title: "Sertifikasi Sabuk Hitam DAN 1 Karate",
    Img: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    Title: "Juara 2 Mahasiswa Kata Perorangan Putra - UPI Karate Cup V 2025",
    Img: "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=800&auto=format&fit=crop",
  },
];

const techStacks = [
  { icon: "java.jpg", language: "Java (OOP & GUI)", category: "Backend & OOP", color: "from-red-500/20 to-orange-500/10" },
  { icon: "php.jpg", language: "PHP", category: "Full-Stack Web", color: "from-indigo-500/20 to-purple-500/10" },
  { icon: "javascript.svg", language: "JavaScript", category: "Core Language", color: "from-amber-500/20 to-yellow-500/10" },
  { icon: "reactjs.svg", language: "React & Next.js", category: "Frontend UI", color: "from-sky-500/20 to-cyan-500/10" },
  { icon: "solidity", language: "Solidity & Hardhat", category: "Web3 / Monad", color: "from-indigo-500/20 to-sky-500/10" },
  { icon: "sql.jpg", language: "SQL & MySQL", category: "Relational DB", color: "from-blue-600/20 to-cyan-600/10" },
  { icon: "docker", language: "Docker & Nginx", category: "Containers & Proxy", color: "from-blue-500/20 to-sky-500/10" },
  { icon: "aws", language: "Amazon AWS", category: "Cloud Infra", color: "from-amber-500/20 to-orange-500/10" },
  { icon: "cisco", language: "Cisco Networking", category: "VLAN / OSPF", color: "from-sky-600/20 to-blue-600/10" },
  { icon: "linux", language: "Linux (OS)", category: "Systems & Server", color: "from-yellow-500/20 to-slate-500/10" },
  { icon: "tailwind.svg", language: "Tailwind CSS", category: "Styling", color: "from-cyan-500/20 to-teal-500/10" },
  { icon: "bootstrap.svg", language: "Bootstrap", category: "CSS Framework", color: "from-purple-500/20 to-indigo-500/10" },
  { icon: "html.svg", language: "HTML5 & CSS3", category: "Web Standards", color: "from-orange-500/20 to-red-500/10" },
  { icon: "qa", language: "QA Testing & UML", category: "Software Eng", color: "from-teal-500/20 to-emerald-500/10" },
  { icon: "ai", language: "AI & IoT", category: "Emerging Tech", color: "from-cyan-500/20 to-emerald-500/10" },
  { icon: "tableau", language: "Tableau", category: "Data Visualization", color: "from-blue-500/20 to-indigo-500/10" },
  { icon: "git", language: "Git & Actions", category: "CI/CD & VCS", color: "from-orange-600/20 to-red-500/10" },
  { icon: "supabase", language: "Supabase DB", category: "Cloud & Auth", color: "from-emerald-600/20 to-teal-600/10" },
];

const CV_CACHE_VERSION = "2026-11-cv-v2";

const SOFT_SKILLS = [
  "Problem Solving",
  "Critical Thinking",
  "System Thinking",
  "Leadership",
  "Teamwork",
  "Time Management",
];

export default function PortfolioShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [certificates, setCertificates] = useState(FALLBACK_CERTIFICATES);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [projectsResponse, certificatesResponse] = await Promise.all([
        supabase.from("projects").select("*").order("id", { ascending: false }),
        supabase.from("certificates").select("*").order("id", { ascending: false }),
      ]);

      if (!projectsResponse.error && projectsResponse.data?.length > 0) {
        const formattedProjects = projectsResponse.data.map((item) => ({
          id: item.id,
          Title: item.title || item.Title,
          Description: item.description || item.Description,
          Img: item.img || item.Img,
          TechStack: item.tech_stack || item.techstack || item.TechStack,
          Features: item.features || item.Features,
          Link: item.link || item.Link,
          Github: item.github || item.Github,
        }));
        setProjects(formattedProjects);
        localStorage.setItem("projects", JSON.stringify(formattedProjects));
        localStorage.setItem("portfolio_cv_version", CV_CACHE_VERSION);
      } else {
        setProjects(FALLBACK_PROJECTS);
        localStorage.setItem("projects", JSON.stringify(FALLBACK_PROJECTS));
        localStorage.setItem("portfolio_cv_version", CV_CACHE_VERSION);
      }

      if (!certificatesResponse.error && certificatesResponse.data?.length > 0) {
        const formattedCertificates = certificatesResponse.data.map((item) => ({
          id: item.id,
          Img: item.img || item.Img,
          Title: item.title || item.Title || "Sertifikat / Prestasi",
        }));
        setCertificates(formattedCertificates);
        localStorage.setItem("certificates", JSON.stringify(formattedCertificates));
      } else {
        setCertificates(FALLBACK_CERTIFICATES);
        localStorage.setItem("certificates", JSON.stringify(FALLBACK_CERTIFICATES));
      }
    } catch (error) {
      console.error("Error fetching data from Supabase:", error.message);
      setProjects(FALLBACK_PROJECTS);
      setCertificates(FALLBACK_CERTIFICATES);
      localStorage.setItem("projects", JSON.stringify(FALLBACK_PROJECTS));
      localStorage.setItem("certificates", JSON.stringify(FALLBACK_CERTIFICATES));
      localStorage.setItem("portfolio_cv_version", CV_CACHE_VERSION);
    }
  }, []);

  useEffect(() => {
    const cacheVersion = localStorage.getItem("portfolio_cv_version");
    const cachedProjects = localStorage.getItem("projects");
    const cachedCertificates = localStorage.getItem("certificates");

    if (cacheVersion === CV_CACHE_VERSION) {
      if (cachedProjects && JSON.parse(cachedProjects).length > 0) {
        setProjects(JSON.parse(cachedProjects));
      }
      if (cachedCertificates && JSON.parse(cachedCertificates).length > 0) {
        setCertificates(JSON.parse(cachedCertificates));
      }
    } else {
      // Clear stale cache from older site version so latest CV projects/certs show right away
      localStorage.setItem("projects", JSON.stringify(FALLBACK_PROJECTS));
      localStorage.setItem("certificates", JSON.stringify(FALLBACK_CERTIFICATES));
      localStorage.setItem("portfolio_cv_version", CV_CACHE_VERSION);
    }

    fetchData();
  }, [fetchData]);

  const toggleShowMore = useCallback((type) => {
    if (type === "projects") {
      setShowAllProjects((prev) => !prev);
    } else {
      setShowAllCertificates((prev) => !prev);
    }
  }, []);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);

  const TABS = [
    { label: "Projects", icon: Code, count: projects.length },
    { label: "Certificates", icon: Award, count: certificates.length },
    { label: "Tech Stack", icon: Boxes, count: techStacks.length },
  ];

  return (
    <div
      className="md:px-[10%] px-[5%] w-full pt-16 pb-12 overflow-hidden"
      id="Portofolio"
    >
      {/* Header */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="800">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 mb-3 shadow-sm">
          <Sparkles className="w-4 h-4 text-sky-600 animate-pulse" />
          <span className="text-sky-800 text-xs font-extrabold uppercase tracking-wider">
            Featured Works & Skills
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0284c7] via-[#0d9488] to-[#059669] tracking-tight">
          Portfolio Showcase
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base mt-2 font-medium">
          Explore technical engineering projects, Web3 & Cloud solutions, official certifications, and core tech stack.
        </p>
      </div>

      {/* Modern Custom Glass Tab Switcher with Smooth Layout Indicator */}
      <div className="max-w-2xl mx-auto mb-10 p-2 rounded-2xl glass-card border border-slate-200/90 shadow-md flex items-center justify-between gap-2" data-aos="fade-up">
        {TABS.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeTab === idx;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(idx)}
              className={`relative flex-1 py-3 px-3 rounded-xl flex items-center justify-center gap-2 font-extrabold text-xs sm:text-sm transition-colors duration-300 ${
                isActive
                  ? "text-white"
                  : "text-slate-600 hover:text-sky-700"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="portfolio-tab-pill"
                  transition={{ type: "spring", stiffness: 360, damping: 30 }}
                  className="absolute inset-0 bg-gradient-to-r from-[#0284c7] via-[#0d9488] to-[#059669] rounded-xl shadow-lg shadow-sky-500/25 -z-10"
                />
              )}
              <Icon className={`w-4 h-4 relative z-10 ${isActive ? "text-white" : "text-slate-500"}`} />
              <span className="relative z-10">{tab.label}</span>
              <span className={`relative z-10 px-2 py-0.5 rounded-full text-[10px] ${isActive ? "bg-white/20 text-white" : "bg-slate-200/70 text-slate-700"}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="transition-all duration-500 min-h-[300px]">
        {activeTab === 0 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProjects.map((project, index) => (
                <div
                  key={project.id || index}
                  data-aos="fade-up"
                  data-aos-delay={Math.min(index * 80, 320)}
                >
                  <CardProject
                    Img={project.Img}
                    Title={project.Title}
                    Description={project.Description}
                    Link={project.Link}
                    id={project.id}
                    TechStack={project.TechStack}
                  />
                </div>
              ))}
            </div>
            {projects.length > initialItems && (
              <div className="mt-8 flex justify-center">
                <ToggleButton
                  onClick={() => toggleShowMore("projects")}
                  isShowingMore={showAllProjects}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCertificates.map((certificate, index) => (
                <div
                  key={certificate.id || index}
                  data-aos="fade-up"
                  data-aos-delay={Math.min(index * 80, 320)}
                >
                  <Certificate ImgSertif={certificate.Img} Title={certificate.Title} />
                </div>
              ))}
            </div>
            {certificates.length > initialItems && (
              <div className="mt-8 flex justify-center">
                <ToggleButton
                  onClick={() => toggleShowMore("certificates")}
                  isShowingMore={showAllCertificates}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div className="space-y-10 animate-fadeIn">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {techStacks.map((stack, index) => (
                <div
                  key={stack.language}
                  data-aos="zoom-in"
                  data-aos-delay={Math.min(index * 40, 280)}
                >
                  <TechStackIcon
                    TechStackIcon={stack.icon}
                    Language={stack.language}
                    Category={stack.category}
                    Color={stack.color}
                  />
                </div>
              ))}
            </div>

            {/* Soft Skills Strip from CV */}
            <div className="glass-card border border-slate-200/90 rounded-2xl p-6 text-center shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-wider text-sky-700 mb-3">
                Core Soft Skills
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {SOFT_SKILLS.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-1.5 rounded-full bg-white border border-sky-200 text-xs sm:text-sm font-bold text-slate-700 shadow-xs hover:border-sky-400 hover:text-sky-700 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
