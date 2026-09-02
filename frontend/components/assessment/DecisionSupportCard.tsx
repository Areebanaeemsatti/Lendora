'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Printer,
  FileText,
  UserCheck,
  Info,
  Check,
  X,
} from 'lucide-react';
import type { LoanStatus } from '@/lib/mockData';

interface DecisionSupportCardProps {
  applicationId?: string;
  status?: LoanStatus;
  onUpdateStatus?: (id: string, status: LoanStatus) => void;
}

export function DecisionSupportCard({
  applicationId,
  status = 'pending',
  onUpdateStatus,
}: DecisionSupportCardProps) {
  const [underwriterNotes, setUnderwriterNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveNotes = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <CardTitle>Underwriting Decision Support &amp; Review</CardTitle>
            <CardDescription>
              Responsible lending framework to assist institutional risk officers
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-2">
          <p className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-600" />
            Decision Support Philosophy:
          </p>
          <p>
            Lendora provides explainable risk assessment metrics to empower human underwriters in evaluating non-traditional credit applicants. The platform does not issue automatic loan approvals or rejections, ensuring responsible and compliant credit stewardship.
          </p>
        </div>

        {/* Underwriter Notes Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-800">
            Risk Officer Evaluation Remarks (Optional)
          </label>
          <textarea
            rows={3}
            value={underwriterNotes}
            onChange={(e) => setUnderwriterNotes(e.target.value)}
            placeholder="Add reviewer notes regarding income verification, utility stability, or borrower interaction..."
            className="w-full text-xs sm:text-sm p-3 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          leftIcon={<Printer className="w-3.5 h-3.5" />}
        >
          Print Underwriting Summary
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          {applicationId && onUpdateStatus && (
            <>
              <Button
                variant={status === 'approved' ? 'success' : 'outline'}
                size="sm"
                onClick={() => onUpdateStatus(applicationId, status === 'approved' ? 'pending' : 'approved')}
                leftIcon={<Check className="w-3.5 h-3.5" />}
              >
                {status === 'approved' ? 'Approved' : 'Approve'}
              </Button>
              <Button
                variant={status === 'rejected' ? 'danger' : 'outline'}
                size="sm"
                onClick={() => onUpdateStatus(applicationId, status === 'rejected' ? 'pending' : 'rejected')}
                leftIcon={<X className="w-3.5 h-3.5" />}
              >
                {status === 'rejected' ? 'Rejected' : 'Reject'}
              </Button>
            </>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSaveNotes}
            leftIcon={isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5" />}
          >
            {isSaved ? 'Remarks Saved' : 'Save Underwriter Remarks'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
