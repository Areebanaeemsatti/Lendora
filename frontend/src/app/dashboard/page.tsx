import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardView } from '@/components/dashboard/DashboardView';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardView />
    </ProtectedRoute>
  );
}
