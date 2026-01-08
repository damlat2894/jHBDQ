
import React, { useState, useEffect } from 'react';
import { UserRole, Friend, Quest, QuestStatus } from './types.ts';
import { FRIENDS, INITIAL_QUESTS, BIRTHDAY_START, BIRTHDAY_END } from './constants.tsx';
import QuestCard from './components/QuestCard.tsx';
import QuestCompleteOverlay from './components/QuestCompleteOverlay.tsx';

// Real-time Clock Component with Date
const RealTimeClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth(); 
    const day = date.getDate();
    
    // Check if it's the target birthday: 2026-01-15
    const isBirthday = year === 2026 && month === 0 && day === 15;
    
    const dateStr = isBirthday 
      ? "♥ 지혜 생일 ♥" 
      : `${year}. ${String(month + 1).padStart(2, '0')}. ${String(day).padStart(2, '0')}.`;

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return {
      date: dateStr,
      time: `${hours}:${minutes}:${seconds}`
    };
  };

  const current = formatDateTime(time);

  return (
    <div className="fixed bottom-4 left-4 z-[60] bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-sky-100 flex flex-col pointer-events-none group hover:bg-white transition-all">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
        <span className={`font-black tracking-tight ${current.date.includes('♥') ? 'text-pink-500 text-[11px]' : 'text-slate-400 text-[10px]'}`}>
          {current.date}
        </span>
      </div>
      <span className="text-sky-600 text-sm font-black tracking-widest font-mono ml-4">{current.time}</span>
    </div>
  );
};

const AnimatedCake: React.FC = () => {
  return (
    <div className="relative w-64 h-64 cake-bounce flex items-end justify-center">
      {/* Candles */}
      <div className="absolute top-4 w-full flex justify-center gap-4 z-20 mb-10">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="relative flex flex-col items-center">
             <div className="w-3 h-5 bg-orange-400 rounded-full flicker blur-[1px] mb-[-2px] relative z-20 shadow-[0_0_15px_#fbd38d]"></div>
             <div className="w-2 h-10 bg-sky-200 rounded-full border-r-2 border-sky-300"></div>
          </div>
        ))}
      </div>
      {/* Top Layer */}
      <div className="relative w-48 h-20 bg-pink-100 rounded-t-[2.5rem] border-x-4 border-t-4 border-white shadow-inner flex items-center justify-center z-10">
          <span className="text-2xl mt-4">🍓</span>
      </div>
      {/* Bottom Layer */}
      <div className="relative w-56 h-24 bg-pink-400 rounded-b-[3rem] shadow-2xl border-x-4 border-b-8 border-pink-500 overflow-hidden flex flex-col">
        <div className="w-full flex justify-around">
           {[...Array(6)].map((_, i) => (
             <div key={i} className="w-8 h-10 bg-pink-300 rounded-full -translate-y-4 shadow-sm"></div>
           ))}
        </div>
      </div>
      {/* Plate */}
      <div className="absolute bottom-[-10px] w-72 h-8 bg-white rounded-full -z-10 shadow-xl border-b-4 border-slate-200"></div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<Friend | null>(null);
  const [quests, setQuests] = useState<Quest[]>(() => {
    const savedQuests = localStorage.getItem('bq_quests');
    return savedQuests ? JSON.parse(savedQuests) : INITIAL_QUESTS;
  });
  const [completedQuest, setCompletedQuest] = useState<Quest | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [editingQuestId, setEditingQuestId] = useState<number | null>(null);
  const [dateAlert, setDateAlert] = useState<{title: string, msg: string, icon: string} | null>(null);

  const nowTime = new Date().getTime();
  const isBeforeBirthday = nowTime < BIRTHDAY_START;
  const isAfterBirthday = nowTime > BIRTHDAY_END;

  // Save quests whenever they change
  useEffect(() => {
    localStorage.setItem('bq_quests', JSON.stringify(quests));
  }, [quests]);

  const handleUserSelect = (friend: Friend) => {
    if (!isAdmin) {
      if (isBeforeBirthday) { 
        setDateAlert({ title: '아직 너의 생일이 아니야!', msg: '2026년 1월 15일 0시에 다시 와줘!', icon: '📅' }); 
        return; 
      }
      if (isAfterBirthday) { 
        setDateAlert({ title: '너 생일은 끝났어 이년아!', msg: '내년 생일을 기약하자구~', icon: '⏰' }); 
        return; 
      }
    }
    setCurrentUser(friend);
  };

  const handleComplete = (questId: number) => {
    const targetQuest = quests.find(q => q.id === questId);
    if (!targetQuest) return;
    const newQuests = quests.map(q => q.id === questId ? { ...q, status: QuestStatus.COMPLETED } : q);
    setQuests(newQuests);
    setCompletedQuest({ ...targetQuest, status: QuestStatus.COMPLETED });
  };

  const handleAdminAuth = (password: string) => {
    if (password === '0115') {
      setIsAdmin(true); 
      setShowAdminLogin(false);
      setCurrentUser(FRIENDS.find(f => f.id === 'BIRTHDAY_USER')!); // 바로 생일자 모드로 진입
    } else { 
      alert('비밀번호가 틀렸습니다.'); 
    }
  };

  const handleUpdateQuest = (id: number, title: string, description: string) => {
    const updated = quests.map(q => q.id === id ? { ...q, title, description } : q);
    setQuests(updated);
    setEditingQuestId(null);
  };

  const completedCount = quests.filter(q => q.status === QuestStatus.COMPLETED).length;
  const progressPercent = (completedCount / quests.length) * 100;

  // 팝업 모달 컴포넌트
  const AlertModal = ({ info, onClose }: { info: {title: string, msg: string, icon: string}, onClose: () => void }) => (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="soft-card p-10 w-full max-w-sm text-center border-4 border-sky-100 shadow-2xl">
        <div className="text-5xl mb-6">{info.icon}</div>
        <h2 className="text-2xl font-black mb-4 text-slate-800 leading-tight">{info.title}</h2>
        <p className="text-slate-500 font-bold mb-8">{info.msg}</p>
        <button onClick={onClose} className="w-full py-4 btn-primary text-lg">확인</button>
      </div>
    </div>
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-sky-50 relative overflow-hidden">
        <RealTimeClock />
        <div className="w-full max-w-md text-center">
          <p className="text-sky-500 font-black text-sm mb-2 tracking-widest uppercase animate-pulse">지혜의 케이크 획득 대작전</p>
          <h1 className="text-4xl font-black text-slate-800 mb-12 tracking-tighter">HBD Quest</h1>
          
          <div className="relative mx-auto w-64 h-64 mb-16 flex items-center justify-center">
             <AnimatedCake />
             <div className="absolute -top-10 -left-10 text-yellow-400 text-3xl animate-pulse">✨</div>
             <div className="absolute -bottom-10 -right-10 text-sky-400 text-3xl animate-pulse delay-75">✨</div>
          </div>

          <button
            onClick={() => handleUserSelect(FRIENDS.find(f => f.id === 'BIRTHDAY_USER')!)}
            className="w-full py-6 btn-primary text-2xl shadow-xl shadow-sky-200 transform active:scale-95 transition-all"
          >
            도전하기
          </button>
        </div>

        {/* 숨겨진 관리자 버튼 */}
        <button 
          onClick={() => setShowAdminLogin(true)} 
          className="fixed bottom-4 right-4 text-[10px] text-slate-300 font-bold uppercase tracking-widest hover:text-sky-400 transition-colors"
        >
          Admin Mode
        </button>
        
        {dateAlert && <AlertModal info={dateAlert} onClose={() => setDateAlert(null)} />}
        {showAdminLogin && <AdminPasswordModal onConfirm={handleAdminAuth} onCancel={() => setShowAdminLogin(false)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <RealTimeClock />
      {completedQuest && <QuestCompleteOverlay quest={completedQuest} onClose={() => setCompletedQuest(null)} />}
      
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-lg px-6 py-5 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentUser(null)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-50 text-sky-500 border border-sky-100 hover:bg-sky-100 transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentUser.avatar}</span>
            <span className="font-black text-slate-800">{currentUser.name} {isAdmin && <span className="text-xs text-sky-500 bg-sky-50 px-2 py-1 rounded ml-1">ADMIN</span>}</span>
          </div>
        </div>
        <button onClick={() => { setCurrentUser(null); setIsAdmin(false); }} className="text-xs font-bold text-sky-500 bg-sky-50 px-4 py-2 rounded-full border border-sky-100">로그아웃</button>
      </header>

      <main className="max-w-lg mx-auto p-6 space-y-6">
        <div className="soft-card p-8 mb-4 border border-sky-50">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-black text-slate-800">미션 진행률</h2>
            <span className="text-sky-500 font-black">{completedCount} / {quests.length}</span>
          </div>
          <div className="progress-bar mb-2"><div className="progress-fill" style={{ width: `${progressPercent}%` }}></div></div>
          <p className="text-[11px] text-slate-400 font-bold text-center">케이크 조각을 모두 모아 생일 파티를 완성하세요!</p>
        </div>

        <div className="space-y-6">
          {quests.map((quest) => (
            <div key={quest.id} className="relative group">
              <QuestCard quest={quest} onComplete={handleComplete} isBirthdayUser={true} />
              {isAdmin && (
                <button 
                  onClick={() => setEditingQuestId(quest.id)} 
                  className="absolute top-4 right-4 bg-sky-500 text-white p-2 rounded-full shadow-lg hover:rotate-90 transition-all z-10 border-2 border-white opacity-0 group-hover:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
              )}
            </div>
          ))}
        </div>
        
        {/* 메인으로 가기 명시적인 버튼 */}
        <button 
          onClick={() => setCurrentUser(null)} 
          className="w-full py-4 text-slate-400 font-bold text-sm hover:text-sky-500 transition-colors flex items-center justify-center gap-2"
        >
          <span>🏠</span> 처음 화면으로 돌아가기
        </button>
      </main>

      {editingQuestId && (
        <AdminEditor 
          quest={quests.find(q => q.id === editingQuestId)!} 
          onSave={handleUpdateQuest} 
          onCancel={() => setEditingQuestId(null)} 
        />
      )}
      {showAdminLogin && <AdminPasswordModal onConfirm={handleAdminAuth} onCancel={() => setShowAdminLogin(false)} />}
    </div>
  );
};

const AdminPasswordModal: React.FC<{ onConfirm: (pw: string) => void, onCancel: () => void }> = ({ onConfirm, onCancel }) => {
  const [pw, setPw] = useState('');
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="soft-card p-10 w-full max-w-sm text-center border-4 border-sky-100 shadow-2xl">
        <div className="text-4xl mb-4">🔐</div>
        <h2 className="text-2xl font-black mb-6 text-slate-800">관리자 인증</h2>
        <input 
          type="password" 
          value={pw} 
          onChange={e => setPw(e.target.value)} 
          placeholder="비밀번호"
          autoFocus 
          className="w-full p-4 mb-6 bg-slate-100 rounded-2xl text-center text-3xl tracking-widest focus:ring-4 focus:ring-sky-200 outline-none font-bold"
          onKeyDown={e => e.key === 'Enter' && onConfirm(pw)} 
        />
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold text-slate-500">닫기</button>
          <button onClick={() => onConfirm(pw)} className="flex-1 py-4 btn-primary">확인</button>
        </div>
      </div>
    </div>
  );
};

const AdminEditor: React.FC<{ quest: Quest, onSave: (id: number, t: string, d: string) => void, onCancel: () => void }> = ({ quest, onSave, onCancel }) => {
  const [t, setT] = useState(quest.title);
  const [d, setD] = useState(quest.description);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="soft-card p-10 w-full max-w-md border-4 border-sky-100 shadow-2xl">
        <h2 className="text-2xl font-black mb-6 text-slate-800 text-center">미션 수정</h2>
        <div className="space-y-4">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-tighter">미션 제목</label>
          <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-4 focus:ring-sky-100 outline-none" value={t} onChange={e => setT(e.target.value)} />
          <label className="block text-xs font-black text-slate-400 uppercase tracking-tighter">상세 설명</label>
          <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-40 font-semibold focus:ring-4 focus:ring-sky-100 outline-none" value={d} onChange={e => setD(e.target.value)} />
        </div>
        <div className="flex gap-3 mt-8">
          <button onClick={onCancel} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold text-slate-500">취소</button>
          <button onClick={() => onSave(quest.id, t, d)} className="flex-1 py-4 btn-primary">저장</button>
        </div>
      </div>
    </div>
  );
};

export default App;
