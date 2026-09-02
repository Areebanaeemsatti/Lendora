import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingUp,
  SlidersHorizontal,
} from 'lucide-react';

export function AssessmentSummaryCard() {
  // Static mock assessment metrics for UI demonstration
  const mockScore = 742;
  const mockMaxScore = 850;
  const mockDefaultRisk = '4.2%';
  const mockTier = 'Tier A • Low Estimated Default Risk';

  const positiveSignals = [
    'Consistent high-frequency mobile wallet velocity (20+ tx/mo across Easypaisa & JazzCash)',
    'Strong utility payment compliance (90%+ on-time DISCO settlement)',
    'Stable estimated cashflow surplus relative to requested financing',
    'Favorable qualitative repayment history with past suppliers',
  ];

  const keyRiskFactors = [
    'Absence of formal commercial bank statement records (informal economy profile)',
    'Seasonal vulnerability in wholesale retail turnover',
    'Limited multi-year formal credit bureau (eCIB) history',
  ];

  return (
    <Card className="border-slate-300 shadow-sm overflow-hidden">
      {/* Prominent Demo Notice Header */}
      <div className="bg-amber-500/10 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
        <div className="flex items-center gap-2 font-semibold">
          <Info className="w-4 h-4 text-amber-700" />
          <span>Demo Assessment — ML model not connected</span>
        </div>
        <span className="text-[11px] font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
          UI Mock Presentation
        </span>
      </div>

      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <CardTitle>Informal Creditworthiness Scorecard</CardTitle>
          </div>
          <Badge variant="outline">Decision Support Preview</Badge>
        </div>
        <CardDescription>
          AI underwriting scorecard demonstration evaluating alternative financial behavior
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score & Risk Visual Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-950 text-white shadow-inner">
          <div className="sm:col-span-2 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Informal Creditworthiness Score (Mock)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-bold font-mono text-white">
                {mockScore}
              </span>
              <span className="text-sm font-medium text-slate-400 font-sans">
                / {mockMaxScore}
              </span>
            </div>

            {/* Score Visual Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2.5 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                style={{ width: `${(mockScore / mockMaxScore) * 100}%` }}
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {mockTier}
            </div>
          </div>

          <div className="flex flex-col justify-center sm:border-l sm:border-slate-800 sm:pl-4 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">
              Estimated Default Risk
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
              {mockDefaultRisk}
            </span>
            <span className="text-[10px] text-slate-400">
              Baseline regional benchmark
            </span>
          </div>
        </div>

        {/* Positive Signals & Risk Factors Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Positive Financial Signals */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Positive Financial Signals (Mock Attribution)</span>
            </div>
            <ul className="space-y-1.5 text-xs text-emerald-950">
              {positiveSignals.map((sig, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-0.5">•</span>
                  <span className="leading-snug">{sig}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Risk Factors */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Key Risk Considerations (Mock Attribution)</span>
            </div>
            <ul className="space-y-1.5 text-xs text-amber-950">
              {keyRiskFactors.map((risk, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">•</span>
                  <span className="leading-snug">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
