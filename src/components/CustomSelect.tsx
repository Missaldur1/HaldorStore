import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  id: number;
  name: string;
}

interface Props {
  label?: string;
  options: Option[];
  value: number | null;
  onChange: (value: number) => void;
  placeholder?: string;
}

export default function CustomSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const selected = options.find((o) => o.id === value)?.name || placeholder;

  // Cerrar si se hace click fuera
  useEffect(() => {
    const handler = (e: any) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="w-full relative" ref={wrapperRef}>
      {label && (
        <label className="text-sm text-stone-300 mb-1 block">{label}</label>
      )}

      {/* BOTÓN VISUAL */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="
          w-full h-11 px-3 rounded-lg bg-stone-800 border border-stone-700 
          text-left text-stone-200 flex items-center justify-between
          hover:bg-stone-700/70 transition
        "
      >
        <span className={value ? "text-stone-100" : "text-stone-400"}>
          {selected}
        </span>
        <ChevronDown
          className={`size-4 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="
            absolute left-0 right-0 top-full mt-1 
            max-h-56 overflow-y-auto 
            bg-stone-900 border border-stone-700 rounded-lg
            shadow-xl z-[999] animate-fadeIn
          "
        >
          {options.length === 0 ? (
            <div className="p-3 text-stone-400 text-sm">Sin opciones</div>
          ) : (
            options.map((opt) => (
              <div
                key={opt.id}
                onClick={() => {
                  onChange(opt.id);
                  setOpen(false);
                }}
                className="
                  px-3 py-2 cursor-pointer text-stone-200 
                  hover:bg-stone-700/50 transition select-none
                "
              >
                {opt.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}