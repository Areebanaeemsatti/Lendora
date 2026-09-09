'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
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
  const { toast } = useToast();

  const handleSaveNotes = () => {
    setIsSaved(true);
    toast({
      type: 'success',
      title: 'Remarks Saved',
      description: 'Underwriting evaluation notes persisted to borrower record.',
    });
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleStatusChange = (nextStatus: LoanStatus) => {
    if (!applicationId || !onUpdateStatus) return;
    const target = status === nextStatus ? 'pending' : nextStatus;
    onUpdateStatus(applicationId, target);

    if (target === 'approved') {
      toast({
        type: 'success',
        title: 'Loan Approved',
        description: `Application ${applicationId} cleared for disbursement.`,
      });
    } else if (target === 'rejected') {
      toast({
        type: 'error',
        title: 'Loan Declined',
        description: `Application ${applicationId} marked as declined.`,
      });
    } else {
      toast({
        type: 'info',
        title: 'Status Reset',
        description: `Application ${applicationId} returned to pending review.`,
      });
    }
  };

  return (
    <Card className="border-zinc-800/80">
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 text-white flex items-center justify-center font-bold">
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
        <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 leading-relaxed space-y-2">
          <p className="font-semibold text-zinc-200 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-zinc-500" />
            Decision Support Philosophy:
          </p>
          <p>
            Lendora provides explainable risk assessment metrics to empower human underwriters in evaluating non-traditional credit applicants. The platform does not issue automatic loan approvals or rejections, ensuring responsible and compliant credit stewardship.
          </p>
        </div>

        {/* Underwriter Notes Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">
            Risk Officer Evaluation Remarks (Optional)
          </label>
          <textarea
            rows={3}
            value={underwriterNotes}
            onChange={(e) => setUnderwriterNotes(e.target.value)}
            placeholder="Add reviewer notes regarding income verification, utility stability, or borrower interaction..."
            className="w-full text-xs sm:text-sm p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
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
                onClick={() => handleStatusChange('approved')}
                leftIcon={<Check className="w-3.5 h-3.5" />}
              >
                {status === 'approved' ? 'Approved' : 'Approve Application'}
              </Button>
              <Button
                variant={status === 'rejected' ? 'danger' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange('rejected')}
                leftIcon={<X className="w-3.5 h-3.5" />}
              >
                {status === 'rejected' ? 'Declined' : 'Reject Application'}
              </Button>
            </>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSaveNotes}
            leftIcon={isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5" />}
          >
            {isSaved ? 'Remarks Saved' : 'Save Remarks'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

