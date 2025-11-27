import React, { useEffect, useState } from 'react';
import { analyzeGoldMarket } from './services/geminiService';
import { AnalysisResult } from './types';
import VerdictCard from './components/VerdictCard';
import MarkdownRenderer from './components/MarkdownRenderer';
import SourceList from './components/SourceList';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeGoldMarket();
      setAnalysis(result);
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อกับ AI ได้ในขณะนี้ โปรดตรวจสอบ API Key หรือการเชื่อมต่ออินเทอร์เน็ต");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-yellow-500/30">
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center text-slate-900 font-bold shadow-lg shadow-yellow-500/20">
              G
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500">
              GoldGuru AI
            </h1>
          </div>
          <button 
            onClick={fetchData} 
            disabled={loading}
            className="text-sm px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-slate-700 transition-colors flex items-center gap-2"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            รีเฟรช
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
        
        {loading ? (
          // Skeleton Loading
          <div className="animate-pulse space-y-8">
             <div className="h-48 bg-slate-800 rounded-2xl"></div>
             <div className="space-y-4">
                <div className="h-8 bg-slate-800 rounded w-1/3"></div>
                <div className="h-4 bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
             </div>
          </div>
        ) : error ? (
          // Error State
          <div className="flex flex-col items-center justify-center p-12 bg-slate-900 rounded-3xl border border-red-900/50">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-white mb-2">เกิดข้อผิดพลาด</h2>
            <p className="text-slate-400 text-center mb-6">{error}</p>
            <button onClick={fetchData} className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors">
              ลองใหม่
            </button>
          </div>
        ) : analysis ? (
          // Success State
          <div className="space-y-8 animate-fade-in">
            
            {/* 1. The Verdict */}
            <section>
              <div className="flex justify-between items-end mb-4">
                 <h2 className="text-xl font-bold text-slate-100">บทวิเคราะห์ล่าสุด</h2>
                 <span className="text-xs text-slate-500 font-mono">Updated: {analysis.timestamp}</span>
              </div>
              <VerdictCard sentiment={analysis.sentiment} />
            </section>

            {/* 2. Detailed Analysis */}
            <section>
              <MarkdownRenderer content={analysis.markdownContent} />
              <SourceList sources={analysis.sources} />
            </section>

            {/* 3. Disclaimer */}
            <div className="bg-yellow-900/20 border border-yellow-900/50 p-4 rounded-lg flex gap-3 items-start">
              <span className="text-yellow-500 mt-1">⚠️</span>
              <p className="text-xs text-yellow-500/80 leading-relaxed">
                <strong>คำเตือน:</strong> การลงทุนมีความเสี่ยง ข้อมูลนี้รวบรวมโดย AI จากแหล่งข่าวต่างๆ เพื่อประกอบการตัดสินใจเท่านั้น ไม่ใช่คำแนะนำทางการเงินโดยตรง โปรดใช้วิจารณญาณก่อนการลงทุน
              </p>
            </div>

            {/* 4. Chat */}
            <ChatInterface />

          </div>
        ) : null}

      </main>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(5%); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite ease-in-out;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
