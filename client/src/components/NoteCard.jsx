import { useState } from "react";

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function NoteCard({ note, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function startEdit() {
    setTitle(note.title);
    setContent(note.content || "");
    setError("");
    setEditing(true);
  }

  async function handleSave() {
    if (!title.trim()) {
      setError("Title can't be empty.");
      return;
    }

    setSaving(true);
    try {
      await onUpdate(note.id, title, content);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    if (window.confirm(`Delete "${note.title}"? This can't be undone.`)) {
      onDelete(note.id);
    }
  }

  if (editing) {
    return (
      <article className="flex flex-col gap-2.5 rounded-[14px] border-2 border-blue-600 bg-white p-5 ring-4 ring-blue-100">
        <label
          htmlFor={`title-${note.id}`}
          className="text-xs font-bold uppercase tracking-wider text-blue-700"
        >
          Editing
        </label>
        <input
          id={`title-${note.id}`}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-[42px] rounded-lg border border-slate-300 px-3 text-[15px] font-bold text-slate-900 focus:outline-none focus:border-blue-600"
        />
        <label htmlFor={`content-${note.id}`} className="sr-only">
          Content
        </label>
        <textarea
          id={`content-${note.id}`}
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
        />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <div className="flex justify-end gap-1.5 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="h-9 rounded-lg bg-blue-600 px-3.5 text-[13px] font-bold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="flex flex-col gap-2.5 rounded-[14px] border border-slate-200 border-t-4 border-t-blue-600 bg-white p-5 shadow-sm">
      <h3 className="text-[17px] font-bold text-slate-900 break-words">{note.title}</h3>
      <p className="grow whitespace-pre-line break-words text-sm leading-relaxed text-slate-600">
        {note.content}
      </p>
      <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-600">{formatDate(note.updated_at)}</span>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={startEdit}
            className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-9 rounded-lg border border-red-200 bg-white px-3 text-[13px] font-semibold text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default NoteCard;