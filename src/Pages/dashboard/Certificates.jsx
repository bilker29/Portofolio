import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../supabase";
import Swal from "sweetalert2";
import { Award, Upload, Trash2, ImageIcon, Plus } from "lucide-react";

const Card = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="relative bg-white/95 border border-slate-200/90 rounded-2xl h-full shadow-md">
      {children}
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="relative bg-white/90 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
    <div className="w-full aspect-[16/11.5] bg-slate-100 animate-pulse" />
  </div>
);

const CertCard = ({ cert, onDelete }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="relative group">
      <div className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
        {!imgLoaded && (
          <div className="w-full aspect-[16/11.5] bg-slate-100 animate-pulse" />
        )}
        <img
          src={cert.Img}
          alt="Certificate"
          onLoad={() => setImgLoaded(true)}
          className={`w-full aspect-[16/11.5] object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? "block" : "hidden"}`}
        />
        {imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <button
              onClick={() => onDelete(cert.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs w-full justify-center hover:bg-red-700 transition-colors font-bold shadow-md"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Certificates() {
  const [certs, setCerts] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(true);

  const showToast = (title, text, icon) => {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonColor: "#0284c7",
    });
  };

  const fetchCerts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("Error fetching certificates:", error);

    const formattedData = (data || []).map((item) => ({
      id: item.id,
      Img: item.img || item.Img,
      created_at: item.created_at,
    }));

    setCerts(formattedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const uploadImage = async () => {
    if (!file) return;
    try {
      setUploading(true);
      const fileName = `cert-${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("certificate-images").upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("certificate-images").getPublicUrl(fileName);
      const { error: dbError } = await supabase.from("certificates").insert({ img: data.publicUrl });
      if (dbError) throw dbError;

      setFile(null);
      setPreview(null);
      fetchCerts();
      showToast("Uploaded!", "Certificate uploaded successfully.", "success");
    } catch (err) {
      showToast("Error", `Gagal mengupload sertifikat: ${err.message}`, "error");
    } finally {
      setUploading(false);
    }
  };

  const deleteCert = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this certificate!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const { error } = await supabase.from("certificates").delete().eq("id", id);
      if (error) throw error;
      fetchCerts();
      showToast("Deleted!", "Your certificate has been deleted.", "success");
    } catch (err) {
      showToast("Error", `Gagal menghapus sertifikat: ${err.message}`, "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-center shadow-sm">
          <Award className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800">Certificates</h1>
          <p className="text-slate-500 text-xs font-medium">
            {loading ? "Loading..." : `${certs.length} certificates total`}
          </p>
        </div>
      </div>

      <Card>
        <div className="p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-600" /> Upload Certificate
          </h2>

          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files[0]);
            }}
            className={`flex flex-col items-center justify-center w-full min-h-[160px] rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
              dragOver
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-300 bg-slate-50 hover:border-sky-400 hover:bg-sky-50/40"
            }`}
          >
            {preview ? (
              <img src={preview} alt="preview" className="max-h-40 object-contain rounded-lg p-2" />
            ) : (
              <div className="text-center space-y-2 p-6">
                <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
                  <ImageIcon className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-sm text-slate-700 font-semibold">Drag & drop or click to upload</p>
                <p className="text-xs text-slate-400">PNG, JPG, WEBP supported</p>
              </div>
            )}
            <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files[0])} className="hidden" />
          </label>

          {file && (
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-slate-600 font-medium truncate flex-1">{file.name}</p>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-semibold transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={uploadImage}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#0284c7] to-[#059669] text-white rounded-xl text-xs font-bold shadow-sm hover:opacity-95 disabled:opacity-50"
                >
                  {uploading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>{uploading ? "Uploading..." : "Upload"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : certs.length === 0 ? (
        <Card>
          <div className="p-16 text-center">
            <Award className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">No certificates yet.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {certs.map((cert, idx) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.25) }}
            >
              <CertCard cert={cert} onDelete={deleteCert} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
