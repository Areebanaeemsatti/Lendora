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
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Supporting Documents &amp; Image Proof</CardTitle>
              <CardDescription>
                Mandatory visual evidence uploaded with this application
              </CardDescription>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
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
                className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all flex flex-col justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div
                    onClick={() => setSelectedImage(doc)}
                    className="relative w-16 h-16 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0 cursor-pointer flex items-center justify-center group-hover:ring-2 group-hover:ring-emerald-500 transition-all"
                  >
                    {doc.previewUrl ? (
                      <img
                        src={doc.previewUrl}
                        alt={doc.fileName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-zinc-500" />
                    )}
                    <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 text-xs">
                    <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{doc.documentType}</span>
                    </div>
                    <p className="text-zinc-100 font-semibold truncate mt-0.5" title={doc.fileName}>
                      {doc.fileName}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-mono mt-0.5">{doc.fileSize}</p>
                  </div>
                </div>

                {doc.description && (
                  <p className="text-[11px] text-zinc-400 bg-zinc-900 p-2 rounded border border-zinc-800 leading-snug">
                    {doc.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 text-center">
            No supporting document proof was recorded for this application.
          </div>
        )}

        <p className="text-[11px] text-zinc-500 italic pt-1">
          Supporting evidence is displayed for reviewer reference. No automated document verification or OCR is performed in this prototype.
        </p>

        {/* Zoom / Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="bg-zinc-950 border border-zinc-800 rounded-lg max-w-2xl w-full p-4 space-y-4 shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div>
                  <h4 className="text-sm font-bold text-zinc-100">{selectedImage.fileName}</h4>
                  <p className="text-xs text-emerald-400 font-semibold">{selectedImage.documentType} • {selectedImage.fileSize}</p>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-auto rounded-xl bg-zinc-950 flex items-center justify-center p-2">
                {selectedImage.previewUrl ? (
                  <img
                    src={selectedImage.previewUrl}
                    alt={selectedImage.fileName}
                    className="max-w-full max-h-[55vh] object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-zinc-400 p-8 text-center text-xs">No image preview available</div>
                )}
              </div>

              {selectedImage.description && (
                <div className="p-3 bg-zinc-900 rounded-lg text-xs text-zinc-300">
                  <span className="font-semibold text-zinc-100">Description:</span> {selectedImage.description}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
