
export enum SeverityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface FirstAidResponse {
  situation: string;
  immediateSteps: string[];
  safetyTips: string[];
  avoid: string[];
  whenToCallEmergency: string[];
  severityLevel: SeverityLevel;
}

export interface AppState {
  loading: boolean;
  error: string | null;
  response: FirstAidResponse | null;
}
