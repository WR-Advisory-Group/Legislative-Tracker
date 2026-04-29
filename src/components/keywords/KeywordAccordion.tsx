import { useState } from 'react';

interface Props {
  label: string;
  keywords: string[];
  defaultOpen?: boolean;
}

export default function KeywordAccordion({ label, keywords, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-mb-border rounded-lg overflow-hidden mb-3 shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 py-3.5 bg-mb-brand text-white font-semibold text-left transition-colors hover:bg-mb-brand-dark"
      >
        <span>{label}</span>
        <svg
          className={`w-4 h-4 flex-shrink-0 transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="bg-mb-blue-5 px-5 py-4 flex flex-wrap gap-2">
          {keywords.map(kw => (
            <span
              key={kw}
              className="bg-white border border-mb-border text-mb-text-dark text-sm px-3 py-1 rounded-full shadow-sm"
            >
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
