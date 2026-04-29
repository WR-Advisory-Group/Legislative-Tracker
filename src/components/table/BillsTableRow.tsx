import { useEffect, useState } from 'react';
import type { Bill } from '../../types/bill';
import { setBillMonitor } from '../../api/client';

interface Props {
  bill: Bill;
  isEven: boolean;
}

function PdfIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}

export default function BillsTableRow({ bill, isEven }: Props) {
  const rowBg = isEven ? 'bg-white' : 'bg-mb-blue-5';
  const [monitored, setMonitored] = useState(bill.monitor === 1);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setMonitored(bill.monitor === 1);
  }, [bill.id, bill.monitor]);

  const handleToggle = async () => {
    if (pending) return;
    const previous = monitored;
    const next = !previous;
    setMonitored(next);
    setPending(true);
    try {
      await setBillMonitor(bill.id, next ? 1 : 0);
    } catch {
      setMonitored(previous);
    } finally {
      setPending(false);
    }
  };

  return (
    <tr className={`${rowBg} hover:bg-mb-blue-10 transition-colors duration-150 cursor-pointer`}>
      {/* TYPE */}
      <td className="px-4 py-4 text-mb-text-dark text-sm font-semibold align-middle whitespace-nowrap">
        {bill.type ?? '—'}
      </td>

      {/* BILL NO. */}
      <td className="px-4 py-4 text-mb-brand text-sm font-semibold align-middle whitespace-nowrap">
        {bill.no ?? '—'}
      </td>

      {/* TITLE / SUBJECT */}
      <td className="px-4 py-4 align-middle">
        <div>
          {bill.permalink ? (
            <a
              href={bill.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold uppercase text-mb-text-dark hover:underline text-sm leading-snug"
            >
              {bill.title ?? '(No Title)'}
            </a>
          ) : (
            <span className="font-bold uppercase text-mb-text-dark text-sm leading-snug">
              {bill.title ?? '(No Title)'}
            </span>
          )}
          {bill.longTitle && (
            <p className="text-mb-text-medium text-sm mt-1 line-clamp-2">{bill.longTitle}</p>
          )}
          <div className="flex flex-wrap gap-x-4 mt-1">
            {bill.primaryCommittee && (
              <span className="text-mb-text-light text-xs">Primary Committee: {bill.primaryCommittee}</span>
            )}
            {bill.secondaryCommittee && (
              <span className="text-mb-text-light text-xs">Secondary Committee: {bill.secondaryCommittee}</span>
            )}
          </div>
        </div>
      </td>

      {/* DATE FILED */}
      <td className="px-4 py-4 text-mb-text-medium text-sm align-middle whitespace-nowrap">
        {bill.dateFiled ?? '—'}
      </td>

      {/* AUTHOR */}
      <td className="px-4 py-4 text-mb-text-medium text-sm align-middle">
        <span className="line-clamp-2">{bill.author ?? '—'}</span>
      </td>

      {/* ACTION */}
      <td className="px-4 py-4 align-middle min-w-[180px]">
        <div className="flex flex-col gap-2 items-start">
          <div className="flex items-center gap-2">
            {bill.permalink && (
              <a
                href={"https://senate.gov.ph/legislative-documents/" + bill.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-mb-blue-10 text-mb-brand text-xs font-semibold px-3 py-1 rounded-full hover:bg-mb-blue-20 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View
              </a>
            )}
            {bill.pdfUrl && (
              <a
                href={bill.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-mb-brand hover:text-mb-brand-dark text-sm transition-colors"
              >
                <PdfIcon />
              </a>
            )}
          </div>

          {/* Monitor toggle */}
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={monitored}
                disabled={pending}
                onChange={handleToggle}
              />
              <div className="w-9 h-5 bg-gray-300 rounded-full peer-checked:bg-mb-brand transition-colors" />
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
            </div>
            <span className="text-xs text-mb-text-medium font-medium">Monitor</span>
          </label>
        </div>
      </td>
    </tr>
  );
}
