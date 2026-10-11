'use client';

import React, { useRef, useState } from 'react';
import { CheckCircle2, FileText, UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadFieldProps {
  label: string;
  hint: string;
  /** Already-attached file names (e.g. from Auto-Fill demo). */
  files: string[];
  onFilesChange: (files: string[]) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

/**
 * Frosted-glass upload dropzone. Tracks attached file *names* only (this is a
 * client-side demo — no bytes are uploaded). When the Auto-Fill demo attaches
 * files they render with a green checkmark, mirroring a real completed upload.
 */
export function UploadField({
  label,
  hint,
  files,
  onFilesChange,
  accept = 'image/*,application/pdf',
  multiple = false,
  className,
}: UploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const names = Array.from(list).map((f) => f.name);
    const next = multiple ? [...files, ...names] : [names[0]];
    onFilesChange(Array.from(new Set(next)));
  };

  return (
    <div className={className}>
      <p className="mb-1.5 block text-xs font-semibold text-[#1E293B]">{label}</p>

      {files.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300/70 bg-white/60 px-4 py-6 text-center transition-colors hover:border-[#0072ff]/60 hover:bg-white/80',
            dragging && 'border-[#0072ff] bg-[#0072ff]/5'
          )}
        >
          <UploadCloud className="h-6 w-6 text-[#0072ff]" aria-hidden />
          <span className="text-xs font-semibold text-[#1E293B]">Click or drag a file here</span>
          <span className="text-[11px] text-[#64748B]">{hint}</span>
        </button>
      ) : (
        <ul className="space-y-1.5">
          {files.map((name) => (
            <li
              key={name}
              className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-2"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
              <FileText className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
              <span className="min-w-0 flex-1 truncate text-xs font-medium text-emerald-800">
                {name} attached
              </span>
              <button
                type="button"
                onClick={() => onFilesChange(files.filter((f) => f !== name))}
                aria-label={`Remove ${name}`}
                className="shrink-0 rounded-md p-0.5 text-emerald-600 transition-colors hover:bg-emerald-100 hover:text-emerald-800"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
          {!multiple && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-[11px] font-semibold text-[#0072ff] hover:underline"
            >
              Replace file
            </button>
          )}
        </ul>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
