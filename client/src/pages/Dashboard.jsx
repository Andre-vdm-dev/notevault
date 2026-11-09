import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Logo from "../components/Logo";
import NoteCard from "../components/NoteCard";
import { LockIcon, LogoutIcon, PlusIcon, AlertIcon } from "../components/Icons";
import { getNotes, createNote, updateNote, deleteNote, logout } from "../api";

function Dashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  // if the session runs out, go back to login
  function handleError(err) {
    if (err.status === 401) {
      navigate("/login", { replace: true });
    } else {
      setError(err.message);
    }
  }

  useEffect(() => {
    getNotes()
      .then(setNotes)
      .catch(handleError)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    setError("");
    try {
      const note = await createNote(title, content);
      setNotes([note, ...notes]);
      setTitle("");
      setContent("");
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id, newTitle, newContent) {
    try {
      const updated = await updateNote(id, newTitle, newContent);
      setNotes(notes.map((n) => (n.id === id ? updated : n)));
    } catch (err) {
      if (err.status === 401) handleError(err);
      throw err; // lets the card show the error
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await deleteNote(id);
      setNotes(notes.filter((n) => n.id !== id));
    } catch (err) {
      handleError(err);
    }
  }

  async function handleLogout() {
    await logout().catch(() => {});
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="bg-blue-950 bg-[radial-gradient(rgba(147,197,253,0.14)_1px,transparent_1px)] bg-[size:22px_22px] pb-24 text-white">
        <header className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3 px-6 py-5">
          <Logo />
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-blue-200/40 px-4 text-sm font-semibold text-white hover:bg-white/10"
          >
            <LogoutIcon className="w-4 h-4" strokeWidth={2.2} />
            Log out
          </button>
        </header>

        <div className="mx-auto flex max-w-[1100px] flex-col gap-2 px-6 pt-6">
          <p className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-widest text-blue-300">
            <LockIcon className="w-3.5 h-3.5" strokeWidth={2.4} />
            Vault unlocked
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-[40px]">Your notes</h1>
          <p className="text-[15px] text-blue-200">
            {loading
              ? "Loading..."
              : `${notes.length} private ${notes.length === 1 ? "note" : "notes"} · visible only to you`}
          </p>
        </div>
      </div>

      <main className="mx-auto -mt-16 flex max-w-[1100px] flex-col gap-9 px-6 pb-14">
        <section className="flex flex-col gap-3.5 rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
          <h2 className="text-lg font-bold">New note</h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-3">
            <label htmlFor="new-title" className="sr-only">
              Title
            </label>
            <input
              id="new-title"
              type="text"
              required
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 rounded-[10px] border border-slate-300 bg-slate-50 px-3.5 text-base font-semibold placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
            <label htmlFor="new-content" className="sr-only">
              Content
            </label>
            <textarea
              id="new-content"
              rows={3}
              placeholder="Write something only you will see..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="resize-y rounded-[10px] border border-slate-300 bg-slate-50 px-3.5 py-3 text-[15px] placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-blue-600 px-5 text-[15px] font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 disabled:opacity-60"
              >
                <PlusIcon className="w-4 h-4" strokeWidth={2.6} />
                {saving ? "Saving..." : "Save note"}
              </button>
            </div>
          </form>
        </section>

        {error && (
          <div
            role="alert"
            className="flex items-center gap-2.5 rounded-[10px] border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
          >
            <AlertIcon className="w-[18px] h-[18px] shrink-0" strokeWidth={2.2} />
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-slate-600">Loading your notes...</p>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center gap-2.5 rounded-2xl border-2 border-dashed border-slate-300 bg-white px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <LockIcon className="w-[26px] h-[26px]" />
            </div>
            <p className="text-[17px] font-bold">Your vault is empty</p>
            <p className="text-sm text-slate-600">Write your first private note above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[18px]">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;