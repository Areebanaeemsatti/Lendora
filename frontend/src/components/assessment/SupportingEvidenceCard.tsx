'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { BorrowerApplication, SupportingDocument } from '@/types';
import { Image as ImageIcon, CheckCircle2, FileText, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  application: BorrowerApplication;
}

export function SupportingEvidenceCard({ application }: Props) {
  const documents = application.supportingDocuments || [];
  const [selectedImage, setSelectedImage] = useState<SupportingDocument | null>(null);

  return (
    <Card id="supporting-evidence">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Supporting Documents &amp; Image Proof</CardTitle>
              <CardDescription>
                Mandatory visual evidence uploaded with this application
              </CardDescription>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
            {documents.length} {documents.length === 1 ? 'Proof Uploaded' : 'Proofs Uploaded'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 rounded-lg border border-white/80 bg-white/70 hover:bg-white/70 hover:border-slate-200 transition-all flex flex-col justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div
                    onClick={() => setSelectedImage(doc)}
                    className="relative w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 cursor-pointer flex items-center justify-center group-hover:ring-2 group-hover:ring-emerald-500 transition-all"
                  >
                    {doc.previewUrl ? (
                      <img
                        src={doc.previewUrl}
                        alt={doc.fileName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-[#475569]" />
                    )}
                    <div className="absolute inset-0 bg-[#0072ff]/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 text-xs">
                    <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{doc.documentType}</span>
                    </div>
                    <p className="text-[#0F172A] font-semibold truncate mt-0.5" title={doc.fileName}>
                      {doc.fileName}
                    </p>
                    <p className="text-[11px] text-[#475569] font-mono mt-0.5">{doc.fileSize}</p>
                  </div>
                </div>

                {doc.description && (
                  <p className="text-[11px] text-[#475569] bg-white/70 p-2 rounded border border-white/80 leading-snug">
                    {doc.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-white/70 border border-white/80 text-xs text-[#475569] text-center">
            No supporting document proof was recorded for this application.
          </div>
        )}

        <p className="text-[11px] text-[#475569] italic pt-1">
          Supporting documents are saved securely for application verification.
        </p>

        {/* Zoom / Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-white/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="bg-white border border-white/80 rounded-lg max-w-2xl w-full p-4 space-y-4 shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/80">
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A]">{selectedImage.fileName}</h4>
                  <p className="text-xs text-emerald-600 font-semibold">{selectedImage.documentType} • {selectedImage.fileSize}</p>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-1.5 rounded-md text-[#475569] hover:text-[#0F172A] hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-auto rounded-xl bg-white flex items-center justify-center p-2">
                {selectedImage.previewUrl ? (
                  <img
                    src={selectedImage.previewUrl}
                    alt={selectedImage.fileName}
                    className="max-w-full max-h-[55vh] object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-[#475569] p-8 text-center text-xs">No image preview available</div>
                )}
              </div>

              {selectedImage.description && (
                <div className="p-3 bg-white/70 rounded-lg text-xs text-[#1E293B]">
                  <span className="font-semibold text-[#0F172A]">Description:</span> {selectedImage.description}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
