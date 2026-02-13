
import React from 'react';

export const CATEGORIES = {
  expense: [
    'Gıda', 'Ulaşım', 'Kira', 'Faturalar', 'Eğlence', 'Alışveriş', 'Sağlık', 'Eğitim', 'Diğer'
  ],
  income: [
    'Maaş', 'Freelance', 'Yatırım', 'Hediye', 'Satış', 'Diğer'
  ]
};

export const CURRENCY_SYMBOL = '₺';

export const INITIAL_TRANSACTIONS = [
  { id: '1', type: 'income' as const, category: 'Maaş', amount: 45000, date: '2024-05-01', description: 'Mayıs ayı maaşı' },
  { id: '2', type: 'expense' as const, category: 'Kira', amount: 15000, date: '2024-05-02', description: 'Ev kirası' },
  { id: '3', type: 'expense' as const, category: 'Gıda', amount: 2500, date: '2024-05-03', description: 'Market alışverişi' },
  { id: '4', type: 'expense' as const, category: 'Faturalar', amount: 1200, date: '2024-05-05', description: 'Elektrik & Su' },
  { id: '5', type: 'income' as const, category: 'Yatırım', amount: 3000, date: '2024-05-10', description: 'Hisse senedi kar payı' },
];
