import React, { useEffect, useState, memo, useMemo } from "react";
import {
  FileText,
  Code,
  Award,
  ArrowUpRight,
  Sparkles,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Calendar,
  MapPin,
  Building2,
  Laptop,
  ShieldCheck,
  Users,
  Trophy,
  Eye,
  X,
  Download,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const Header = memo(() => (
  <div className="text-center lg:mb-12 mb-6 px-[5%]">
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 mb-3 shadow-sm">
      <Sparkles className="w-4 h-4 text-sky-600 animate-pulse" />
      <span className="text-sky-800 text-xs font-extrabold uppercase tracking-wider">
        Get To Know Me
      </span>
    </div>
    <h2
      className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0284c7] via-[#0d9488] to-[#059669] tracking-tight"
      data-aos="zoom-in-up"
      data-aos-duration="600"
    >
      About Me
    </h2>
    <p
      className="mt-3 text-slate-600 max-w-2xl mx-auto text-base sm:text-lg flex items-center justify-center gap-2 font-medium"
      data-aos="zoom-in-up"
      data-aos-duration="800"
    >
      Bridging academic excellence with hands-on software, cloud, and network engineering
    </p>
  </div>
));

const ProfileImage = memo(() => (
  <div className="flex justify-center lg:justify-end items-center p-2 relative">
    <div className="relative group" data-aos="fade-up" data-aos-duration="900">
      <div className="absolute -inset-3 bg-gradient-to-r from-[#0284c7] via-[#0d9488] to-[#059669] rounded-full blur-xl opacity-40 group-hover:opacity-75 transition-all duration-700 animate-spin-slow" />

      <div className="absolute -top-3 -left-4 z-20 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-xl border border-sky-200 shadow-md text-xs font-bold text-sky-800 flex items-center gap-1.5 animate-float-slow">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>GDGoC & GSA 2026</span>
      </div>

      <div className="absolute -bottom-2 -right-4 z-20 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-xl border border-emerald-200 shadow-md text-xs font-bold text-emerald-800 flex items-center gap-1.5 animate-float-reverse">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>KIP-K • IPK 3.76</span>
      </div>

      <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-white p-1 bg-white">
        <img
          src="/Photo.jpg"
          alt="Billy Wicaksono"
          className="w-full h-full object-cover rounded-full transition-all duration-700 group-hover:scale-105 group-hover:rotate-1"
          loading="lazy"
        />
      </div>
    </div>
  </div>
));

const StatCard = memo(
  ({ icon: Icon, color, value, label, description, animation }) => (
    <div
      data-aos={animation}
      data-aos-duration={900}
      className="relative group cursor-pointer"
    >
      <div className="relative z-10 glass-card rounded-2xl p-6 border border-slate-200/90 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-sky-300 h-full flex flex-col justify-between">
        <div
          className={`absolute -z-10 inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        />

        <div className="flex items-center justify-between mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-sky-50 text-sky-600 border border-sky-100 group-hover:scale-110 group-hover:rotate-3 transition-transform">
            <Icon className="w-7 h-7 text-sky-600" />
          </div>
          <span className="text-3xl font-black bg-gradient-to-r from-slate-900 via-sky-900 to-slate-800 bg-clip-text text-transparent">
            {value}
          </span>
        </div>

        <div>
          <p className="text-sm font-extrabold uppercase tracking-wider text-slate-800 mb-1">
            {label}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">
              {description}
            </p>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  )
);

const EDUCATION = [
  {
    institution: "Universitas Pasundan",
    location: "Bandung, West Java, Indonesia",
    degree: "S1 Teknik Informatika (Bachelor of Informatics Engineering)",
    period: "2024 – Present",
    grade: "GPA: 3.76 / 4.00",
    description:
      "Awarded the KIP-Kuliah full academic scholarship for outstanding academic performance.",
  },
  {
    institution: "SMKN 1 Cikarang Barat",
    location: "Bekasi, Indonesia",
    degree: "Computer and Network Engineering (TKJ)",
    period: "2020 – 2023",
    grade: "Final Score: 80.6 / 100",
    description: "Graduated as a Top 4 ranking student in the cohort.",
  },
];

const WORK_EXPERIENCES = [
  {
    company: "PT Berkah Teknologi Terdepan",
    role: "Junior Software Engineer (Intern)",
    period: "2026",
    type: "Internship",
    details: [
      "Developed responsive full-stack web features and executed end-to-end functional, security, and debugging tests to maintain optimal production system performance.",
    ],
  },
  {
    company: "Universitas Pasundan",
    role: "Laboratory Assistant (Programming 1)",
    period: "2026",
    type: "Academic Staff",
    details: [
      "Instructed and mentored undergraduate students in foundational programming logic, algorithms, data structures, and code debugging using Java.",
    ],
  },
  {
    company: "Universitas Pasundan",
    role: "Teaching Assistant & Examiner (Web Technology)",
    period: "2025",
    type: "Academic Staff",
    details: [
      "Evaluated code architecture, database integration, and web functionality (HTML, CSS, PHP) for 10 students across two technical assessment sessions.",
    ],
  },
  {
    company: "PT Suzuki Sejahtera Buana Trada",
    role: "IT Assistant (Intern)",
    period: "Jan 2022 – Mar 2022",
    type: "Internship",
    details: [
      "Performed routine hardware maintenance, OS installations, internal network troubleshooting, and secure user data migrations to minimize operational downtime.",
    ],
  },
];

const ORGANIZATIONS = [
  {
    organization: "Google Developer Groups on Campus (GDGoC) Universitas Pasundan",
    role: "Core Team (Public Relations)",
    period: "2026 – 2027",
    tag: "Core Team",
    description:
      "Managed external communications, strategic partnerships, and public outreach initiatives to expand developer community engagement across campus.",
  },
  {
    organization: "Google Student Ambassador (GSA)",
    role: "University Representative",
    period: "2026 – Present",
    tag: "Official Liaison",
    description:
      "Acted as the official liaison between Google and the university community to promote developer programs and organize campus tech activations.",
  },
  {
    organization: "Pop Survey",
    role: "Campus Ambassador",
    period: "2026 – Present",
    tag: "Ambassador",
    description:
      "Executed campus brand awareness campaigns and facilitated student research data collection to drive platform adoption.",
  },
];

const CERTIFICATIONS_LIST = [
  { title: "Sertifikasi IT Dicoding", issuer: "Dicoding Indonesia" },
  { title: "Teknisi Komputer dan Jaringan", issuer: "LSP BNSP" },
  { title: "English Proficiency (TOEIC)", issuer: "ETS Certified" },
  { title: "Sabuk Hitam DAN 1 Karate", issuer: "Martial Arts" },
  { title: "Juara 2 Kata Perorangan Putra", issuer: "UPI Karate Cup V 2025" },
];

const AboutPage = () => {
  const [showCvModal, setShowCvModal] = useState(false);

  const { totalProjects, totalCertificates } = useMemo(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const storedCertificates = JSON.parse(
      localStorage.getItem("certificates") || "[]"
    );
    return {
      totalProjects: storedProjects.length || 6,
      totalCertificates: storedCertificates.length || 5,
    };
  }, []);

  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") setShowCvModal(false);
    };
    if (showCvModal) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [showCvModal]);

  const statsData = useMemo(
    () => [
      {
        icon: GraduationCap,
        color: "from-[#0284c7] to-[#059669]",
        value: "3.76",
        label: "GPA (KIP-Kuliah Scholar)",
        description: "Universitas Pasundan",
        animation: "fade-right",
      },
      {
        icon: Code,
        color: "from-[#059669] to-[#0284c7]",
        value: `${totalProjects}+`,
        label: "Technical Projects",
        description: "Full-Stack, Cloud AWS, Web3 & Cisco",
        animation: "fade-up",
      },
      {
        icon: Award,
        color: "from-[#0284c7] to-[#059669]",
        value: `${totalCertificates}+`,
        label: "Certifications & Awards",
        description: "BNSP, Dicoding, TOEIC & Karate",
        animation: "fade-left",
      },
    ],
    [totalProjects, totalCertificates]
  );

  return (
    <div
      className="h-auto pb-16 text-slate-800 overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] pt-8"
      id="About"
    >
      <Header />

      {/* Profile Overview */}
      <div className="w-full mx-auto pt-2 relative">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight" data-aos="fade-right">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284c7] via-[#0d9488] to-[#059669]">
                Hello, I'm
              </span>
              <span className="block mt-1 text-slate-900">
                Billy Wicaksono
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed text-justify font-normal">
              Detail-oriented Informatics Engineering undergraduate at Universitas Pasundan (GPA 3.76/4.00, KIP-Kuliah Scholar) and BNSP-certified Computer and Network Technician with practical experience in full-stack web development, software quality assurance, and network infrastructure. Proven ability to deliver scalable web & cloud solutions, mentor peers in Java and web technologies, and drive tech community engagement as a Google Student Ambassador and GDGoC Core Team member.
            </p>

            {/* Quick Contact & Location Pill Bar from CV */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs font-semibold text-slate-600">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 border border-slate-200 shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                Bandung, West Java, Indonesia
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 border border-slate-200 shadow-xs">
                <Laptop className="w-3.5 h-3.5 text-emerald-600" />
                billywicaksono.999@gmail.com
              </span>
            </div>

            {/* Quote Card */}
            <div className="relative glass-card border border-sky-200/80 rounded-2xl p-5 my-6 backdrop-blur-xl shadow-md overflow-hidden" data-aos="fade-up">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-sky-400/10 to-transparent rounded-bl-full pointer-events-none" />
              <blockquote className="text-slate-700 text-center lg:text-left italic font-semibold text-sm sm:text-base leading-relaxed">
                "Detail-oriented, disciplined, and committed to delivering scalable technical solutions while empowering developer communities."
              </blockquote>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 w-full pt-2">
              <a
                href="/CV Billy Wicaksono.pdf"
                download="CV_Billy_Wicaksono.pdf"
                className="w-full sm:w-auto"
              >
                <button className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0284c7] via-[#0d9488] to-[#059669] text-white font-extrabold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 active:scale-95">
                  <Download className="w-5 h-5" /> Download Latest CV
                </button>
              </a>

              <button
                type="button"
                onClick={() => setShowCvModal(true)}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl glass-card border border-sky-300 text-sky-800 font-extrabold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 hover:bg-sky-50/90 active:scale-95 shadow-sm"
              >
                <Eye className="w-5 h-5" /> Preview CV
              </button>

              <a href="#Portofolio" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-5 py-3.5 rounded-xl glass-card border border-emerald-300 text-emerald-800 font-extrabold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 hover:bg-emerald-50/80 active:scale-95 shadow-sm">
                  <Code className="w-5 h-5" /> View Projects
                </button>
              </a>
            </div>
          </div>

          <ProfileImage />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          {statsData.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* EDUCATION SECTION */}
        <div className="mt-20 space-y-8" data-aos="fade-up">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-100/80 text-sky-700 border border-sky-200/80 shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Education
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Academic background & scholarships
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EDUCATION.map((edu, idx) => (
              <div
                key={idx}
                className="glass-card glass-card-hover border border-slate-200/90 rounded-2xl p-6 shadow-md relative overflow-hidden group flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-sky-100/60 to-transparent rounded-bl-full pointer-events-none" />
                <div className="space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {edu.period}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold">
                      {edu.grade}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {edu.institution}
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {edu.location}
                    </p>
                  </div>

                  <p className="text-sm font-bold text-slate-800">
                    {edu.degree}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">
                    {edu.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WORK & TEACHING EXPERIENCES */}
        <div className="mt-20 space-y-8" data-aos="fade-up">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-100/80 text-emerald-700 border border-emerald-200/80 shadow-sm">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Work & Teaching Experience
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Software engineering internships, laboratory instruction & IT support
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WORK_EXPERIENCES.map((exp, idx) => (
              <div
                key={idx}
                data-aos="fade-up"
                data-aos-delay={idx * 80}
                className="glass-card glass-card-hover border border-slate-200/90 rounded-2xl p-6 shadow-md flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
                      {exp.period}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-bold">
                      {exp.type}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors leading-snug">
                      {exp.role}
                    </h4>
                    <p className="text-xs text-slate-500 font-bold flex items-center gap-1 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" /> {exp.company}
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
                    {exp.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ORGANIZATIONAL & LEADERSHIP EXPERIENCE */}
        <div className="mt-20 space-y-8" data-aos="fade-up">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-100/80 text-sky-700 border border-sky-200/80 shadow-sm">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Organizational & Leadership
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Developer community leadership & university ambassador initiatives
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ORGANIZATIONS.map((org, idx) => (
              <div
                key={idx}
                data-aos="fade-up"
                data-aos-delay={idx * 90}
                className="glass-card glass-card-hover border border-slate-200/90 rounded-2xl p-6 shadow-md flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                      {org.tag}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {org.period}
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors leading-snug">
                    {org.role}
                  </h4>
                  <p className="text-xs font-bold text-sky-700">{org.organization}</p>
                  <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                    {org.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CERTIFICATIONS & ACHIEVEMENTS HIGHLIGHT STRIP */}
        <div className="mt-20 space-y-6" data-aos="fade-up">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-100/80 text-amber-700 border border-amber-200/80 shadow-sm">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Certifications & Achievements
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                National technical certifications, language credentials & championship honors
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CERTIFICATIONS_LIST.map((item, idx) => (
              <div
                key={idx}
                data-aos="zoom-in"
                data-aos-delay={idx * 60}
                className="glass-card glass-card-hover rounded-2xl p-4 border border-slate-200/90 flex flex-col justify-between gap-2"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500/15 to-emerald-500/15 border border-sky-200 flex items-center justify-center text-sky-700">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900 leading-snug">
                    {item.title}
                  </p>
                  <p className="text-[11px] font-semibold text-emerald-700 mt-1">
                    {item.issuer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CV PREVIEW MODAL */}
      {showCvModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowCvModal(false)}
        >
          <div
            className="relative w-full max-w-4xl h-[85vh] bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-sky-600" />
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Curriculum Vitae — Billy Wicaksono
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/CV Billy Wicaksono.pdf"
                  download="CV_Billy_Wicaksono.pdf"
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#059669] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:opacity-95"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </a>
                <button
                  onClick={() => setShowCvModal(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-200/70 transition-colors"
                  aria-label="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <iframe
              src="/CV Billy Wicaksono.pdf"
              title="CV Billy Wicaksono"
              className="w-full flex-1 border-0 bg-slate-100"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(AboutPage);
