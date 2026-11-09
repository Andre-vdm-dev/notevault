import Logo from "./Logo";
import { CheckIcon } from "./Icons";

const points = [
  "Secure HTTP-only sessions",
  "Row Level Security on every note",
  "No one else can read your notes",
];

// split screen: navy brand panel on the left, form on the right
function AuthLayout({ Icon, heading, highlight, text, children }) {
  return (
    <div className="min-h-screen flex flex-wrap bg-slate-50 text-slate-900">
      <aside className="flex-[1_1_460px] min-w-0 bg-blue-950 bg-[radial-gradient(rgba(147,197,253,0.14)_1px,transparent_1px)] bg-[size:22px_22px] text-white p-8 sm:p-12 flex flex-col justify-between gap-12">
        <Logo />

        <div className="flex flex-col gap-5 max-w-[420px]">
          <Icon className="w-[72px] h-[72px] text-blue-300" strokeWidth={1.4} />
          <h2 className="text-4xl sm:text-[44px] leading-tight font-extrabold tracking-tight">
            {heading}
            <br />
            <span className="text-blue-300">{highlight}</span>
          </h2>
          <p className="text-base leading-relaxed text-blue-200">{text}</p>
        </div>

        <ul className="flex flex-col gap-3 text-sm text-blue-100">
          {points.map((point) => (
            <li key={point} className="flex items-center gap-2.5">
              <CheckIcon className="w-[18px] h-[18px] text-blue-400" strokeWidth={2.4} />
              {point}
            </li>
          ))}
        </ul>
      </aside>

      <section className="flex-[1_1_460px] min-w-0 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px] flex flex-col gap-7">{children}</div>
      </section>
    </div>
  );
}

export default AuthLayout;