import { useRef, useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import { replaceKeywords } from '../../api/client';
import type { KeywordGroup, KeywordRow } from '../../types/keyword';

interface Props {
  onUploaded: (groups: KeywordGroup[]) => void;
}

export default function CsvUploader({ onUploaded }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      alert('Please select a .csv file.');
      return;
    }
    setSelectedFile(file);
    setSuccess(false);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setSuccess(false);
    setError(null);
  };

  const handleUpload = () => {
    if (!selectedFile || loading) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    Papa.parse<Record<string, string>>(selectedFile, {
      header: true,
      skipEmptyLines: true,
      transformHeader: h => h.trim().toLowerCase(),
      complete: async results => {
        const fields = results.meta.fields ?? [];
        if (!fields.includes('keyword')) {
          setError('CSV must contain a "keyword" column.');
          setLoading(false);
          return;
        }

        const seen = new Set<string>();
        const rows: KeywordRow[] = [];
        for (const r of results.data) {
          const keyword = ((r.keyword ?? '') as string).trim();
          if (!keyword) continue;
          let group = ((r.group ?? '') as string).trim();
          if (!group) group = 'general';
          if (keyword.length > 255 || group.length > 255) continue;
          const key = `${keyword.toLowerCase()}|${group.toLowerCase()}`;
          if (seen.has(key)) continue;
          seen.add(key);
          rows.push({ keyword, group });
        }

        if (rows.length === 0) {
          setError('No valid rows found in CSV.');
          setLoading(false);
          return;
        }

        try {
          const res = await replaceKeywords(rows);
          setSuccess(true);
          onUploaded(res.groups);
        } catch (err: unknown) {
          let msg = 'Upload failed.';
          if (axios.isAxiosError(err)) {
            msg = err.response?.data?.error ?? err.message ?? msg;
          } else if (err instanceof Error) {
            msg = err.message;
          }
          setError(msg);
        } finally {
          setLoading(false);
        }
      },
      error: err => {
        setError(`Failed to parse CSV: ${err.message}`);
        setLoading(false);
      },
    });
  };

  return (
    <div className="bg-white rounded-xl border border-mb-border shadow-sm p-6 sm:p-8">
      <h2 className="text-lg font-bold text-mb-text-dark mb-1">Import CSV</h2>
      <p className="text-mb-text-light text-sm mb-6">Upload a CSV file to import bill data.</p>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          dragging
            ? 'border-mb-brand bg-mb-blue-10'
            : 'border-mb-border bg-mb-bg-light hover:bg-mb-blue-10 hover:border-mb-blue-30'
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={e => handleFile(e.target.files?.[0])}
        />

        <svg className="w-12 h-12 mx-auto text-mb-blue-30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>

        {selectedFile ? (
          <div>
            <p className="text-mb-brand font-semibold text-sm">{selectedFile.name}</p>
            <p className="text-mb-text-light text-xs mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</p>
          </div>
        ) : (
          <div>
            <p className="text-mb-text-medium font-medium">Drag & drop your CSV file here</p>
            <p className="text-mb-text-light text-sm mt-1">or click to browse</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => fileRef.current?.click()}
          className="bg-white border-2 border-mb-border text-mb-brand rounded-lg px-4 py-2 text-sm font-semibold hover:bg-mb-blue-10 transition-colors"
        >
          Choose File
        </button>

        <button
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          className="bg-mb-brand hover:bg-mb-brand-dark text-white rounded-lg px-6 py-2 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Uploading…' : 'Upload'}
        </button>

        {selectedFile && (
          <button
            onClick={handleClear}
            className="text-mb-text-light hover:text-mb-text-medium text-sm transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Success banner */}
      {success && (
        <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm font-medium">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>File <strong>{selectedFile?.name}</strong> uploaded successfully.</span>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-medium">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
