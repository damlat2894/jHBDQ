
import React from 'react';
import { Quest } from '../types.ts';
import Confetti from './Confetti.tsx';
import { CakeSlice } from './QuestCard.tsx';

interface QuestCompleteOverlayProps {
  quest: Quest;
  onClose: () => void;
}

const QuestCompleteOverlay: React.FC<QuestCompleteOverlayProps> = ({ quest, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-md animate-fadeIn">
      <Confetti type={quest.reward.type} />
      
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="soft-card p-10 w-full text-center relative overflow-hidden animate-slideUp border-4 border-white shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-2 bg-sky-500"></div>
          
          <div className="flex justify-center mb-6">
             <CakeSlice size="w-40 h-40" />
          </div>
          
          <h2 className="text-3xl font-black text-slate-800 mb-2">미션 성공!</h2>
          <p className="text-slate-400 font-bold mb-8">지혜님이 대단한 활약을 보여줬어요!</p>
          
          <div className="bg-sky-50 rounded-2xl p-4 mb-8 border border-sky-100">
            <p className="text-sky-600 font-black text-sm">축하 보상이 열렸습니다!</p>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-5 btn-primary text-xl shadow-lg transform active:scale-95 transition-transform"
          >
            확인하러 가기
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
    </div>
  );
};

export default QuestCompleteOverlay;
