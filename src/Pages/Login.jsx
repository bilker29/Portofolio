import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  LogIn,
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
  Send,
  ShieldAlert,
} from "lucide-react";

const friendlyAuthError = (msg = "") => {
  const lower = msg.toLowerCase();
  if (lower.includes("failed to fetch") || lower.includes("network")) {
    return {
      title: "Koneksi ke Server Supabase Gagal",
      detail:
        "Server Supabase (znpfecdqomqvjedbqzjc.supabase.co) tidak dapat dijangkau. Kemungkinan project Supabase berstatus Paused karena tidak aktif — silakan buka supabase.com/dashboard lalu klik 'Restore project', atau periksa koneksi internet Anda.",
    };
  }
  if (lower.includes("invalid login credentials")) {
    return {
      title: "Email atau Password Salah",
      detail:
        "Periksa kembali kombinasi email & password Anda, atau klik 'Lupa Password?' di bawah untuk mereset kata sandi lewat email.",
    };
  }
  if (lower.includes("email not confirmed")) {
    return {
      title: "Email Belum Terverifikasi",
      detail: "Silakan cek kotak masuk email Anda untuk konfirmasi akun.",
    };
  }
  return {
    title: "Gagal Masuk",
    detail: msg || "Terjadi kesalahan saat memproses autentikasi.",
  };
};

export default function Login() {
  const [mode, setMode] = useState("login"); // "login" | "forgot" | "recovery"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: "error" | "success", title, detail }
  const navigate = useNavigate();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("recovery");
        setFeedback({
          type: "success",
          title: "Sesi Pemulihan Aktif",
          detail: "Silakan masukkan password baru untuk akun Admin Anda.",
        });
      }
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setFeedback({ type: "error", ...friendlyAuthError(error.message) });
        setLoading(false);
        return;
      }

      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileErr || profile?.role !== "admin") {
        await supabase.auth.signOut();
        setFeedback({
          type: "error",
          title: "Akses Ditolak",
          detail: "Akun ini terdaftar, tetapi tidak memiliki hak akses Admin pada tabel profiles.",
        });
        setLoading(false);
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      setFeedback({ type: "error", ...friendlyAuthError(err?.message) });
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) {
        setFeedback({ type: "error", ...friendlyAuthError(error.message) });
      } else {
        setFeedback({
          type: "success",
          title: "Link Reset Terkirim!",
          detail: `Kami telah mengirim tautan atur ulang kata sandi ke ${email.trim()}. Cek inbox atau folder Spam email Anda.`,
        });
      }
    } catch (err) {
      setFeedback({ type: "error", ...friendlyAuthError(err?.message) });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setFeedback({
        type: "error",
        title: "Password Terlalu Pendek",
        detail: "Gunakan minimal 6 karakter untuk keamanan akun Anda.",
      });
      return;
    }
    setLoading(true);
    setFeedback(null);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setFeedback({ type: "error", ...friendlyAuthError(error.message) });
      } else {
        setFeedback({
          type: "success",
          title: "Password Berhasil Diubah!",
          detail: "Kata sandi Anda telah diperbarui. Mengarahkan ke login...",
        });
        setTimeout(() => {
          setMode("login");
          setNewPassword("");
        }, 1800);
      }
    } catch (err) {
      setFeedback({ type: "error", ...friendlyAuthError(err?.message) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-sky-100 via-teal-50 to-emerald-100 relative overflow-hidden">
      {/* Animated Ambient Background Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-300/40 rounded-full blur-3xl animate-blob pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-300/40 rounded-full blur-3xl animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c712_1px,transparent_1px),linear-gradient(to_bottom,#0d948812_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#0284c7] via-[#0d9488] to-[#059669] rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition duration-700" />
          <div className="relative bg-white/92 backdrop-blur-2xl border border-sky-200/80 shadow-2xl rounded-3xl p-7 sm:p-8 space-y-6">
            {/* Back Link */}
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors group/back"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover/back:-translate-x-0.5 transition-transform" />
                <span>Kembali ke Portofolio</span>
              </Link>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700">
                BilKer Admin
              </span>
            </div>

            {/* Header */}
            <div className="text-center space-y-2.5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span className="text-emerald-800 text-xs font-extrabold tracking-wide uppercase">
                  {mode === "login"
                    ? "Admin Portal"
                    : mode === "forgot"
                    ? "Pemulihan Akun"
                    : "Password Baru"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {mode === "login"
                  ? "Welcome Back"
                  : mode === "forgot"
                  ? "Lupa Password?"
                  : "Atur Password Baru"}
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                {mode === "login"
                  ? "Masuk untuk mengelola Projects, Certificates & Activity Gallery"
                  : mode === "forgot"
                  ? "Masukkan email admin Anda untuk menerima link reset via Supabase Auth"
                  : "Buat kata sandi baru yang kuat untuk dashboard Anda"}
              </p>
            </div>

            {/* Sleek Animated Feedback Banner (Replaces ugly browser alert!) */}
            <AnimatePresence mode="wait">
              {feedback && (
                <motion.div
                  key={feedback.title}
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className={`p-4 rounded-2xl border flex items-start gap-3 text-left shadow-sm ${
                    feedback.type === "error"
                      ? "bg-red-50/90 border-red-200 text-red-900"
                      : "bg-emerald-50/90 border-emerald-200 text-emerald-900"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-xl shrink-0 mt-0.5 ${
                      feedback.type === "error"
                        ? "bg-red-100 text-red-600"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {feedback.type === "error" ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-xs font-extrabold">{feedback.title}</p>
                    <p className="text-[11px] leading-relaxed opacity-90 font-medium break-words">
                      {feedback.detail}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forms */}
            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                    Email Admin
                  </label>
                  <div className="flex items-center bg-slate-50/90 border border-slate-300 rounded-xl overflow-hidden focus-within:border-sky-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
                    <Mail className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
                    <input
                      type="email"
                      placeholder="billywicaksono.999@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-transparent px-3 py-3 text-slate-800 placeholder-slate-400 text-sm outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setFeedback(null);
                      }}
                      className="text-[11px] font-bold text-sky-600 hover:text-sky-700 hover:underline transition-colors"
                    >
                      Lupa Password?
                    </button>
                  </div>
                  <div className="flex items-center bg-slate-50/90 border border-slate-300 rounded-xl overflow-hidden focus-within:border-sky-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
                    <Lock className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-transparent px-3 py-3 text-slate-800 placeholder-slate-400 text-sm outline-none font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="mr-3.5 shrink-0 text-slate-400 hover:text-slate-700 transition-colors"
                      aria-label="Toggle Password Visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="relative group/btn w-full mt-2 h-11 bg-gradient-to-r from-[#0284c7] via-[#0d9488] to-[#059669] rounded-xl flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all disabled:opacity-60"
                >
                  <span className="absolute inset-0 w-1/2 bg-white/15 blur-sm animate-shine pointer-events-none" />
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="relative text-sm font-extrabold text-white">
                        Sign In to Dashboard
                      </span>
                      <LogIn className="relative w-4 h-4 text-white group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </motion.button>
              </form>
            )}

            {mode === "forgot" && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                    Email Terdaftar
                  </label>
                  <div className="flex items-center bg-slate-50/90 border border-slate-300 rounded-xl overflow-hidden focus-within:border-sky-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
                    <Mail className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
                    <input
                      type="email"
                      placeholder="billywicaksono.999@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-transparent px-3 py-3 text-slate-800 placeholder-slate-400 text-sm outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-sky-50/80 border border-sky-200/80 flex items-start gap-2.5 text-[11px] text-sky-900">
                  <ShieldAlert className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Jika Anda juga lupa email/password atau project paused, Anda dapat langsung mereset user & kata sandi melalui{" "}
                    <a
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline hover:text-sky-700"
                    >
                      Supabase Dashboard → Authentication → Users
                    </a>
                    .
                  </p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-gradient-to-r from-[#0284c7] via-[#0d9488] to-[#059669] rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 text-white text-sm font-extrabold disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim Link Reset Password</span>
                    </>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setFeedback(null);
                  }}
                  className="w-full text-center text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors pt-1"
                >
                  ← Kembali ke Halaman Login
                </button>
              </form>
            )}

            {mode === "recovery" && (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                    Password Baru (Min. 6 Karakter)
                  </label>
                  <div className="flex items-center bg-slate-50/90 border border-slate-300 rounded-xl overflow-hidden focus-within:border-sky-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
                    <KeyRound className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password baru..."
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full bg-transparent px-3 py-3 text-slate-800 placeholder-slate-400 text-sm outline-none font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="mr-3.5 shrink-0 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-gradient-to-r from-[#0284c7] to-[#059669] rounded-xl flex items-center justify-center gap-2 shadow-lg text-white text-sm font-extrabold disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Simpan Password Baru</span>
                  )}
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
