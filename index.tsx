
// --- 이 파일에서는 import 문을 절대 사용하지 않습니다 ---
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

type RewardType = 'GIFTICON' | 'GIF' | 'CARD' | 'VIDEO';

interface Reward {
  type: RewardType;
  title: string;
  contentUrl: string;
  cardMessage?: string;
}

interface Quest {
  id: number;
  title: string;
  description: string;
  creatorId: UserRole;
  unlockTime: string;
  status: QuestStatus;
  reward: Reward;
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
    reward: {
      type: 'GIFTICON',
      title: "데굴레오케이크 3/1",
      contentUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop",
    }
  },
  {
    id: 2,
    title: "노래방에서 90점 넘기",
    description: "유진이의 퀘스트! 노래방에 가서 우리들의 주제곡을 부르고 90점 넘는 화면을 공유해줘!",
    creatorId: 'FRIEND_2',
    unlockTime: new Date().toISOString(),
    status: QuestStatus.AVAILABLE,
    reward: {
      type: 'GIF',
      title: "데굴레오케이크 3/2",
      contentUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHJmZzJ4Nnh5Z2J4Z2J4Z2J4Z2J4Z2J4Z2J4Z2J4Z2J4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l41lI4bAdzVBgJ2sE/giphy.gif",
    }
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
      contentUrl: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=400&auto=format&fit=crop",
      cardMessage: "지혜야, 너의 새로운 시작을 항상 응원해! 너는 세상에서 가장 빛나는 사람이야. 생일 진심으로 축하해!"
    }
  }
];

// --- 3. COMPONENTS ---

const Confetti = ({ type }: { type?: RewardType }) => {
  // Fix: Removed type argument from useRef call because React hooks are untyped here
  const canvasRef = useRef(null as HTMLCanvasElement | null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const pieces: any[] = [];
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
    for (let i = 0; i < 150; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 4 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5
      });
    }
    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.y += p.speed;
        p.rotation += p.rotationSpeed;
        if (p.y > canvas.height) p.y = -20;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [type]);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[60]" />;
};

const CakeSlice = ({ size = "w-32 h-32" }) => (
  <div className={`${size} relative floating flex items-center justify-center`}>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
      <path d="M50 80 L90 60 L90 40 L50 60 Z" fill="#F472B6" />
      <path d="M50 80 L10 60 L10 40 L50 60 Z" fill="#EC4899" />
      <path d="M50 60 L90 40 L50 20 L10 40 Z" fill="#FBCFE8" />
      <rect x="48" y="10" width="4" height="15" fill="#BAE6FD" rx="2" />
      <circle cx="50" cy="5" r="3" fill="#FB923C" className="flicker" />
    </svg>
  </div>
);

const QuestCard = ({ quest, onComplete, isBirthdayUser }: any) => {
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
      <p className="text-slate-600 mb-8 leading-relaxed font-semibold text-[15px]">{quest.description}</p>
      {!isCompleted && isBirthdayUser && (
        <button onClick={() => onComplete(quest.id)} className="w-full py-5 btn-primary text-xl shadow-sky-100 shadow-xl active:shadow-inner">미션 완료하기</button>
      )}
      {isCompleted && (
        <div className="animate-fadeIn">
          <div className="flex items-center gap-2 mb-4 bg-green-50 px-4 py-2 rounded-full w-fit border border-green-100">
            <span className="text-green-500 text-sm font-black tracking-tighter">✓ MISSION CLEAR!</span>
          </div>
          <div className="mt-4 bg-sky-50 rounded-[2.5rem] p-6 border border-sky-100">
            <p className="text-sky-500 font-black text-sm mb-4 text-center">🎁 보상: {quest.reward.title}</p>
            <div className="rounded-[2rem] overflow-hidden shadow-inner aspect-square bg-white border-4 border-white flex items-center justify-center">
              <CakeSlice size="w-48 h-48" />
            </div>
            {quest.reward.cardMessage && <p className="mt-5 text-slate-600 italic text-center text-sm leading-relaxed px-2">"{quest.reward.cardMessage}"</p>}
          </div>
        </div>
      )}
    </div>
  );
};

const RealTimeClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const h = String(time.getHours()).padStart(2, '0');
  const m = String(time.getMinutes()).padStart(2, '0');
  const s = String(time.getSeconds()).padStart(2, '0');
  return (
    <div className="fixed bottom-4 left-4 z-[60] bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-sky-100 flex flex-col pointer-events-none transition-all">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
        <span className="text-slate-400 text-[10px] font-black tracking-tight">{time.getFullYear()}. {time.getMonth()+1}. {time.getDate()}.</span>
      </div>
      <span className="text-sky-600 text-sm font-black tracking-widest font-mono ml-4">{h}:{m}:{s}</span>
    </div>
  );
};

const QuestCompleteOverlay = ({ quest, onClose }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-md animate-fadeIn">
    <Confetti type={quest.reward.type} />
    <div className="soft-card p-10 w-full max-w-sm text-center relative animate-slideUp border-4 border-white shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-2 bg-sky-500"></div>
      <div className="flex justify-center mb-6"><CakeSlice size="w-40 h-40" /></div>
      <h2 className="text-3xl font-black text-slate-800 mb-2">미션 성공!</h2>
      <p className="text-slate-400 font-bold mb-8">지혜님이 대단한 활약을 보여줬어요!</p>
      <button onClick={onClose} className="w-full py-5 btn-primary text-xl">확인하러 가기</button>
    </div>
  </div>
);

// --- 4. APP ---
const App = () => {
  // Fix: Removed type arguments from useState calls because React hooks are untyped here
  const [currentUser, setCurrentUser] = useState(null as Friend | null);
  const [quests, setQuests] = useState(() => {
    const saved = localStorage.getItem('bq_quests');
    return (saved ? JSON.parse(saved) : INITIAL_QUESTS) as Quest[];
  });
  const [completedQuest, setCompletedQuest] = useState(null as Quest | null);

  useEffect(() => { localStorage.setItem('bq_quests', JSON.stringify(quests)); }, [quests]);

  const handleComplete = (id: number) => {
    const target = quests.find(q => q.id === id);
    if (!target) return;
    const newQuests = quests.map(q => q.id === id ? { ...q, status: QuestStatus.COMPLETED } : q);
    setQuests(newQuests);
    setCompletedQuest({ ...target, status: QuestStatus.COMPLETED });
  };

  const completedCount = quests.filter(q => q.status === QuestStatus.COMPLETED).length;
  const progressPercent = (completedCount / quests.length) * 100;

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10">
        <RealTimeClock />
        <h1 className="text-4xl font-black text-slate-800 mb-12">HBD Quest</h1>
        <div className="cake-bounce mb-12"><CakeSlice size="w-64 h-64" /></div>
        <button onClick={() => setCurrentUser(FRIENDS[0])} className="w-full max-w-sm py-6 btn-primary text-2xl shadow-lg active:scale-95 transition-transform">도전하기</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <RealTimeClock />
      {completedQuest && <QuestCompleteOverlay quest={completedQuest} onClose={() => setCompletedQuest(null)} />}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-lg px-6 py-5 flex justify-between items-center shadow-sm">
        <span className="font-black text-slate-800">{currentUser.name}</span>
        <button onClick={() => setCurrentUser(null)} className="text-xs font-bold text-sky-500">로그아웃</button>
      </header>
      <main className="max-w-lg mx-auto p-6 space-y-6">
        <div className="soft-card p-8 mb-4">
          <div className="flex justify-between mb-4"><h2 className="font-black">미션 진행률</h2><span>{completedCount}/{quests.length}</span></div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressPercent}%` }}></div></div>
        </div>
        {quests.map(q => <QuestCard key={q.id} quest={q} onComplete={handleComplete} isBirthdayUser={currentUser.id === 'BIRTHDAY_USER'} />)}
      </main>
    </div>
  );
};

const root = (window as any).ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
