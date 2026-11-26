import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabase";
import Projects from "./dashboard/Projects";
import Certificates from "./dashboard/Certificates";
import Comments from "./dashboard/Comments";
import GalleryManager from "./dashboard/Gallery";
import {
  FolderGit2,
  Award,
  MessageSquare,
  Camera,
  LogOut,
  Menu,
  ExternalLink,
  Code2,
  Sparkles,
  UserCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "projects", label: "Projects", subtitle: "Portfolio Showcase", icon: FolderGit2 },
  { to: "certificates", label: "Certificates", subtitle: "Awards & Credentials", icon: Award },
  { to: "gallery", label: "Gallery", subtitle: "Activity Marquee", icon: Camera },
  { to: "comments", label: "Comments", subtitle: "Guestbook Messages", icon: MessageSquare },
];

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("Admin");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) {
        setAdminEmail(data.user.email);
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const currentItem =
    NAV_ITEMS.find((item) => location.pathname.includes(item.to)) || NAV_ITEMS[0];

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-5 gap-6">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-1 shrink-0">
        <div className="relative p-2.5 rounded-xl bg-gradient-to-tr from-[#0284c7] via-[#0d9488] to-[#059669] text-white shadow-md shadow-sky-500/20">
          <Code2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-base font-black bg-gradient-to-r from-slate-900 via-sky-800 to-emerald-700 bg-clip-text text-transparent tracking-tight">
            BilKer
          </p>
          <p className="text-[11px] text-slate-500 font-semibold">Admin CMS Panel</p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="shrink-0 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-50 to-emerald-50 border border-sky-200/80 flex items-center gap-2.5 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <div className="min-w-0">
          <p className="text-slate-800 text-xs font-extrabold truncate">Billy Wicaksono</p>
          <p className="text-[10px] text-emerald-700 font-semibold truncate">{adminEmail}</p>
        </div>
      </div>

      {/* Navigation with Sliding Framer Motion Pill */}
      <nav className="flex flex-col gap-1.5 flex-1 min-h-0">
        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest px-3 mb-1 shrink-0">
          Manage Content
        </p>
        {NAV_ITEMS.map(({ to, label, subtitle, icon: Icon }) => {
          const active = location.pathname.includes(to);
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors duration-200 shrink-0 group ${
                active
                  ? "text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-sky-50/70"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="admin-sidebar-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 bg-gradient-to-r from-[#0284c7] via-[#0d9488] to-[#059669] rounded-xl shadow-md shadow-sky-500/20 -z-10"
                />
              )}
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  active ? "text-white" : "text-slate-500 group-hover:text-sky-600"
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-tight">{label}</p>
                <p className={`text-[10px] leading-tight truncate ${active ? "text-sky-100" : "text-slate-400"}`}>
                  {subtitle}
                </p>
              </div>
              {active && <Sparkles className="w-3.5 h-3.5 text-white/90 shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Quick View Site & Logout */}
      <div className="space-y-2 pt-3 border-t border-slate-200/80 shrink-0">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sky-700 bg-sky-50/80 hover:bg-sky-100 border border-sky-200/80 transition-all text-xs font-bold"
        >
          <span>Lihat Live Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all duration-200 text-sm font-bold"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="flex text-slate-800 bg-gradient-to-br from-sky-100/90 via-teal-50/70 to-emerald-100/80 relative overflow-hidden"
      style={{ height: "100dvh" }}
    >
      {/* Ambient Background Accents */}
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-sky-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-300/25 rounded-full blur-3xl pointer-events-none" />

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-xs lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Desktop */}
      <aside
        className="hidden lg:flex w-64 shrink-0 flex-col border-r border-sky-200/70 bg-white/85 backdrop-blur-2xl shadow-lg shadow-sky-500/5 relative z-10"
        style={{ height: "100dvh", position: "sticky", top: 0 }}
      >
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 flex flex-col border-r border-sky-200/70 bg-white/95 backdrop-blur-2xl shadow-2xl transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-transparent relative z-10">
        {/* Topbar (Desktop & Mobile) */}
        <header className="flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-3.5 border-b border-sky-200/70 bg-white/80 backdrop-blur-xl shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-sky-600 transition-colors"
              aria-label="Open Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                {currentItem.label} Manager
              </h2>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                {currentItem.subtitle} • BilKer Portfolio CMS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Admin Authenticated</span>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden p-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-700"
              aria-label="Open Live Site"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </header>

        {/* Scrollable Content with Framer Motion Route Transition */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="max-w-7xl mx-auto"
            >
              <Routes location={location}>
                <Route index element={<Navigate to="projects" replace />} />
                <Route path="projects" element={<Projects />} />
                <Route path="certificates" element={<Certificates />} />
                <Route path="gallery" element={<GalleryManager />} />
                <Route path="comments" element={<Comments />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
