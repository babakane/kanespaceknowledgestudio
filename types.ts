
export enum ParticipantType {
  PRESENTER = 'PRESENTER',
  GUEST_A = 'GUEST_A',
  GUEST_B = 'GUEST_B'
}

export interface SpeechPart {
  speaker: ParticipantType;
  name: string;
  location: string;
  role: string;
  text: string;
  emotion: string;
}

export interface ResearchSource {
  title: string;
  uri: string;
}

export interface ShowDialogue {
  intro: SpeechPart;
  discussion: SpeechPart[];
  synthesis: SpeechPart;
  sources: ResearchSource[];
}

export interface AppState {
  status: 'IDLE' | 'GENERATING' | 'READY' | 'PLAYING' | 'FINISHED';
  currentTopic: string;
  dialogue: ShowDialogue | null;
  currentStepIndex: number;
}
