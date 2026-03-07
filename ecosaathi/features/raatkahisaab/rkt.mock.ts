// Raat Ka Hisaab mock data

import type { BotUser, AnswerRecord } from './rkt.types';

export const MOCK_BOT_USER: BotUser = {
    _id: 'botuser-001',
    userId: 'mock-user-001',
    phone: '9999999999',
    preferred_time: '21:00',
    streak: 7,
    last_answered: new Date().toISOString(),
    createdAt: new Date().toISOString(),
};

export const MOCK_ANSWER_RECORD: AnswerRecord = {
    _id: 'answer-001',
    userId: 'mock-user-001',
    date: new Date().toISOString(),
    question_ids: ['q-food-1', 'q-water-3', 'q-transport-2'],
    answers: ['Y', 'Hmm', 'N'],
    points_awarded: 5,
};
