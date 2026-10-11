'use client';

import React, { useState } from 'react';
import { Bell, Lock, Moon, Trash2, Wallet } from 'lucide-react';

interface ToggleSetting {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  group: 'notifications' | 'privacy';
  title: string;
  description: string;
  defaultOn: boolean;
}

const SETTINGS: ToggleSetting[] = [
  {
    id: 'payment-reminders',
    icon: Bell,
    group: 'notifications',
    title: 'Payment reminders',
    description: 'Get a reminder before each instalment is due.',
    defaultOn: true,
  },
  {
    id: 'offers',
    icon: Wallet,
    group: 'notifications',
    title: 'Offers & cashback',
    description: 'Hear about new limits, top-ups and cashback deals.',
    defaultOn: true,
  },
  {
    id: 'quiet-hours',
    icon: Moon,
    group: 'notifications',
    title: 'Quiet hours',
    description: 'Only notify between 9am and 9pm.',
    defaultOn: false,
  },
  {
    id: 'profile-discovery',
    icon: Lock,
    group: 'privacy',
    title: 'Profile discovery',
    description: 'Allow friends with your number to find you.',
    defaultOn: false,
  },
  {
    id: 'personalised-tips',
    icon: Bell,
    group: 'privacy',
    title: 'Personalised tips',
    description: 'Use your activity to tailor repayment tips.',
    defaultOn: true,
  },
];

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? 'bg-[#0072ff]' : 'bg-slate-300'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

/**
 * Settings tab: notification + privacy preferences (local to this session —
 * purged automatically on logout or CNIC switch along with everything else).
 */
export function SettingsTab() {
  const [settings, setSettings] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SETTINGS.map((s) => [s.id, s.defaultOn]))
  );

  const groups = [
    { key: 'notifications' as const, title: 'Notifications', blurb: 'What we notify you about.' },
    { key: 'privacy' as const, title: 'Privacy', blurb: 'How your data is used.' },
  ];

  return (
    <div className="space-y-5">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Settings</h1>
        <p className="mt-1 text-sm text-[#475569]">
          Choose what you hear about and how your data is used.
        </p>
      </div>

      {groups.map((group) => (
        <section key={group.key} className="glass overflow-hidden rounded-3xl">
          <div className="border-b border-white/70 px-6 py-4">
            <h2 className="text-base font-bold text-[#0F172A]">{group.title}</h2>
            <p className="mt-0.5 text-xs text-[#475569]">{group.blurb}</p>
          </div>
          <ul>
            {SETTINGS.filter((s) => s.group === group.key).map((setting) => {
              const Icon = setting.icon;
              return (
                <li
                  key={setting.id}
                  className="flex items-center justify-between gap-4 border-b border-slate-50 px-6 py-4 last:border-b-0"
                >
                  <span className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#0072ff]/10 text-[#0072ff]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-[#0F172A]">
                        {setting.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-[#475569]">
                        {setting.description}
                      </span>
                    </span>
                  </span>
                  <Toggle
                    checked={settings[setting.id]}
                    label={setting.title}
                    onChange={(next) =>
                      setSettings((prev) => ({ ...prev, [setting.id]: next }))
                    }
                  />
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {/* Danger-free data control */}
      <section className="glass rounded-3xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Trash2 className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-[#0F172A]">Clear my data</h2>
              <p className="mt-0.5 text-xs text-[#475569]">
                Signs you out and removes every trace of your session from this device.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}