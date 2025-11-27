import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // A very basic parser to format the output nicely without heavy libraries
  // It handles headers, lists, and bold text.
  
  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold text-yellow-400 mt-4 mb-2">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold text-yellow-500 mt-6 mb-3 border-b border-yellow-500/30 pb-1">{line.replace('## ', '')}</h2>;
      }
      
      // Bold
      let formattedLine: React.ReactNode = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = line.split(boldRegex);
      if (parts.length > 1) {
        formattedLine = parts.map((part, i) => 
          i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part
        );
      }

      // List items
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
         return (
          <li key={index} className="ml-4 list-disc marker:text-yellow-500 pl-1 mb-1 text-slate-300">
            {typeof formattedLine === 'string' ? formattedLine.replace(/^[\*\-]\s/, '') : formattedLine}
          </li>
         );
      }

      // Empty lines
      if (line.trim() === '') {
        return <div key={index} className="h-2"></div>;
      }

      return <p key={index} className="text-slate-300 leading-relaxed mb-2">{formattedLine}</p>;
    });
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-inner">
        <ul className="list-none">
            {formatText(content)}
        </ul>
    </div>
  );
};

export default MarkdownRenderer;
