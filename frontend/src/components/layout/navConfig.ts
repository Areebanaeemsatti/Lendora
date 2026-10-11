export interface NavItem {
  title: string;
  href: string;
}

/**
 * Primary navigation for the consumer app shell:
 * Logo · Home / Dashboard · Transactions · Profile · Settings
 * (Notifications bell and avatar menu live in the header.)
 */
export const NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Transactions', href: '/dashboard#transactions' },
  { title: 'Profile', href: '/dashboard#profile' },
  { title: 'Settings', href: '/dashboard#settings' },
];
