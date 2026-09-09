import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Sparkles, CheckCircle2, Clock, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function ModelHealthWidget() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Smart Scoring Engine Card */}
      <Card className="lg:col-span-2 border-emerald-500/20 bg-emerald-500/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Smart Scoring &amp; System Reliability</CardTitle>
                <CardDescription>How our system evaluates applicant information</CardDescription>
              </div>
            </div>
            <Badge variant="emerald" dot>
              System Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-zinc-400 leading-relaxed">
            Lendora analyzes mobile wallet transactions (Easypaisa &amp; JazzCash), utility bill payment discipline, and monthly cashflow to calculate fair credit scores for informal and thin-file Pakistani applicants.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Data Processing</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">Real-time payment history checks</p>
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-100">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Applicant Form</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">Instant credit score estimation</p>
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-100">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span>Clear Explanations</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">Simple breakdown of score factors</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Market Information */}
      <Card>
        <CardHeader>
          <CardTitle>System &amp; Market Setup</CardTitle>
          <CardDescription>Pakistan Market Configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
            <span className="text-zinc-500">Region</span>
            <span className="font-semibold text-zinc-200">Pakistan</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
            <span className="text-zinc-500">Currency</span>
            <span className="font-semibold text-zinc-200">Pakistani Rupee (₨ PKR)</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
            <span className="text-zinc-500">Supported Applicants</span>
            <span className="font-semibold text-zinc-200">Shopkeepers, Artisans, SMEs</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">Scoring Engine</span>
            <span className="font-semibold text-emerald-400">Lendora-Smart-v1</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

