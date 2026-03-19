"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

const PASSWORD = process.env.NEXT_PUBLIC_PROTO_PASSWORD ?? "";
const TITLE = process.env.NEXT_PUBLIC_PROTO_TITLE || "Prototype";
const DESCRIPTION = process.env.NEXT_PUBLIC_PROTO_DESCRIPTION || "";
const AUTHOR = process.env.NEXT_PUBLIC_PROTO_AUTHOR || "";
const BUILD_TIME = process.env.NEXT_PUBLIC_BUILD_TIME || "";
const STORAGE_KEY = "proto-auth";

export function PasswordGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(!PASSWORD);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (PASSWORD && sessionStorage.getItem(STORAGE_KEY) === "1") {
      setAuthed(true);
    }
  }, []);

  if (authed) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setAuthed(true);
    } else {
      setError(true);
      setInput("");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-72">
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-lg font-semibold text-gray-800">{TITLE}</h1>
          {DESCRIPTION && <p className="text-sm text-gray-500">{DESCRIPTION}</p>}
          {(AUTHOR || BUILD_TIME) && (
            <p className="text-xs text-gray-400 mt-1">
              {AUTHOR && <>by {AUTHOR}</>}
              {AUTHOR && BUILD_TIME && <> · </>}
              {BUILD_TIME && <>Updated {new Date(BUILD_TIME).toLocaleDateString("ja-JP")}</>}
            </p>
          )}
        </div>
        <p className="text-sm text-gray-500">Enter password to continue</p>
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            placeholder="Password"
            autoFocus
            className={`w-full px-3 py-2 pr-10 text-sm border rounded-md outline-none transition-colors ${
              error ? "border-red-400 bg-red-50" : "border-gray-300 focus:border-gray-500"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {error && <p className="text-xs text-red-500 -mt-2">Incorrect password</p>}
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
