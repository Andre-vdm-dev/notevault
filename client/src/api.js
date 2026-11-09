// all calls to the Express server go through here
async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    credentials: "include", // send the auth cookie
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.error || "Something went wrong");
    error.status = res.status;
    throw error;
  }

  return data;
}

// auth
export const register = (email, password) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const login = (email, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const logout = () => request("/auth/logout", { method: "POST" });

export const getMe = () => request("/auth/me");

// notes
export const getNotes = () => request("/notes");

export const createNote = (title, content) =>
  request("/notes", {
    method: "POST",
    body: JSON.stringify({ title, content }),
  });

export const updateNote = (id, title, content) =>
  request(`/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title, content }),
  });

export const deleteNote = (id) => request(`/notes/${id}`, { method: "DELETE" });