export interface NavItem {
  title: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'New Application', href: '/new-application' },
  { title: 'Risk Assessments', href: '/risk-assessments' },
  { title: 'Telecom / Utility', href: '/telecom-feed' },
];
