// Raat Ka Hisaab feature types

import type { BotTime } from '../../shared/constants';

export type Answer = 'Y' | 'N' | 'Hmm';

export interface BotUser {
    _id: string;
    userId: string;
    phone: string;
    preferred_time: BotTime;
    streak: number;
    last_answered: string;
    createdAt: string;
}

export interface AnswerRecord {
    _id: string;
    userId: string;
    date: string;
    question_ids: string[];
    answers: Answer[];
    points_awarded: number;
}

export interface BotRegisterPayload {
    phone: string;
    preferred_time: BotTime;
}
