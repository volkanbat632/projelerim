
import React, { useState, useEffect } from 'react';
import { Transaction } from './types';
import { INITIAL_TRANSACTIONS } from './constants';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import VoiceAssistant from './components/VoiceAssistant';
import MarketAnalysis from './components/MarketAnalysis';
import { getFinancialInsights } from './services/geminiService';
import { formatCurrency, formatDate } from './utils/helpers';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...t, id: Math.random().toString(36).substr(2, 9) };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const generateInsights = async () => {
    setLoadingInsights(true);
    try {
      const insight = await getFinancialInsights(transactions);
      setAiInsights(insight || "Henüz analiz yapılamadı.");
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInsights(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-0">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">FinansAsistan AI</h1>
          </div>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            İşlem Ekle
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Dashboard & Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <Dashboard transactions={transactions} />
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">İşlem Geçmişi</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Tarih</th>
                      <th className="px-6 py-3 font-semibold">Kategori</th>
                      <th className="px-6 py-3 font-semibold">Açıklama</th>
                      <th className="px-6 py-3 font-semibold text-right">Miktar</th>
                      <th className="px-6 py-3 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions.map(t => (
                      <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(t.date)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${t.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {t.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 italic">{t.description || '-'}</td>
                        <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => deleteTransaction(t.id)}
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Henüz hiç işlem bulunmuyor.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <MarketAnalysis />
          </div>

          {/* Right Column: AI Assistant & Insights */}
          <div className="lg:col-span-4 space-y-6">
            <VoiceAssistant onTransactionAdded={addTransaction} />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
                  Yapay Zeka Analizi
                </h3>
                <button 
                  onClick={generateInsights}
                  disabled={loadingInsights}
                  className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1 disabled:opacity-50"
                >
                  {loadingInsights ? 'Analiz Ediliyor...' : 'Yenile'}
                  <svg className={`w-3 h-3 ${loadingInsights ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                </button>
              </div>

              {!aiInsights && !loadingInsights ? (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500 mb-4">Harcamalarınızı analiz etmek için asistanı başlatın.</p>
                  <button 
                    onClick={generateInsights}
                    className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                  >
                    Hemen Analiz Et
                  </button>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-xl p-4 border border-gray-100">
                  {loadingInsights ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                    </div>
                  ) : aiInsights}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold mb-2">Tasarruf Hedefi</h3>
              <p className="text-sm text-indigo-200 mb-4">Bu ay gelirin %20'sini biriktirmeyi hedeflediniz.</p>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-1000" 
                  style={{ width: `${Math.min(100, (1 - transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0) / (transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0) || 1)) * 100)}%` }}
                ></div>
              </div>
              <p className="text-xs mt-2 text-indigo-300">Harika gidiyorsunuz! Hedefinize yaklaştınız.</p>
            </div>
          </div>

        </div>
      </main>

      {/* Mobile Sticky Add Button */}
      <button 
        onClick={() => setIsFormOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 transform hover:scale-110 active:scale-95 transition-all"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
      </button>

      {isFormOpen && (
        <TransactionForm 
          onAdd={addTransaction}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
