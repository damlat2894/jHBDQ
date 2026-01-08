
import { Friend, Quest, QuestStatus } from './types';

export const FRIENDS: Friend[] = [
  { id: 'BIRTHDAY_USER', name: '지혜 (생일자)', avatar: '🎂', color: 'bg-pink-400' },
  { id: 'FRIEND_1', name: '예진', avatar: '🦁', color: 'bg-yellow-400' },
  { id: 'FRIEND_2', name: '유진', avatar: '🐰', color: 'bg-blue-400' },
  { id: 'FRIEND_3', name: '민성', avatar: '🐶', color: 'bg-green-400' },
];

// Target date: 2026-01-15 (JST/KST)
export const BIRTHDAY_START = new Date('2026-01-15T00:00:00+09:00').getTime();
export const BIRTHDAY_END = new Date('2026-01-15T23:59:59+09:00').getTime();

const now = new Date().toISOString();

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 1,
    title: "최애 커피 사오기!",
    description: "오늘 하루의 시작은 달콤하게! 근처 카페에서 예진이가 좋아하는 바닐라 라떼를 직접 사서 인증샷을 찍어줘.",
    creatorId: 'FRIEND_1',
    unlockTime: now,
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
    unlockTime: now,
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
    unlockTime: now,
    status: QuestStatus.AVAILABLE,
    reward: {
      type: 'CARD',
      title: "데굴레오케이크 3/3",
      contentUrl: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=400&auto=format&fit=crop",
      cardMessage: "지혜야, 너의 새로운 시작을 항상 응원해! 너는 세상에서 가장 빛나는 사람이야. 생일 진심으로 축하해!"
    }
  }
];
