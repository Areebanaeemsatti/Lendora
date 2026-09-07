import React from 'react';
import { User, Wallet, Activity, History, Image as ImageIcon, Shield, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  name: string;
  icon: React.ElementType;
}

export function ApplicationProgress({ currentStep = 1 }: { currentStep?: number }) {
  const steps: Step[] = [
    { id: 1, name: 'Borrower Information', icon: User },
    { id: 2, name: 'Financial Profile', icon: Wallet },
    { id: 3, name: 'Alternative Signals', icon: Activity },
    { id: 4, name: 'Repayment Behavior', icon: History },
    { id: 5, name: 'Supporting Proof', icon: ImageIcon },
    { id: 6, name: 'Optional Credit', icon: Shield },
  ];

  return (
    <div className="border border-zinc-800/80 bg-zinc-900/60 rounded-lg p-4 sm:p-5">
      <div className="flex items-center justify-between max-w-5xl mx-auto overflow-x-auto py-1">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2.5 shrink-0">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200',
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-emerald-500/10 text-emerald-400 ring-2 ring-emerald-500 font-bold'
                      : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="hidden md:block">
                  <p
                    className={cn(
                      'text-xs font-medium tracking-tight',
                      isCurrent
                        ? 'text-zinc-100 font-semibold'
                        : isCompleted
                        ? 'text-emerald-400'
                        : 'text-zinc-500'
                    )}
                  >
                    {step.name}
                  </p>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    'h-[2px] w-4 sm:w-8 md:w-10 mx-1.5 transition-colors',
                    step.id < currentStep ? 'bg-emerald-500' : 'bg-zinc-800'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
