'use client';

import React from 'react';
import { X, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { ShapFeature } from '@/types';

interface ShapModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantName: string;
  altCreditScore: number;
  baseScore: number;
  shapFeatures: ShapFeature[];
}

export function ShapModal({
  isOpen,
  onClose,
  applicantName,
  altCreditScore,
  baseScore,
  shapFeatures,
}: ShapModalProps) {
  if (!isOpen) return null;

  const positiveFeatures = shapFeatures.filter((f) => f.impact > 0);
  const negativeFeatures = shapFeatures.filter((f) => f.impact < 0);
  const totalPositive = positiveFeatures.reduce((sum, f) => sum + f.impact, 0);
  const totalNegative = Math.abs(negativeFeatures.reduce((sum, f) => sum + f.impact, 0));

  const maxImpact = Math.max(
    ...shapFeatures.map((f) => Math.abs(f.impact)),
    1
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-slate-900 border-slate-700 shadow-2xl">
        <CardHeader className="bg-slate-950 border-b border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-emerald-400" />
              <div>
                <CardTitle className="text-white text-lg">SHAP Credit Score Explainability</CardTitle>
                <p className="text-slate-400 text-xs mt-0.5">{applicantName}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto">
          {/* Score Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Base Score</p>
              <p className="text-2xl font-bold text-slate-300">{baseScore}</p>
              <p className="text-[10px] text-slate-500 mt-1">Starting point</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Feature Impact</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-400">+{totalPositive}</span>
                <span className="text-slate-500">/</span>
                <span className="text-sm font-bold text-rose-400">-{totalNegative}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">SHAP adjustments</p>
            </div>
            <div className="bg-emerald-950/30 rounded-lg p-4 border border-emerald-800/50">
              <p className="text-xs text-emerald-400 uppercase tracking-wider mb-1">Final Score</p>
              <p className="text-2xl font-bold text-emerald-400">{altCreditScore}</p>
              <p className="text-[10px] text-emerald-600 mt-1">Alt Credit Score</p>
            </div>
          </div>

          {/* Feature Impact Bars */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Feature Impact Breakdown
            </h3>

            <div className="space-y-3">
              {shapFeatures.map((feature) => {
                const isPositive = feature.impact > 0;
                const impactPercent = (Math.abs(feature.impact) / maxImpact) * 100;
                
                return (
                  <div key={feature.featureName} className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {isPositive ? (
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-rose-400" />
                        )}
                        <span className="text-sm font-medium text-slate-200">{feature.featureName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{feature.category}</span>
                        <span
                          className={cn(
                            'text-sm font-bold',
                            isPositive ? 'text-emerald-400' : 'text-rose-400'
                          )}
                        >
                          {isPositive ? '+' : ''}{feature.impact}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          isPositive ? 'bg-emerald-500' : 'bg-rose-500'
                        )}
                        style={{ width: `${impactPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation Footer */}
          <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300">SHAP Values</span> show how each feature contributed to the final credit score.
              <span className="text-emerald-400 font-medium"> Green bars</span> indicate positive contributions that increased the score,
              while <span className="text-rose-400 font-medium"> red bars</span> show negative factors that decreased it.
              The Base Score represents the average score across all applicants, with adjustments made based on individual characteristics.
            </p>
          </div>
        </CardContent>

        <div className="bg-slate-950 border-t border-slate-800 px-6 py-4 flex justify-end">
          <Button type="button" variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}