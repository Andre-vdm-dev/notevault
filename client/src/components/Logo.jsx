import { LockIcon } from "./Icons";

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-[10px] bg-blue-600 flex items-center justify-center text-white">
        <LockIcon className="w-[18px] h-[18px]" strokeWidth={2.2} />
      </div>
      <span className="text-lg font-bold tracking-tight text-white">NoteVault</span>
    </div>
  );
}

export default Logo;