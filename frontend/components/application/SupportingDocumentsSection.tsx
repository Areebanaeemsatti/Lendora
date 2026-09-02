'use client';

import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SupportingDocument, DocumentType } from '@/types';
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
  FileCheck,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  documents: SupportingDocument[];
  error?: string;
  onChange: (docs: SupportingDocument[]) => void;
}

const documentTypeOptions: { value: DocumentType; label: string }[] = [
  { value: 'Utility Bill', label: 'Utility Bill' },
  { value: 'Easypaisa Evidence', label: 'Easypaisa Evidence' },
  { value: 'JazzCash Evidence', label: 'JazzCash Evidence' },
  { value: 'Mobile Recharge Evidence', label: 'Mobile Recharge Evidence' },
  { value: 'Income / Business Proof', label: 'Income / Business Proof' },
  { value: 'Repayment Evidence', label: 'Repayment Evidence' },
  { value: 'Other', label: 'Other' },
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function SupportingDocumentsSection({ documents, error, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processFiles = (files: FileList | File[]) => {
    setErrorMessage(null);
    const newDocs: SupportingDocument[] = [];

    Array.from(files).forEach((file) => {
      const fileNameLower = file.name.toLowerCase();
      const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => fileNameLower.endsWith(ext));
      const hasValidMime = ALLOWED_MIME_TYPES.includes(file.type);

      if (!hasValidExt && !hasValidMime) {
        setErrorMessage('Unsupported file type. Please upload a PNG, JPG, or JPEG image.');
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrorMessage('File is too large. Please upload an image smaller than 5 MB.');
        return;
      }

      // Read as Data URL for browser preview and session retention
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewUrl = e.target?.result as string;
        const docItem: SupportingDocument = {
          id: 'doc-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
          fileName: file.name,
          fileSize: formatBytes(file.size),
          fileType: file.type || 'image/jpeg',
          documentType: inferDefaultDocumentType(file.name),
          description: '',
          previewUrl,
        };

        onChange([...documents, docItem]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const inferDefaultDocumentType = (fileName: string): DocumentType => {
    const lower = fileName.toLowerCase();
    if (lower.includes('bill') || lower.includes('lesco') || lower.includes('k-electric') || lower.includes('sngpl') || lower.includes('ssgc')) {
      return 'Utility Bill';
    }
    if (lower.includes('easypaisa')) return 'Easypaisa Evidence';
    if (lower.includes('jazzcash') || lower.includes('jazz')) return 'JazzCash Evidence';
    if (lower.includes('recharge') || lower.includes('telenor') || lower.includes('zong') || lower.includes('ufone')) {
      return 'Mobile Recharge Evidence';
    }
    if (lower.includes('income') || lower.includes('salary') || lower.includes('sale') || lower.includes('business')) {
      return 'Income / Business Proof';
    }
    return 'Other';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDocumentTypeChange = (id: string, newType: DocumentType) => {
    const updated = documents.map((doc) =>
      doc.id === id ? { ...doc, documentType: newType } : doc
    );
    onChange(updated);
  };

  const handleDescriptionChange = (id: string, desc: string) => {
    const updated = documents.map((doc) =>
      doc.id === id ? { ...doc, description: desc } : doc
    );
    onChange(updated);
  };

  const handleRemove = (id: string) => {
    const updated = documents.filter((doc) => doc.id !== id);
    onChange(updated);
  };

  return (
    <Card id="section-documents" className="border-slate-200/90 shadow-xs">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Supporting Documents & Image Proof</CardTitle>
              <CardDescription>
                Upload supporting images that help verify the financial information provided in this application.
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Helper text banner */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-700">Reviewer Reference:</span> Images are collected as supporting evidence only. They are not automatically used to make a credit decision in this frontend prototype.
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2.5 group',
            dragOver
              ? 'border-emerald-500 bg-emerald-50/40 ring-4 ring-emerald-500/10'
              : error
              ? 'border-rose-300 bg-rose-50/20 hover:border-rose-400'
              : 'border-slate-300 hover:border-emerald-600 hover:bg-slate-50/60 bg-white'
          )}
          role="button"
          tabIndex={0}
          aria-label="Upload image proof"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,image/png,image/jpeg"
            className="hidden"
            onChange={handleFileInputChange}
          />

          <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-emerald-100 text-slate-500 group-hover:text-emerald-700 flex items-center justify-center transition-colors shadow-xs">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-800">
              Upload image proof
            </p>
            <p className="text-xs text-slate-500">
              Drag &amp; drop images here or <span className="text-emerald-700 font-semibold underline underline-offset-2">browse</span>
            </p>
          </div>

          <p className="text-[11px] text-slate-400">
            PNG, JPG or JPEG • Maximum 5 MB per image
          </p>
        </div>

        {/* Validation Error Message */}
        {(errorMessage || error) && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage || error}</span>
          </div>
        )}

        {/* Uploaded Documents List */}
        {documents.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
              <span className="flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Uploaded Proof ({documents.length})
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-emerald-700 hover:text-emerald-800 text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add More
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-xs"
                >
                  {/* Image Thumbnail */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {doc.previewUrl ? (
                      <img
                        src={doc.previewUrl}
                        alt={doc.fileName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-400" />
                    )}
                  </div>

                  {/* File Metadata & Form Controls */}
                  <div className="flex-1 w-full space-y-3 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate" title={doc.fileName}>
                          {doc.fileName}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {doc.fileSize}
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(doc.id)}
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 self-end sm:self-center h-8 px-2.5 text-xs"
                        leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <Select
                        label="Document Type"
                        optional
                        value={doc.documentType}
                        onChange={(e) => handleDocumentTypeChange(doc.id, e.target.value as DocumentType)}
                        options={documentTypeOptions}
                        className="text-xs"
                      />

                      <Input
                        label="Description (optional)"
                        optional
                        value={doc.description || ''}
                        onChange={(e) => handleDescriptionChange(doc.id, e.target.value)}
                        placeholder="e.g. Electricity bill for March / JazzCash receipt"
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
