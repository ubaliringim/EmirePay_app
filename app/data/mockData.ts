import { faker } from '@faker-js/faker';

faker.seed(123);

const statuses = ['Successful', 'Pending', 'Failed'] as const;
const serviceTypes = ['Airtime', 'Data', 'Electricity', 'Cable TV', 'Education PIN', 'Wallet Funding'] as const;

export const generateTransactions = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `TXN${faker.string.alphanumeric(10).toUpperCase()}`,
    type: faker.helpers.arrayElement(serviceTypes),
    amount: parseFloat(faker.finance.amount({ min: 100, max: 50000, dec: 2 })),
    status: faker.helpers.arrayElement(statuses),
    date: faker.date.recent({ days: 30 }).toISOString(),
    recipient: faker.helpers.arrayElement([
      faker.string.numeric('080########'),
      faker.string.alphanumeric(10).toUpperCase(),
      faker.person.fullName(),
    ]),
    reference: `REF${faker.string.alphanumeric(12).toUpperCase()}`,
  }));
};

export const MOCK_USER = {
  id: 'USR001',
  fullName: 'Emiru Ibrahim',
  email: 'emiru.ibrahim@example.com',
  phone: '08012345678',
  walletBalance: 24500.00,
  virtualAccountNumber: '0123456789',
  virtualAccountBank: 'Wema Bank',
};

export const MOCK_TRANSACTIONS = generateTransactions(20);

export const formatCurrency = (amount: number) => {
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
