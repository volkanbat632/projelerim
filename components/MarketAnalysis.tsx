
import React, { useState } from 'react';
import { getMarketAnalysis } from '../services/geminiService';
import { GroundingSource } from '../types';

const MarketAnalysis: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; sources: GroundingSource[] } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    try {
      const data = await getMarketAnalysis(query);
      // Fixed: TS error resolved by updating types.ts
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Türkiye enflasyon oranı son durum nedir?",
    "En yüksek mevduat faizi veren bankalar hangileri?",
    "Altın fiyatları beklentisi nedir?",
    "Teknoloji hisseleri performansı nasıl?"
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        Akıllı Piyasa Analizi
      </h2>
      <p className="text-sm text-gray-600 mb-6">Finansal kararlarınız için en güncel verileri Google Search destekli yapay zekamızla sorgulayın.</p>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Piyasalar hakkında bir soru sorun..."
            className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1.5 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            )}
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 mb-8">
        {suggestions.map(s => (
          <button
            key={s}
            onClick={() => setQuery(s)}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-indigo-50 rounded-xl p-4 text-gray-800 text-sm leading-relaxed border border-indigo-100">
            {result.text}
          </div>
          {result.sources.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Kaynaklar</p>
              <div className="flex flex-wrap gap-3">
                {result.sources.map((source, idx) => source.web && (
                  <a
                    key={idx}
                    href={source.web.uri || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 underline decoration-indigo-200"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    {source.web.title || 'Kaynak'}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketAnalysis;
