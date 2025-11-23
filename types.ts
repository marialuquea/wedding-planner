export interface Task {
  id: string;
  title: string;
  description?: string;
  category: 'Planning' | 'Ceremony' | 'Reception' | 'Other';
  isCompleted: boolean;
  dueDate?: string;
}

export interface RSVP {
  id: string;
  name: string;
  email: string;
  attending: 'yes' | 'no' | 'maybe';
  guestsCount: number;
  dietaryRestrictions?: string;
  songRequest?: string;
}

export interface WeddingDetails {
  date: string;
  time: string;
  locationName: string;
  address: string;
  ourStory: string;
  registryUrl: string;
}

export type ViewState = 'landing' | 'rsvp' | 'details' | 'admin-login' | 'admin-dashboard';

export enum AdminTab {
  TASKS = 'TASKS',
  RSVPS = 'RSVPS',
  DETAILS = 'DETAILS',
  AI_TOOLS = 'AI_TOOLS'
}