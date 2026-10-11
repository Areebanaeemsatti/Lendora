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
    { id: 1, name: 'Basic Info', icon: User },
    { id: 2, name: 'Monthly Budget', icon: Wallet },
    { id: 3, name: 'Digital Activity', icon: Activity },
    { id: 4, name: 'Payment History', icon: History },
    { id: 5, name: 'Documents', icon: ImageIcon },
    { id: 6, name: 'Bank History', icon: Shield },
  ];

  return (
    <div className="border border-white/80 bg-white/70 rounded-lg p-4 sm:p-5">
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
                      ? 'bg-emerald-500/10 text-emerald-600 ring-2 ring-emerald-500 font-bold'
                      : 'bg-slate-100 text-[#475569] border border-slate-200'
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="hidden md:block">
                  <p
                    className={cn(
                      'text-xs font-medium tracking-tight',
                      isCurrent
                        ? 'text-[#0F172A] font-semibold'
                        : isCompleted
                        ? 'text-emerald-600'
                        : 'text-[#475569]'
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
                    step.id < currentStep ? 'bg-emerald-500' : 'bg-slate-100'
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
