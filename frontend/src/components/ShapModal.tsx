'use client';

import React, { useMemo } from 'react';
import { X, TrendingUp, TrendingDown, Scale, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { ShapFeature, ShapValueItem } from '@/types';

export interface ShapModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantName: string;
  altCreditScore: number;
  baseScore?: number;
  shapFeatures?: ShapFeature[];
  shap_values?: ShapValueItem[];
}

export function ShapModal({
  isOpen,
  onClose,
  applicantName,
  altCreditScore,
  baseScore = 520,
  shapFeatures = [],
  shap_values = [],
}: ShapModalProps) {
  if (!isOpen) return null;

  // Normalize incoming SHAP inputs whether provided via shap_values or legacy shapFeatures
  const normalizedFeatures = useMemo(() => {
    const rawList = shap_values && shap_values.length > 0 ? shap_values : shapFeatures;

    return rawList.map((item: any) => {
      const rawName = item.displayName || item.featureName || item.feature_name || item.feature || 'Model Feature';
      const cleanName = String(rawName).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

      const numImpact = typeof item.impact === 'number'
        ? item.impact
        : (typeof item.shap_value === 'number'
          ? item.shap_value
          : (typeof item.shapValue === 'number' ? item.shapValue : 0));

      const isPositive = item.direction
        ? item.direction.toLowerCase() === 'positive'
        : numImpact >= 0;

      const rawValue = item.raw_value ?? item.rawValue ?? '';
      const explanation = item.explanation || item.description || '';
      const category = item.category || (isPositive ? 'Positive Signal' : 'Risk Factor');

      return {
        featureName: cleanName,
        impact: Number(numImpact.toFixed(1)),
        isPositive,
        rawValue,
        explanation,
        category,
      };
    });
  }, [shap_values, shapFeatures]);

  const positiveFeatures = normalizedFeatures.filter((f) => f.impact > 0 || f.isPositive);
  const negativeFeatures = normalizedFeatures.filter((f) => f.impact < 0 || !f.isPositive);

  const totalPositive = Math.round(
    positiveFeatures.reduce((sum, f) => sum + Math.max(0, f.impact), 0) * 10
  ) / 10;
  const totalNegative = Math.round(
    Math.abs(negativeFeatures.reduce((sum, f) => sum + Math.min(0, f.impact), 0)) * 10
  ) / 10;

  const maxImpact = Math.max(
    ...normalizedFeatures.map((f) => Math.abs(f.impact)),
    1
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl max-h-[92vh] flex flex-col bg-white/70 border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <CardHeader className="bg-white border-b border-white/80 px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-[#0F172A] text-lg font-bold">
                    What Affected Your Score
                  </CardTitle>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-700 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Your details
                  </span>
                </div>
                <p className="text-[#475569] text-xs mt-0.5">{applicantName}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-[#475569] hover:text-[#0F172A] hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 overflow-y-auto space-y-5">
          {/* Score Summary Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
              <p className="text-[11px] text-[#475569] font-semibold uppercase tracking-wider">Starting Score</p>
              <div className="my-1.5">
                <p className="text-2xl sm:text-3xl font-bold font-mono text-[#0F172A]">{baseScore}</p>
              </div>
              <p className="text-[10px] text-[#475569]">Where everyone begins</p>
            </div>

            <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
              <p className="text-[11px] text-[#475569] font-semibold uppercase tracking-wider">Changes From Your Habits</p>
              <div className="my-1.5 flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-600">+{totalPositive}</span>
                <span className="text-[#475569] font-bold">/</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-rose-600">-{totalNegative}</span>
              </div>
              <p className="text-[10px] text-[#475569]">Added and subtracted</p>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 flex flex-col justify-between">
              <p className="text-[11px] text-emerald-600 font-semibold uppercase tracking-wider">Your Credit Score</p>
              <div className="my-1.5">
                <p className="text-2xl sm:text-3xl font-bold font-mono text-emerald-700">{altCreditScore}</p>
              </div>
              <p className="text-[10px] text-emerald-600 font-medium">Score range (300 to 850)</p>
            </div>
          </div>

          {/* Feature Impact Bars */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-1 border-b border-white/80">
              <h3 className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                What Helped and What Hurt
              </h3>
              <span className="text-xs text-[#475569]">
                {normalizedFeatures.length} things we looked at
              </span>
            </div>

            <div className="space-y-3">
              {normalizedFeatures.map((feature, idx) => {
                const isPositive = feature.isPositive || feature.impact >= 0;
                const impactPercent = Math.min(100, Math.max(8, (Math.abs(feature.impact) / maxImpact) * 100));

                return (
                  <div
                    key={`${feature.featureName}-${idx}`}
                    className="bg-slate-100 hover:bg-slate-100 transition-colors rounded-xl p-3.5 border border-slate-200 space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        {isPositive ? (
                          <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                            <TrendingUp className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-md bg-rose-500/20 text-rose-600 flex items-center justify-center shrink-0">
                            <TrendingDown className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div>
                          <span className="text-sm font-semibold text-[#0F172A]">{feature.featureName}</span>
                          {feature.rawValue !== '' && (
                            <span className="ml-2 text-[11px] font-mono text-[#475569] bg-white/70 px-2 py-0.5 rounded border border-slate-200">
                              Value: {String(feature.rawValue)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span className="text-[10px] text-[#475569] uppercase tracking-wider hidden sm:inline">
                          {feature.category}
                        </span>
                        <span
                          className={cn(
                            'text-sm font-bold font-mono px-2 py-0.5 rounded border',
                            isPositive
                              ? 'text-emerald-700 bg-emerald-500/10 border-emerald-500/30'
                              : 'text-rose-700 bg-rose-500/10 border-rose-500/30'
                          )}
                        >
                          {isPositive ? '+' : ''}
                          {feature.impact} pts
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar with Emerald (Positive) or Rose/Amber (Negative) indicator */}
                    <div className="w-full bg-white/60 rounded-full h-2 overflow-hidden border border-slate-200">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-700 ease-out',
                          isPositive
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : 'bg-gradient-to-r from-rose-500 to-amber-500'
                        )}
                        style={{ width: `${impactPercent}%` }}
                      />
                    </div>

                    {feature.explanation && (
                      <p className="text-xs text-[#475569] leading-relaxed pt-0.5">
                        {feature.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanatory Footer */}
          <div className="p-4 bg-white/60 rounded-xl border border-white/80 text-xs text-[#475569] space-y-1.5">
            <div className="flex items-center gap-2 text-[#1E293B] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Understanding Your Score Factors</span>
            </div>
            <p className="leading-relaxed">
              <strong className="text-emerald-600">Emerald indicators</strong> show positive financial habits that strengthen your score, reflecting active mobile wallet usage and consistent bill payments.
              <strong className="text-rose-600"> Red or amber indicators</strong> highlight areas that reduce your score, such as higher existing commitments or limited payment records.
            </p>
          </div>
        </CardContent>

        <div className="bg-white border-t border-white/80 px-4 py-3 flex justify-end shrink-0">
          <Button type="button" variant="primary" size="sm" onClick={onClose}>
            Done Reviewing
          </Button>
        </div>
      </Card>
    </div>
  );
}
