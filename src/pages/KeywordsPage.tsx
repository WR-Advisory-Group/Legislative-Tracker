import { useEffect, useState } from 'react';
import Banner from '../components/layout/Banner';
import CsvUploader from '../components/keywords/CsvUploader';
import KeywordAccordion from '../components/keywords/KeywordAccordion';
import { getKeywords } from '../api/client';
import type { KeywordGroup } from '../types/keyword';

export default function KeywordsPage() {
  const [groups, setGroups] = useState<KeywordGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getKeywords()
      .then(r => setGroups(r.groups))
      .catch(e => alert(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Banner title="Keywords" />

      <main className="flex-1 bg-gray-50 px-4 sm:px-6 lg:px-20 py-8">
        <CsvUploader onUploaded={setGroups} />

        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold text-gray-800">Keyword Groups</h2>
            <span className="bg-mb-blue-10 text-mb-brand text-xs font-semibold px-2 py-0.5 rounded-full">
              {groups.length} groups
            </span>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-mb-blue-30 border-t-mb-brand rounded-full animate-spin" />
              </div>
            ) : groups.length === 0 ? (
              <p className="text-center text-mb-text-light text-sm py-8">
                No keywords uploaded yet. Upload a CSV above to get started.
              </p>
            ) : (
              groups.map((group, i) => (
                <KeywordAccordion
                  key={group.label}
                  label={group.label}
                  keywords={group.keywords}
                  defaultOpen={i === 0}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}
