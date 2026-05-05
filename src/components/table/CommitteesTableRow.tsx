import { useEffect, useState } from 'react';
import type { Committee } from '../../types/committee';
import { setCommitteeMonitor } from '../../api/client';

interface Props {
  committee: Committee;
  isEven: boolean;
}

export default function CommitteesTableRow({ committee, isEven }: Props) {
  const rowBg = isEven ? 'bg-white' : 'bg-mb-blue-5';
  const [monitored, setMonitored] = useState(committee.monitor === 1);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setMonitored(committee.monitor === 1);
  }, [committee.code, committee.monitor]);

  const handleToggle = async () => {
    if (pending) return;
    const previous = monitored;
    const next = !previous;
    setMonitored(next);
    setPending(true);
    try {
      await setCommitteeMonitor(committee.code, next ? 1 : 0);
    } catch {
      setMonitored(previous);
    } finally {
      setPending(false);
    }
  };

  return (
    <tr className={`${rowBg} hover:bg-mb-blue-10 transition-colors duration-150`}>
      {/* CODE */}
      <td className="px-4 py-4 text-mb-brand text-sm font-semibold align-middle whitespace-nowrap">
        {committee.code}
      </td>

      {/* COMMITTEE */}
      <td className="px-4 py-4 text-mb-text-dark text-sm align-middle">
        {committee.name}
      </td>

      {/* ACTION */}
      <td className="px-4 py-4 align-middle min-w-[180px]">
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
      </td>
    </tr>
  );
}
