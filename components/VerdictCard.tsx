import React from 'react';
import { AnalysisResult } from '../types';

interface VerdictCardProps {
  sentiment: AnalysisResult['sentiment'];
}

const VerdictCard: React.FC<VerdictCardProps> = ({ sentiment }) => {
  let colorClass = "bg-gray-700 text-gray-200";
  let icon = "⚖️";
  let text = "รอการวิเคราะห์...";
  let subText = "กำลังประมวลผลข้อมูลตลาด...";

  switch (sentiment) {
    case 'BUY':
      colorClass = "bg-green-900/40 border-green-500 text-green-400";
      icon = "🚀";
      text = "แนะนำ: ซื้อ / สะสม";
      subText = "ตลาดมีแนวโน้มขาขึ้น หรือราคาลงมาในจุดที่น่าสนใจ";
      break;
    case 'SELL':
      colorClass = "bg-red-900/40 border-red-500 text-red-400";
      icon = "📉";
      text = "แนะนำ: ขาย / ทำกำไร";
      subText = "ราคาขึ้นมาสูง หรือมีปัจจัยลบกดดันตลาด";
      break;
    case 'WAIT':
    case 'HOLD':
      colorClass = "bg-yellow-900/40 border-yellow-500 text-yellow-400";
      icon = "✋";
      text = "แนะนำ: ชะลอการลงทุน";
      subText = "ตลาดมีความผันผวนสูง หรือยังไม่เลือกทางชัดเจน";
      break;
    case 'NEUTRAL':
    default:
      colorClass = "bg-slate-700/50 border-slate-500 text-slate-300";
      icon = "🤔";
      text = "ตลาดทรงตัว";
      subText = "ติดตามข่าวสารอย่างใกล้ชิด";
      break;
  }

  return (
    <div className={`p-6 rounded-2xl border-2 shadow-lg backdrop-blur-sm ${colorClass} flex flex-col items-center justify-center text-center transition-all duration-500 hover:scale-[1.02]`}>
      <div className="text-6xl mb-4 animate-bounce-slow">{icon}</div>
      <h2 className="text-3xl font-bold mb-2">{text}</h2>
      <p className="text-sm opacity-90">{subText}</p>
    </div>
  );
};

export default VerdictCard;
