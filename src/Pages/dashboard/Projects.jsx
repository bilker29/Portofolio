import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../supabase";
import Swal from "sweetalert2";
import {
  Plus,
  Trash2,
  Upload,
  FolderGit2,
  X,
  ExternalLink,
  Github,
  Pencil,
} from "lucide-react";

const Card = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="relative bg-white/95 border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full">
      {children}
    </div>
  </div>
);

const FormField = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs text-slate-600 uppercase tracking-wider font-bold">
      {label}
    </label>
    {children}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500/20 transition-all font-medium"
  />
);

const SkeletonCard = () => (
  <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
    <div className="w-full aspect-[16/8] bg-slate-100 animate-pulse rounded-xl" />
    <div className="h-4 bg-slate-100 animate-pulse rounded-lg w-2/3" />
    <div className="h-3 bg-slate-100 animate-pulse rounded-lg w-full" />
    <div className="flex gap-2 mt-2">
      <div className="h-7 w-16 bg-slate-100 animate-pulse rounded-lg" />
      <div className="h-7 w-16 bg-slate-100 animate-pulse rounded-lg" />
    </div>
  </div>
);

const ProjectCard = ({ project, onDelete, onEdit }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Card>
      <div className="flex flex-col h-full">
        {project.Img && (
          <div className="w-full aspect-[16/8] rounded-xl mb-3 border border-slate-200 overflow-hidden bg-slate-100 relative">
            {!imgLoaded && (
              <div className="w-full h-full animate-pulse bg-slate-100" />
            )}
            <img
              src={project.Img}
              alt={project.Title}
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0 absolute inset-0"}`}
            />
          </div>
        )}
        <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">
          {project.Title}
        </h3>
        {project.Description && (
          <p className="text-slate-600 text-xs mb-3 line-clamp-2 leading-relaxed">
            {project.Description}
          </p>
        )}
        {project.TechStack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.TechStack.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
          <div className="flex gap-1.5">
            {project.Link && (
              <a
                href={project.Link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-sky-600 hover:border-sky-300 transition-colors"
                title="Live Demo"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.Github && (
              <a
                href={project.Github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors"
                title="GitHub"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => onEdit(project)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-sky-200 text-sky-700 hover:bg-sky-50 text-xs font-semibold transition-colors"
            >
              <Pencil className="w-3 h-3" /> Edit
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
    <div
      className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
    />
    <div
      className="relative z-10 w-full max-w-2xl flex flex-col"
      style={{ maxHeight: "calc(100vh - 24px)" }}
    >
      <div className="relative bg-white border border-slate-200 shadow-2xl rounded-2xl flex flex-col overflow-hidden text-slate-800">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 shrink-0 bg-slate-50">
          <h2 className="text-base font-bold text-slate-800">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 bg-white">{children}</div>
      </div>
    </div>
  </div>
);

const ProjectForm = ({ initial, onSubmit, onCancel, submitLabel = "Save Project", uploading }) => {
  const [form, setForm] = useState({
    Title: initial?.Title || "",
    Description: initial?.Description || "",
    TechStack: Array.isArray(initial?.TechStack) ? initial.TechStack.join(", ") : initial?.TechStack || "",
    Features: Array.isArray(initial?.Features) ? initial.Features.join(", ") : initial?.Features || "",
    Link: initial?.Link || "",
    Github: initial?.Github || "",
  });
  const [file, setFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(initial?.Img || null);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setImgPreview(URL.createObjectURL(f));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form, file);
      }}
      className="p-2 sm:p-4 space-y-4"
    >
      <FormField label="Project Title *">
        <Input name="Title" value={form.Title} onChange={onChange} required placeholder="e.g. My Awesome App" />
      </FormField>

      <FormField label="Description *">
        <textarea
          name="Description"
          value={form.Description}
          onChange={onChange}
          required
          rows={3}
          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500/20 transition-all resize-none font-medium"
          placeholder="A brief overview of the project..."
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Tech Stack (comma separated)">
          <Input name="TechStack" value={form.TechStack} onChange={onChange} placeholder="React, Node.js, Tailwind" />
        </FormField>
        <FormField label="Features (comma separated)">
          <Input name="Features" value={form.Features} onChange={onChange} placeholder="Authentication, Dark Mode" />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Live Demo URL">
          <Input name="Link" value={form.Link} onChange={onChange} placeholder="https://myproject.com" />
        </FormField>
        <FormField label="GitHub Repository URL">
          <Input name="Github" value={form.Github} onChange={onChange} placeholder="https://github.com/bilker29/repo" />
        </FormField>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-slate-600 uppercase tracking-wider font-bold">
          Project Cover Image
        </label>
        <label className="flex items-center gap-4 w-full bg-slate-50 border border-dashed border-slate-300 rounded-xl px-4 py-4 cursor-pointer hover:border-sky-500 hover:bg-sky-50/40 transition-all">
          <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
          {imgPreview ? (
            <img src={imgPreview} alt="preview" className="w-16 h-12 object-cover rounded-lg shrink-0 border border-slate-200" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5 text-sky-600" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {file ? file.name : imgPreview ? "Click to change image" : "Upload cover image"}
            </p>
            <p className="text-xs text-slate-500">PNG, JPG, WebP up to 5MB</p>
          </div>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-sm font-semibold transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={uploading}
          className="px-5 py-2 bg-gradient-to-r from-[#0284c7] to-[#059669] hover:opacity-95 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm disabled:opacity-50"
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          <span>{uploading ? "Saving..." : submitLabel}</span>
        </button>
      </div>
    </form>
  );
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [uploading, setUploading] = useState(false);

  const showToast = (title, text, icon) => {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonColor: "#0284c7",
    });
  };

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
    }

    const formattedData = (data || []).map((item) => ({
      id: item.id,
      Title: item.title || item.Title,
      Description: item.description || item.Description,
      Img: item.img || item.Img,
      TechStack: item.tech_stack || item.techstack || item.TechStack,
      Features: item.features || item.Features,
      Link: item.link || item.Link,
      Github: item.github || item.Github,
      created_at: item.created_at,
    }));

    setProjects(formattedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const uploadImage = async (f) => {
    const fileName = `${Date.now()}-${f.name}`;
    const { error } = await supabase.storage.from("project-images").upload(fileName, f);
    if (error) throw error;
    const { data } = supabase.storage.from("project-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleCreate = async (form, file) => {
    try {
      setUploading(true);
      let imgUrl = "";
      if (file) imgUrl = await uploadImage(file);

      const { error } = await supabase.from("projects").insert({
        title: form.Title,
        description: form.Description,
        img: imgUrl,
        tech_stack: form.TechStack.split(",").map((s) => s.trim()).filter(Boolean),
        features: form.Features.split(",").map((s) => s.trim()).filter(Boolean),
        link: form.Link,
        github: form.Github,
      });

      if (error) throw error;
      setShowCreate(false);
      fetchProjects();
      showToast("Success!", "Project successfully created.", "success");
    } catch (err) {
      showToast("Error", `Gagal menyimpan project: ${err.message}`, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = async (form, file) => {
    try {
      setUploading(true);
      let imgUrl = editProject.Img || "";
      if (file) imgUrl = await uploadImage(file);

      const { error } = await supabase
        .from("projects")
        .update({
          title: form.Title,
          description: form.Description,
          img: imgUrl,
          tech_stack: form.TechStack.split(",").map((s) => s.trim()).filter(Boolean),
          features: form.Features.split(",").map((s) => s.trim()).filter(Boolean),
          link: form.Link,
          github: form.Github,
        })
        .eq("id", editProject.id);

      if (error) throw error;
      setEditProject(null);
      fetchProjects();
      showToast("Updated!", "Project successfully updated.", "success");
    } catch (err) {
      showToast("Error", `Gagal mengupdate project: ${err.message}`, "error");
    } finally {
      setUploading(false);
    }
  };

  const deleteProject = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this project!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      fetchProjects();
      showToast("Deleted!", "Your project has been deleted.", "success");
    } catch (err) {
      showToast("Error", `Gagal menghapus project: ${err.message}`, "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-center shadow-sm">
            <FolderGit2 className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800">Projects</h1>
            <p className="text-slate-500 text-xs font-medium">
              {loading ? "Loading..." : `${projects.length} projects total`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#059669] hover:opacity-95 text-white font-bold text-sm shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {showCreate && (
        <Modal title="Add New Project" onClose={() => setShowCreate(false)}>
          <ProjectForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} submitLabel="Save Project" uploading={uploading} />
        </Modal>
      )}

      {editProject && (
        <Modal title="Edit Project" onClose={() => setEditProject(null)}>
          <ProjectForm initial={editProject} onSubmit={handleEdit} onCancel={() => setEditProject(null)} submitLabel="Update Project" uploading={uploading} />
        </Modal>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <div className="p-16 text-center">
            <FolderGit2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">No projects yet. Create your first one!</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
              className="h-full"
            >
              <ProjectCard project={project} onDelete={deleteProject} onEdit={setEditProject} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
