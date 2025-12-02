export enum BadgeType {
  EARNABLE = 'Earnable',
  HIGHLIGHT = 'Highlight',
  RETIRED = 'Retired'
}

export interface Badge {
  id: string;
  icon: string;
  name: string;
  description: string;
  howToEarn: string;
  type: BadgeType;
  tiers?: string[];
  tips?: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface AchievementGuide {
  id: string;
  title: string;
  steps: string[];
}