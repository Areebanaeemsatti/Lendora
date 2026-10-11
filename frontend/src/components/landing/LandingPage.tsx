import Link from 'next/link';
import {
  ArrowRight,
  ChartColumn,
  Check,
  FileText,
  Layers,
  Lock,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { LogoMark } from '@/components/layout/LogoMark';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/* Shared primitives — Light Glassmorphism                                     */
/* -------------------------------------------------------------------------- */

/**
 * Canonical card surface for the marketing site. Screenshots specify a soft
 * white glass tile: 80% white, medium backdrop blur, hairline white border,
 * gentle shadow and generous padding on the `#F4F8FB` canvas.
 */
const CARD_SURFACE =
  'rounded-2xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur-md';

function GradientAction({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00c6ff] to-[#0072ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,114,255,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,114,255,0.38)] active:translate-y-0',
        className
      )}
    >
      {children}
    </Link>
  );
}

function GlassAction({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300/60 bg-white/70 px-6 py-3 text-sm font-semibold text-[#0f172a] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-[#0072ff]/40 hover:text-[#0072ff]',
        className
      )}
    >
      {children}
    </Link>
  );
}

function SectionHeading({
  title,
  sub,
}: {
  title: string;
  sub?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-3xl font-extrabold tracking-tight text-[#0f172a] sm:text-4xl">
        {title}
      </h2>
      {sub ? (
        <p className="mt-3 text-base leading-relaxed text-[#475569]">{sub}</p>
      ) : null}
    </div>
  );
}

/** Icon-wrapped feature card used by both the "How It Works" and "Benefits" grids. */
function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className={cn(CARD_SURFACE, 'transition-all hover:-translate-y-1 hover:bg-white/95')}>
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#00c6ff] to-[#0072ff] text-white shadow-[0_6px_18px_rgba(0,114,255,0.28)]">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="mt-5 text-lg font-bold text-[#0f172a]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#475569]">{desc}</p>
    </div>
  );
}

const STEPS = [
  {
    icon: Lock,
    title: '1. Secure Authentication',
    desc: 'Log in securely based on your assigned role (Borrower or Underwriter).',
  },
  {
    icon: ChartColumn,
    title: '2. Review daily activity',
    desc: 'Check recent transactions and payment patterns in a simple, secure way.',
  },
  {
    icon: FileText,
    title: '3. Move forward with clear decisions',
    desc: 'Track loan applications easily and keep the process clear for both borrowers and teams.',
  },
];

const BENEFITS = [
  {
    icon: Users,
    title: 'Inclusive Financial Access',
    desc: 'Designed to support unbanked informal workers and modern financial institutions alike.',
  },
  {
    icon: Check,
    title: 'Clear, fair decisions',
    desc: 'Straightforward review steps that help support responsible lending decisions.',
  },
  {
    icon: ShieldCheck,
    title: 'Role-Based Security',
    desc: 'Secure session management and strict access controls.',
  },
];

/* -------------------------------------------------------------------------- */
/* Landing page                                                                */
/* -------------------------------------------------------------------------- */

export function LandingPage() {
  return (
    <div className="relative min-h-screen text-[#0f172a]">
      {/* ===================== NAVBAR ===================== */}
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Layers className="h-7 w-7 text-[#0072ff]" aria-hidden />
            <span className="text-xl font-extrabold tracking-tight text-[#0f172a]">
              Lendora
            </span>
          </Link>

          <Link
            href="/auth"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0f172a] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1e293b]"
          >
            Sign In
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* ===================== HERO ===================== */}
        <section className="pt-16 text-center sm:pt-24">
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-[#0f172a] sm:text-5xl">
            Simple credit access for everyday borrowers
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#475569]">
            A transparent digital platform helping borrowers and teams review
            applications clearly and fairly.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <GradientAction href="/auth">
              Get Started
              <ArrowRight className="h-4 w-4" aria-hidden />
            </GradientAction>
            <GlassAction href="/auth">Sign In to Portal</GlassAction>
          </div>
        </section>

        {/* ===================== HOW IT WORKS ===================== */}
        <section className="pt-20 sm:pt-24">
          <SectionHeading title="How It Works" />
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {STEPS.map((item) => (
              <FeatureCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                desc={item.desc}
              />
            ))}
          </div>
        </section>

        {/* ===================== KEY PLATFORM BENEFITS ===================== */}
        <section className="pt-20 sm:pt-24">
          <SectionHeading title="Key Platform Benefits" />
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {BENEFITS.map((item) => (
              <FeatureCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                desc={item.desc}
              />
            ))}
          </div>
        </section>

        {/* ===================== FOOTER CTA ===================== */}
        <section className="pt-20 sm:pt-24">
          <div className="rounded-2xl border border-white/60 bg-white/80 px-6 py-12 text-center shadow-sm backdrop-blur-md">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0f172a] sm:text-4xl">
              Ready to Access Lendora?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-[#475569]">
              Enter your mobile number, CNIC, or underwriter credentials to
              enter your portal.
            </p>
            <div className="mt-7 flex justify-center">
              <GradientAction href="/auth">
                Go to Sign In
                <ArrowRight className="h-4 w-4" aria-hidden />
              </GradientAction>
            </div>
          </div>
        </section>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="mt-20 border-t border-white/60 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 px-4 py-10 text-center sm:px-6">
          <div className="flex items-center gap-2">
            <LogoMark className="h-6 w-6" />
            <span className="text-sm font-semibold text-[#0f172a]">
              Lendora Financial Technologies (Private) Limited
            </span>
          </div>
          <p className="text-xs text-[#475569]">
            Role-Based Protected Access • Digital Lending Standards Compliant
          </p>
        </div>
      </footer>
    </div>
  );
}
