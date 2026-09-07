import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Sparkles, CheckCircle2, ShieldCheck, Clock, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function ModelHealthWidget() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* AI Underwriting Engine Card */}
      <Card className="lg:col-span-2 border-emerald-500/20 bg-emerald-500/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Lendora Underwriting Engine</CardTitle>
                <CardDescription>AI Risk Model Pipeline Architecture</CardDescription>
              </div>
            </div>
            <Badge variant="emerald" dot>
              Architecture Ready
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-zinc-400 leading-relaxed">
            The frontend foundation is structured to integrate downstream ML scoring models, SHAP explainability matrices, and regional borrower data pipelines (e.g. NADRA CNIC validation, utility cashflow, and telco transaction telemetry).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Frontend Shell</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">Modular App Router + Tailwind layout</p>
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-100">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Borrower Form</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">Ready for upcoming intake chunk</p>
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-100">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span>ML & SHAP Layer</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">Decoupled for team backend handoff</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Market Information */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Underwriting Desk</CardTitle>
          <CardDescription>Pakistan Market Configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
            <span className="text-zinc-500">Jurisdiction</span>
            <span className="font-semibold text-zinc-200">Pakistan (SECP / SBP Compliance)</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
            <span className="text-zinc-500">Base Currency</span>
            <span className="font-semibold text-zinc-200">Pakistani Rupee (₨ PKR)</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
            <span className="text-zinc-500">Supported Segments</span>
            <span className="font-semibold text-zinc-200">SME, Retail, Freelancers</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">Scoring Engine</span>
            <span className="font-semibold text-emerald-400">Lendora-Risk-v1</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
