
// --- 이 파일에서는 import 문을 절대 사용하지 않습니다 (브라우저 환경 최적화) ---
const { useState, useEffect, useRef } = (window as any).React;

// --- 1. TYPES ---
type UserRole = 'BIRTHDAY_USER' | 'FRIEND_1' | 'FRIEND_2' | 'FRIEND_3';

interface Friend {
  id: UserRole;
  name: string;
  avatar: string;
  color: string;
}

enum QuestStatus {
  LOCKED = 'LOCKED',
  AVAILABLE = 'AVAILABLE',
  COMPLETED = 'COMPLETED'
}

interface Quest {
  id: number;
  title: string;
  description: string;
  creatorId: UserRole;
  unlockTime: string;
  status: QuestStatus;
  reward: {
    type: string;
    title: string;
    cardMessage?: string;
  };
}

// --- 2. CONSTANTS ---
const FRIENDS: Friend[] = [
  { id: 'BIRTHDAY_USER', name: '지혜 (생일자)', avatar: '🎂', color: 'bg-pink-400' },
  { id: 'FRIEND_1', name: '예진', avatar: '🦁', color: 'bg-yellow-400' },
  { id: 'FRIEND_2', name: '유진', avatar: '🐰', color: 'bg-blue-400' },
  { id: 'FRIEND_3', name: '민성', avatar: '🐶', color: 'bg-green-400' },
];

const BIRTHDAY_START = new Date('2026-01-15T00:00:00+09:00').getTime();
const BIRTHDAY_END = new Date('2026-01-15T23:59:59+09:00').getTime();

const INITIAL_QUESTS: Quest[] = [
  {
    id: 1,
    title: "최애 커피 사오기!",
    description: "오늘 하루의 시작은 달콤하게! 근처 카페에서 예진이가 좋아하는 바닐라 라떼를 직접 사서 인증샷을 찍어줘.",
    creatorId: 'FRIEND_1',
    unlockTime: new Date().toISOString(),
    status: QuestStatus.AVAILABLE,
    reward: { type: 'GIFTICON', title: "데굴레오케이크 1/3" }
  },
  {
    id: 2,
    title: "노래방에서 90점 넘기",
    description: "유진이의 퀘스트! 노래방에 가서 우리들의 주제곡을 부르고 90점 넘는 화면을 공유해줘!",
    creatorId: 'FRIEND_2',
    unlockTime: new Date().toISOString(),
    status: QuestStatus.AVAILABLE,
    reward: { type: 'GIF', title: "데굴레오케이크 2/3" }
  },
  {
    id: 3,
    title: "깜짝 편지 낭독하기",
    description: "민성이의 미션! 부모님이나 소중한 사람에게 짧은 감사 메시지를 보내고 답장을 캡쳐해줘.",
    creatorId: 'FRIEND_3',
    unlockTime: new Date().toISOString(),
    status: QuestStatus.AVAILABLE,
    reward: { 
      type: 'CARD', 
      title: "데굴레오케이크 3/3",
      cardMessage: "지혜야, 너의 새로운 시작을 항상 응원해! 너는 세상에서 가장 빛나는 사람이야. 생일 진심으로 축하해!"
    }
  }
];

// --- 3. UI COMPONENTS ---

const AnimatedCake = () => (
  <div className="relative w-64 h-64 flex flex-col items-center justify-center floating">
    {/* Candles */}
    <div className="flex gap-4 mb-[-10px] relative z-20">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-3 h-5 bg-orange-400 rounded-full flicker blur-[1px] mb-[-2px] shadow-[0_0_15px_#fbd38d]"></div>
          <div className="w-2 h-10 bg-sky-200 rounded-full border-r-2 border-sky-300"></div>
        </div>
      ))}
    </div>
    {/* Cake Layers */}
    <div className="relative w-56 h-24 bg-pink-100 rounded-t-[2rem] border-x-4 border-t-4 border-white shadow-inner flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 w-full h-8 bg-white/40"></div>
        <span className="text-3xl">🍓</span>
    </div>
    <div className="w-64 h-24 bg-pink-400 rounded-b-[2.5rem] border-x-4 border-b-8 border-pink-500 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 w-full flex justify-around">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-8 h-10 bg-pink-300 rounded-full -translate-y-4 shadow-sm"></div>
        ))}
      </div>
      <div className="absolute bottom-4 w-full h-2 bg-pink-500/20"></div>
    </div>
    {/* Plate */}
    <div className="w-72 h-6 bg-white rounded-full mt-[-10px] shadow-xl border-b-4 border-slate-200"></div>
  </div>
);

const Modal = ({ title, message, onConfirm, icon = "⚠️" }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
    <div className="soft-card p-10 w-full max-w-sm text-center border-4 border-white shadow-2xl transform animate-slideUp">
      <div className="text-5xl mb-6">{icon}</div>
      <h2 className="text-2xl font-black mb-4 text-slate-800 leading-tight">{title}</h2>
      <p className="text-slate-500 font-bold mb-8 leading-relaxed">{message}</p>
      <button onClick={onConfirm} className="w-full py-5 btn-primary text-xl shadow-lg active:scale-95 transition-transform">확인</button>
    </div>
  </div>
);

const AdminLoginModal = ({ onConfirm, onCancel }: any) => {
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
          className="w-full p-4 mb-6 bg-slate-100 rounded-2xl text-center text-2xl tracking-widest focus:ring-4 focus:ring-sky-200 outline-none font-bold"
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

const AdminEditor = ({ quest, onSave, onCancel }: any) => {
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

// --- 4. MAIN APP ---

const App = () => {
  // Fix: Replaced untyped generic function call with type assertion on initial value to fix compiler error.
  const [currentUser, setCurrentUser] = useState(null as Friend | null);
  // Fix: Replaced generic function call with type assertion in initializer function.
  const [quests, setQuests] = useState(() => {
    const saved = localStorage.getItem('bq_quests');
    return (saved ? JSON.parse(saved) : INITIAL_QUESTS) as Quest[];
  });
  const [isAdmin, setIsAdmin] = useState(false);
  // Fix: Removed generic type argument from untyped hook and used assertion.
  const [alertInfo, setAlertInfo] = useState(null as {title: string, msg: string, icon: string} | null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  // Fix: Removed generic type argument from untyped hook and used assertion.
  const [editingQuestId, setEditingQuestId] = useState(null as number | null);

  useEffect(() => {
    localStorage.setItem('bq_quests', JSON.stringify(quests));
  }, [quests]);

  const checkBirthdayAccess = () => {
    if (isAdmin) return true;
    const now = new Date().getTime();
    if (now < BIRTHDAY_START) {
      setAlertInfo({ title: "아직 생일이 아니야!", msg: "2026년 1월 15일 0시에 다시 와줘!", icon: "📅" });
      return false;
    }
    if (now > BIRTHDAY_END) {
      setAlertInfo({ title: "너 생일은 끝났어 이년아!", msg: "내년 생일을 기약하자구~", icon: "⏰" });
      return false;
    }
    return true;
  };

  const handleStartQuest = () => {
    if (checkBirthdayAccess()) {
      setCurrentUser(FRIENDS[0]);
    }
  };

  const handleAdminAuth = (pw: string) => {
    if (pw === '0115') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setCurrentUser(FRIENDS[0]);
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  const handleComplete = (id: number) => {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, status: QuestStatus.COMPLETED } : q));
  };

  const handleUpdateQuest = (id: number, title: string, description: string) => {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, title, description } : q));
    setEditingQuestId(null);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-sky-50">
        <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tighter">Birthday Quest</h1>
        <p className="text-sky-500 font-bold mb-12">지혜의 케이크 획득 대작전</p>
        
        <AnimatedCake />
        
        <button 
          onClick={handleStartQuest}
          className="mt-16 w-full max-w-sm py-6 btn-primary text-2xl shadow-xl shadow-sky-200 transform active:scale-95 transition-all"
        >
          도전하기
        </button>

        {/* Hidden Admin Trigger */}
        <button 
          onClick={() => setShowAdminLogin(true)} 
          className="fixed bottom-4 right-4 text-[10px] text-slate-300 font-bold uppercase tracking-widest hover:text-sky-400 transition-colors"
        >
          Admin Mode
        </button>

        {alertInfo && <Modal title={alertInfo.title} message={alertInfo.msg} icon={alertInfo.icon} onConfirm={() => setAlertInfo(null)} />}
        {showAdminLogin && <AdminLoginModal onConfirm={handleAdminAuth} onCancel={() => setShowAdminLogin(false)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-lg px-6 py-5 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{currentUser.avatar}</span>
          <span className="font-black text-slate-800">{currentUser.name} {isAdmin && <span className="text-xs text-sky-500 bg-sky-50 px-2 py-1 rounded ml-1">ADMIN</span>}</span>
        </div>
        <button onClick={() => {setCurrentUser(null); setIsAdmin(false);}} className="text-xs font-bold text-sky-500">로그아웃</button>
      </header>

      <main className="max-w-lg mx-auto p-6 space-y-6">
        <div className="soft-card p-8 mb-4 border border-sky-50">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-black text-slate-800">미션 진행률</h2>
            <span className="text-sky-500 font-black">
              {quests.filter(q => q.status === QuestStatus.COMPLETED).length} / {quests.length}
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(quests.filter(q => q.status === QuestStatus.COMPLETED).length / quests.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {quests.map(quest => {
          const creator = FRIENDS.find(f => f.id === quest.creatorId);
          const isCompleted = quest.status === QuestStatus.COMPLETED;
          return (
            <div key={quest.id} className="relative group">
              <div className={`soft-card p-8 transition-all ${isCompleted ? 'bg-white/95 border-2 border-sky-100' : 'bg-white'}`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-3xl bg-sky-50 shadow-inner">
                    {creator?.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">{quest.title}</h3>
                    <p className="text-xs text-slate-400 font-black tracking-tight uppercase">{creator?.name}의 미션</p>
                  </div>
                </div>
                <p className="text-slate-600 mb-8 leading-relaxed font-semibold">{quest.description}</p>
                
                {!isCompleted ? (
                  <button onClick={() => handleComplete(quest.id)} className="w-full py-5 btn-primary text-xl">미션 완료하기</button>
                ) : (
                  <div className="animate-fadeIn p-6 bg-sky-50 rounded-[2rem] text-center border border-sky-100">
                    <span className="text-sky-500 font-black">🎁 보상 획득: {quest.reward.title}</span>
                  </div>
                )}
              </div>
              
              {isAdmin && (
                <button 
                  onClick={() => setEditingQuestId(quest.id)}
                  className="absolute top-4 right-4 bg-sky-500 text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ⚙️
                </button>
              )}
            </div>
          );
        })}
      </main>

      {editingQuestId && (
        <AdminEditor 
          quest={quests.find(q => q.id === editingQuestId)} 
          onSave={handleUpdateQuest} 
          onCancel={() => setEditingQuestId(null)} 
        />
      )}
    </div>
  );
};

const root = (window as any).ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
