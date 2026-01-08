
export type UserRole = 'BIRTHDAY_USER' | 'FRIEND_1' | 'FRIEND_2' | 'FRIEND_3';

export interface Friend {
  id: UserRole;
  name: string;
  avatar: string;
  color: string;
}

export enum QuestStatus {
  LOCKED = 'LOCKED',
  AVAILABLE = 'AVAILABLE',
  COMPLETED = 'COMPLETED'
}

export type RewardType = 'GIFTICON' | 'GIF' | 'CARD' | 'VIDEO';

export interface Reward {
  type: RewardType;
  title: string;
  contentUrl: string;
  cardMessage?: string;
}

export interface Quest {
  id: number;
  title: string;
  description: string;
  creatorId: UserRole;
  unlockTime: string; // ISO string
  status: QuestStatus;
  reward: Reward;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'INFO' | 'QUEST' | 'GIFT';
}
