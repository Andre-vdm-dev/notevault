# NoteVault

A full-stack personal notes app where only you can see and manage your notes.

Users can register, log in, and create, view, edit and delete their own private notes. Every note is protected by Supabase Row Level Security, so one user can never read or change another user's notes.

## Tech stack

| Part | Tool |
|---|---|
| Frontend | React (Vite) |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| Database & Auth | Supabase |

## How the security works

1. **Login:** React sends the email and password to Express.
2. **Validation:** Express checks them with Supabase Auth.
3. **Token issued:** Express stores the JWT in an HTTP-only cookie, so browser JavaScript can't read it.
4. **Access data:** React requests notes from Express, and the browser sends the cookie automatically.
5. **Middleware check:** `requireAuth` verifies the JWT. With no token or an invalid one, the request is blocked with a `401`.
6. **RLS check:** Express queries Supabase *as the user* (using their JWT), and the RLS policy only returns rows where `user_id = auth.uid()`.

## Project structure

```
notevault/
├── client/            React frontend
│   └── src/
│       ├── api.js         all calls to the server
│       ├── components/    layout, icons, note card, protected route
│       └── pages/         Login, Register, Dashboard
├── server/            Express backend
│   ├── config/        Supabase clients
│   ├── middleware/    requireAuth (JWT check)
│   ├── routes/        auth and notes routes
│   └── server.js
└── supabase/
    └── schema.sql     notes table + RLS policies
```

## API routes

| Method | Route | Protected | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No | Log in and set the cookie |
| POST | `/api/auth/logout` | No | Clear the cookie |
| GET | `/api/auth/me` | Yes | Get the logged-in user |
| GET | `/api/notes` | Yes | Get my notes |
| POST | `/api/notes` | Yes | Create a note |
| PUT | `/api/notes/:id` | Yes | Update a note |
| DELETE | `/api/notes/:id` | Yes | Delete a note |

## Running it locally

### 1. Supabase
1. Create a project on [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the SQL Editor.
3. Under **Authentication → Sign In / Providers → Email**, turn off **Confirm email**.

### 2. Server
```bash
cd server
npm install
cp .env.example .env
```
Fill in `SUPABASE_URL` and `SUPABASE_ANON_KEY`