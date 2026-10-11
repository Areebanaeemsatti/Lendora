/**
 * Deterministic, CNIC-seeded demo data for the consumer dashboard.
 *
 * Everything here is derived from the signed-in CNIC, so every identity sees
 * its own isolated numbers (balance, transactions, profile hints) and nothing
 * is shared across accounts. No network calls — presentation-only demo data.
 */

export type TransactionCategory = 'disbursement' | 'repayment' | 'fee' | 'topup';
export type TransactionStatus = 'completed' | 'pending';

export interface ConsumerTransaction {
  id: string;
  title: string;
  /** Positive = money in, negative = money out (PKR) */
  amount: number;
  /** ISO date string */
  date: string;
  category: TransactionCategory;
  status: TransactionStatus;
}

export interface ConsumerProfile {
  name: string;
  /** Formatted, masked CNIC — 35202-******-1 */
  maskedCnic: string;
  phone: string;
  email: string;
  city: string;
  memberSince: string;
}

export interface WalletSummary {
  availableCredit: number;
  outstandingBalance: number;
  nextPaymentAmount: number;
  /** ISO date */
  nextPaymentDue: string;
  activeLoans: number;
  completedLoans: number;
}

/* ------------------------------------------------------------------ */
/* Seeded PRNG (mulberry32) — same CNIC always yields same data        */
/* ------------------------------------------------------------------ */

function seedFromCnic(cnic: string): number {
  let h = 2166136261;
  for (let i = 0; i < cnic.length; i++) {
    h ^= cnic.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function roundTo(value: number, step: number): number {
  return Math.max(step, Math.round(value / step) * step);
}

function daysAgoISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function daysAheadISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

/* ------------------------------------------------------------------ */
/* Public API                                                         */
/* ------------------------------------------------------------------ */

export function getConsumerProfile(cnic: string, name?: string): ConsumerProfile {
  const rand = mulberry32(seedFromCnic(cnic + ':profile'));
  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar'];
  const city = cities[Math.floor(rand() * cities.length)];
  const digits = cnic.replace(/\D/g, '').padStart(13, '0');
  const joinedYear = 2021 + Math.floor(rand() * 4);
  const joinedMonth = 1 + Math.floor(rand() * 12);

  const display = (name || '').trim();
  return {
    name: display.length > 0 ? display : 'Lendora Customer',
    maskedCnic: `${digits.slice(0, 5)}-******-${digits.slice(12)}`,
    phone: `03${Math.floor(10 + rand() * 89)}-${String(Math.floor(1000000 + rand() * 8999999))}`,
    email: `customer${digits.slice(-4)}@example.pk`,
    city,
    memberSince: `${String(joinedMonth).padStart(2, '0')}/${joinedYear}`,
  };
}

export function getWalletSummary(cnic: string): WalletSummary {
  const rand = mulberry32(seedFromCnic(cnic + ':wallet'));
  const limit = roundTo(60000 + rand() * 190000, 5000);
  const usedRatio = 0.15 + rand() * 0.5;
  const outstanding = roundTo(limit * usedRatio, 100);
  const nextPayment = roundTo(outstanding / (2 + Math.floor(rand() * 5)), 100);

  return {
    availableCredit: limit - outstanding,
    outstandingBalance: outstanding,
    nextPaymentAmount: nextPayment,
    nextPaymentDue: daysAheadISO(3 + Math.floor(rand() * 20)),
    activeLoans: 1 + Math.floor(rand() * 2),
    completedLoans: 2 + Math.floor(rand() * 6),
  };
}

const TRANSACTION_TITLES: Record<TransactionCategory, string[]> = {
  disbursement: ['Cash loan disbursed', 'Salary advance disbursed', 'Quick loan disbursed'],
  repayment: ['Monthly repayment', 'Instalment repayment', 'Early repayment'],
  fee: ['Processing fee', 'Late payment charge', 'Insurance charge'],
  topup: ['Wallet top-up', 'Cashback credited', 'Refund credited'],
};

export function getTransactions(cnic: string): ConsumerTransaction[] {
  const rand = mulberry32(seedFromCnic(cnic + ':tx'));
  const txs: ConsumerTransaction[] = [];
  const categories: TransactionCategory[] = ['disbursement', 'repayment', 'fee', 'topup'];

  for (let i = 0; i < 16; i++) {
    const category = categories[Math.floor(rand() * categories.length)];
    const titles = TRANSACTION_TITLES[category];
    const title = titles[Math.floor(rand() * titles.length)];
    const isIn = category === 'disbursement' || category === 'topup';
    const magnitude =
      category === 'disbursement'
        ? roundTo(8000 + rand() * 60000, 500)
        : category === 'repayment'
          ? roundTo(2000 + rand() * 15000, 100)
          : category === 'topup'
            ? roundTo(500 + rand() * 5000, 100)
            : roundTo(150 + rand() * 1200, 50);

    txs.push({
      id: `TX-${cnic.slice(-4)}-${String(1000 + i)}`,
      title,
      amount: isIn ? magnitude : -magnitude,
      date: daysAgoISO(Math.floor(rand() * 75)),
      category,
      status: rand() > 0.85 ? 'pending' : 'completed',
    });
  }

  return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Compact "+PKR 12,345" formatting used in transaction lists. */
export function formatAmount(value: number): string {
  const sign = value < 0 ? '-' : value > 0 ? '+' : '';
  const abs = Math.abs(value);
  return `${sign}PKR ${abs.toLocaleString('en-PK')}`;
}

/** Plain "PKR 12,345" (no sign) for balances. */
export function formatBalance(value: number): string {
  return `PKR ${Math.round(value).toLocaleString('en-PK')}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
