import { AppLayout } from '@/components/layout/AppLayout';
import { HeroCarousel } from './HeroCarousel';
import { PortfolioStats } from './PortfolioStats';
import { RecentAssessmentsTable } from './RecentAssessmentsTable';
import { ModelHealthWidget } from './ModelHealthWidget';

/**
 * Shared dashboard composition, rendered by the protected `/dashboard` route.
 */
export function DashboardView() {
  return (
    <AppLayout>
      {/* 1. Executive Portfolio KPIs */}
      <PortfolioStats />

      {/* 2. Recent Underwriting Queue */}
      <RecentAssessmentsTable />

      {/* 3. Model Health & Architecture Telemetry */}
      <ModelHealthWidget />

      {/* 4. Platform Capabilities Overview Banner */}
      <HeroCarousel />
    </AppLayout>
  );
}

