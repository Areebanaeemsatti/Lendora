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
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Portfolio Overview KPIs */}
      <PortfolioStats />

      {/* Recent Underwriting Queue */}
      <RecentAssessmentsTable />

      {/* Model Health & Architecture Overview */}
      <ModelHealthWidget />
    </AppLayout>
  );
}
