import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../supabase";
import Swal from "sweetalert2";
import {
  MessageSquare,
  Pin,
  Trash2,
  PinOff,
  Calendar,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PAGE_SIZE = 10;

const Card = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="relative bg-white/95 border border-slate-200/90 rounded-2xl h-full shadow-md text-slate-800 p-4 sm:p-5">
      {children}
    </div>
  </div>
);

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchComments = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("portfolio_comments")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });
    setComments(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  const pin = async (id, value) => {
    await supabase
      .from("portfolio_comments")
      .update({ is_pinned: value })
      .eq("id", id);
    fetchComments();
  };

  const remove = async (id) => {
    const res = await Swal.fire({
      title: "Hapus Komentar?",
      text: "Komentar ini akan dihapus permanen dari database.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });
    if (!res.isConfirmed) return;
    await supabase.from("portfolio_comments").delete().eq("id", id);
    fetchComments();
    Swal.fire({
      title: "Terhapus!",
      text: "Komentar telah dihapus.",
      icon: "success",
      confirmButtonColor: "#0284c7",
      timer: 1600,
      showConfirmButton: false,
    });
  };

  const pinnedCount = comments.filter((c) => c.is_pinned).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filtered = useMemo(() => {
    let result = filter === "pinned" ? comments.filter((c) => c.is_pinned) : comments;
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (c) =>
          (c.user_name || "").toLowerCase().includes(q) ||
          (c.content || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [comments, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-center shadow-sm">
            <MessageSquare className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800">Comments</h1>
            <p className="text-slate-500 text-xs font-medium">
              {comments.length} total · {pinnedCount} pinned
            </p>
          </div>
        </div>

        <div className="flex gap-1 p-1 rounded-xl bg-white border border-slate-200 shadow-sm">
          {[
            { value: "all", label: "All", count: comments.length },
            { value: "pinned", label: "Pinned", count: pinnedCount },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${filter === tab.value
                ? "bg-gradient-to-r from-[#0284c7] to-[#059669] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
                }`}
            >
              {tab.label}
              <span
                className={`px-1.5 py-0.5 rounded-full text-xs ${filter === tab.value ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: comments.length, color: "text-emerald-600" },
          { label: "Pinned", value: pinnedCount, color: "text-sky-600" },
          { label: "Unpinned", value: comments.length - pinnedCount, color: "text-teal-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <p className="text-slate-500 text-xs font-semibold mb-1">{stat.label}</p>
            <p className={`text-xl sm:text-2xl font-black ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or message..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all shadow-sm font-medium"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {search && (
        <p className="text-xs text-slate-500 -mt-3">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"
        </p>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-slate-200 border-t-sky-600 rounded-full animate-spin" />
        </div>
      ) : paginated.length === 0 ? (
        <Card>
          <div className="p-10 text-center">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">
              {search
                ? "No comments match your search."
                : filter === "pinned"
                  ? "No pinned comments."
                  : "No comments yet."}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {paginated.map((comment) => (
            <div
              key={comment.id}
              className={`bg-white/95 backdrop-blur-xl border rounded-2xl px-4 py-4 sm:px-5 shadow-sm transition-all duration-200 ${comment.is_pinned ? "border-emerald-300 bg-emerald-50/40" : "border-slate-200 hover:border-sky-200"
                }`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <img
                  src={comment.profile_image || "/default-avatar.jpg"}
                  alt="Avatar"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-slate-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-bold text-slate-900">
                      {highlightMatch(comment.user_name || "Anonymous", search)}
                    </span>
                    {comment.is_pinned && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                        <Pin className="w-2.5 h-2.5" /> Pinned
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-slate-400 text-xs ml-auto shrink-0">
                      <Calendar className="w-3 h-3" />
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {highlightMatch(comment.content || "", search)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => pin(comment.id, !comment.is_pinned)}
                    title={comment.is_pinned ? "Unpin" : "Pin"}
                    className={`p-2 rounded-lg border transition-all duration-200 ${comment.is_pinned
                      ? "border-emerald-300 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      : "border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-300"
                      }`}
                  >
                    {comment.is_pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => remove(comment.id)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all duration-200"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-xs text-slate-500">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, i, arr) => {
                if (i > 0 && arr[i - 1] !== p - 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="px-2 text-slate-400 text-xs">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-[32px] h-8 px-2 rounded-lg text-xs border transition-all duration-200 ${page === p
                      ? "bg-sky-50 border-sky-300 text-sky-700 font-bold"
                      : "border-slate-200 text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    {p}
                  </button>
                )
              )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function highlightMatch(text, query) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-sky-100 text-sky-900 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}
