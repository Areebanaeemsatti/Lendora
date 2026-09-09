export interface NavItem {
  title: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { title: 'Overview', href: '/dashboard' },
  { title: 'New Applicant', href: '/new-application' },
  { title: 'Loan Risk Checks', href: '/risk-assessments' },
  { title: 'Payment History Feed', href: '/telecom-feed' },
];

