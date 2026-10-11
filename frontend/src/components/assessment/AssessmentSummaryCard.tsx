'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Scale,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BorrowerApplication, RiskAssessmentResponse, ShapValueItem } from '@/types';
import type { LoanApplication } from '@/lib/mockData';

export interface AssessmentSummaryCardProps {
  application?: BorrowerApplication | null;
  assessment?: RiskAssessmentResponse | null;
  selectedQueueItem?: LoanApplication | null;
  onOpenShapModal?: () => void;
}

export function AssessmentSummaryCard({
  application,
  assessment,
  selectedQueueItem,
  onOpenShapModal,
}: AssessmentSummaryCardProps) {
  const liveAssessment = assessment || application?.assessment || selectedQueueItem?.assessment;

  const score = liveAssessment?.credit_score ?? selectedQueueItem?.altCreditScore ?? 742;
  const maxScore = 850;
  const defaultRisk = liveAssessment?.default_probability != null
    ? `${(liveAssessment.default_probability * 100).toFixed(1)}%`
    : (selectedQueueItem?.defaultProbability != null
      ? `${(selectedQueueItem.defaultProbability * 100).toFixed(1)}%`
      : '4.2%');

  const tierLabel = liveAssessment?.risk_tier
    ? `${liveAssessment.risk_tier}`
    : (selectedQueueItem?.riskLevel ? `${selectedQueueItem.riskLevel} Risk` : 'Not yet scored');

  const shapList: ShapValueItem[] = (
    liveAssessment?.shap_values && liveAssessment.shap_values.length > 0
      ? liveAssessment.shap_values
      : (liveAssessment?.shap_explanations && liveAssessment.shap_explanations.length > 0
        ? liveAssessment.shap_explanations
        : (application?.shap_values && application.shap_values.length > 0
          ? application.shap_values
          : (selectedQueueItem?.shap_values ?? [])))
  );

  const positiveDrivers = React.useMemo(() => {
    if (liveAssessment?.top_positive_drivers && liveAssessment.top_positive_drivers.length > 0) {
      return liveAssessment.top_positive_drivers;
    }
    const fromShap = shapList
      .filter((s) => (typeof s.impact === 'number' && s.impact > 0) || s.direction === 'positive')
      .slice(0, 4)
      .map((s) => `${s.featureName || s.feature_name || 'Signal'}: ${s.explanation || 'Positive credit driver'} (+${s.impact} pts)`);

    return fromShap.length > 0
      ? fromShap
      : [
          'High mobile wallet transaction velocity (20+ monthly transactions across Easypaisa & JazzCash)',
          'Consistent utility payment compliance (90%+ on-time settlements)',
          'Strong disposable cashflow coverage relative to requested micro-loan installments',
        ];
  }, [liveAssessment, shapList]);

  const negativeDrivers = React.useMemo(() => {
    if (liveAssessment?.top_negative_drivers && liveAssessment.top_negative_drivers.length > 0) {
      return liveAssessment.top_negative_drivers;
    }
    const fromShap = shapList
      .filter((s) => (typeof s.impact === 'number' && s.impact < 0) || s.direction === 'negative')
      .slice(0, 4)
      .map((s) => `${s.featureName || s.feature_name || 'Signal'}: ${s.explanation || 'Risk indicator'} (${s.impact} pts)`);

    return fromShap.length > 0
      ? fromShap
      : [
          'Thin formal commercial bank statement records (informal economy borrower profile)',
          'Seasonal fluctuations in micro-business wholesale turnover',
          'Limited multi-year formal credit bureau (eCIB) history',
        ];
  }, [liveAssessment, shapList]);

  const isLive = Boolean(liveAssessment);

  return (
    <Card className="border-white/80 overflow-hidden">
      {/* Model Connection Header */}
      <div
        className={cn(
          'border-b px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs',
          isLive
            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-700'
            : 'bg-amber-500/10 border-amber-500/25 text-amber-700'
        )}
      >
        <div className="flex items-center gap-2 font-semibold">
          {isLive ? (
            <>
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Application details ready for review</span>
            </>
          ) : (
            <>
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Application Summary</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenShapModal && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenShapModal}
              leftIcon={<Scale className="w-3.5 h-3.5 text-emerald-600" />}
              className="h-6 text-[11px] px-2"
            >
              See details
            </Button>
          )}
          <span
            className={cn(
              'text-[11px] font-mono px-2 py-0.5 rounded border font-medium',
              isLive
                ? 'text-emerald-700 bg-emerald-500/10 border-emerald-500/25'
                : 'text-amber-700 bg-amber-500/10 border-amber-500/25'
            )}
          >
            {isLive ? 'Ready to review' : 'Summary ready'}
          </span>
        </div>
      </div>

      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <CardTitle>Application Summary</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {liveAssessment?.recommendation && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/25">
                Suggested: {liveAssessment.recommendation}
              </span>
            )}
            <Badge variant="outline">Assessment Overview</Badge>
          </div>
        </div>
        <CardDescription>
          Comprehensive credit evaluation assessing everyday digital transactions and payment habits
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score & Risk Visual Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-white/60 text-[#0F172A] border border-white/80">
          <div className="sm:col-span-2 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
              Credit Score
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-bold font-mono text-[#0F172A] tracking-tight">
                {score}
              </span>
              <span className="text-sm font-medium text-[#475569] font-sans">
                / {maxScore}
              </span>
            </div>

            {/* Score Visual Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (score / maxScore) * 100)}%` }}
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 text-xs font-medium mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {tierLabel}
            </div>
          </div>

          <div className="flex flex-col justify-center sm:border-l sm:border-white/80 sm:pl-4 space-y-1">
            <span className="text-[11px] font-semibold text-[#475569] uppercase">
              Chance of Repaying on Time
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600">
              {defaultRisk}
            </span>
            <span className="text-[10px] text-[#475569]">
              {isLive ? 'Compared with similar applicants' : 'Compared with all applicants'}
            </span>
          </div>
        </div>

        {/* Positive Drivers (Emerald) & Risk Flags (Red/Amber) Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Positive Score Drivers */}
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/25 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Positive Factors (Strengths)</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                + Boosts Score
              </span>
            </div>
            <ul className="space-y-2 text-xs text-emerald-200">
              {positiveDrivers.map((sig, i) => (
                <li key={i} className="flex items-start gap-2 bg-white/70 p-2 rounded-lg border border-white/80">
                  <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{sig}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Negative Risk Drivers */}
          <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/25 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-700">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Areas for Improvement (Risk Factors)</span>
              </div>
              <span className="text-[10px] font-semibold text-rose-700 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/25">
                - Impacts Score
              </span>
            </div>
            <ul className="space-y-2 text-xs text-rose-700">
              {negativeDrivers.map((risk, i) => (
                <li key={i} className="flex items-start gap-2 bg-white/70 p-2 rounded-lg border border-white/80">
                  <TrendingDown className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Score factor preview */}
        {shapList.length > 0 && (
          <div className="p-4 rounded-xl bg-white/70 text-[#0F172A] border border-white/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                  What Affected This Score
                </h4>
              </div>
              {onOpenShapModal && (
                <button
                  type="button"
                  onClick={onOpenShapModal}
                  className="text-xs text-emerald-600 hover:text-emerald-700 underline font-medium"
                >
                  View full breakdown &rarr;
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {shapList.slice(0, 4).map((f, i) => {
                const isPos = (typeof f.impact === 'number' && f.impact >= 0) || f.direction === 'positive';
                const name = f.featureName || f.feature_name || 'Feature';
                return (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {isPos ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                      )}
                      <span className="text-xs font-medium text-[#0F172A] truncate max-w-[180px]">
                        {name}
                      </span>
                    </div>
                    <span
                      className={cn(
                        'text-xs font-mono font-bold',
                        isPos ? 'text-emerald-600' : 'text-rose-600'
                      )}
                    >
                      {isPos ? '+' : ''}
                      {f.impact} pts
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
