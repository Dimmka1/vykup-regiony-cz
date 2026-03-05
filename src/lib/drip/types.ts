export interface DripSubscriber {
  email: string;
  name: string;
  region: string;
  createdAt: string;
  lastSentDay: number;
  unsubscribed: boolean;
}

export interface DripEmail {
  day: number;
  subject: string;
  html: (params: {
    name: string;
    region: string;
    unsubscribeUrl: string;
  }) => string;
}

export const DRIP_DAYS = [0, 1, 3, 5, 7, 10, 14] as const;
