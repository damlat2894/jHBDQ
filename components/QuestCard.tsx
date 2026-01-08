
import React from 'react';
import { Quest, QuestStatus } from '../types.ts';
import { FRIENDS } from '../constants.tsx';

export const CakeSlice: React.FC<{ size?: string }> = ({ size = "w-32 h-32" }) => {
  return (
    <div className={`${size} relative floating flex items-center justify-center`}>
      {/* Cake Slice Shape */}
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
        {/* Base Layer */}
        <path d="M50 80 L90 60 L90 40 L50 60 Z" fill="#F472B6" /> {/* pink-400 */}
        <path d="M50 80 L10 60 L10 40 L50 60 Z" fill="#EC4899" /> {/* pink-500 */}
        {/* Top Surface */}
        <path d="M50 60 L90 40 L50 20 L10 40 Z" fill="#FBCFE8" /> {/* pink-200 */}
        {/* Cream Drip */}
        <path d="M50 60 L60 55 L60 50 L50 55 Z" fill="#FDF2F8" />
        <path d="M50 60 L40 55 L40 50 L50 55 Z" fill="#FDF2F8" />
        {/* Small Candle on Slice */}
        <rect x="48" y="10" width="4" height="15" fill="#BAE6FD" rx="2" />
        <circle cx="50" cy="5" r="3" fill="#FB923C" className="flicker" />
      </svg>
    </div>
  );
};

const RewardViewer: React.FC<{ reward: Quest['reward'] }> = ({ reward }) => {
  return (
    <div className="mt-4 bg-sky-50 rounded-[2.5rem] p-6 border border-sky-100 animate-fadeIn">
      <p className="text-sky-500 font-black text-sm mb-4 text-center tracking-tight">🎁 획득한 보상: {reward.title}</p>
      <div className="rounded-[2rem] overflow-hidden shadow-inner aspect-square bg-white border-4 border-white flex items-center justify-center">
        <CakeSlice size="w-48 h-48" />
      </div>
      {reward.cardMessage && (
        <p className="mt-5 text-slate-600 italic text-center text-sm leading-relaxed px-2">
          "{reward.cardMessage}"
        </p>
      )}
    </div>
  );
};

const QuestCard: React.FC<QuestCardProps> = ({ quest, onComplete, isBirthdayUser }) => {
  const creator = FRIENDS.find(f => f.id === quest.creatorId);
  const isCompleted = quest.status === QuestStatus.COMPLETED;

  return (
    <div className={`soft-card p-8 transition-all duration-300 ${isCompleted ? 'bg-white/95 border-2 border-sky-100' : 'bg-white border border-transparent hover:border-sky-50'}`}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-3xl bg-sky-50 shadow-inner border border-sky-100">
          {creator?.avatar}
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800 leading-tight">{quest.title}</h3>
          <p className="text-xs text-slate-400 font-black mt-0.5 tracking-tight uppercase">{creator?.name}의 미션</p>
        </div>
      </div>

      <p className="text-slate-600 mb-8 leading-relaxed font-semibold text-[15px]">
        {quest.description}
      </p>

      {!isCompleted && isBirthdayUser && (
        <button
          onClick={() => onComplete(quest.id)}
          className="w-full py-5 btn-primary text-xl shadow-sky-100 shadow-xl active:shadow-inner"
        >
          미션 완료하기
        </button>
      )}

      {isCompleted && (
        <div className="animate-fadeIn">
          <div className="flex items-center gap-2 mb-4 bg-green-50 px-4 py-2 rounded-full w-fit border border-green-100">
            <span className="text-green-500 text-sm font-black tracking-tighter">✓ MISSION CLEAR!</span>
          </div>
          <RewardViewer reward={quest.reward} />
        </div>
      )}
    </div>
  );
};

interface QuestCardProps {
  quest: Quest;
  onComplete: (id: number) => void;
  isBirthdayUser: boolean;
}

export default QuestCard;
