// Neeru feature types

export interface WaterLog {
    _id: string;
    userId: string;
    month: number;
    year: number;
    city: string;
    kl_used: number;
    createdAt: string;
}

export interface Equivalency {
    label: string;
    value: string;
}

export interface NeeruLogResponse {
    log: WaterLog;
    equivalencies: Equivalency[];
}

export interface NeeruHistoryResponse {
    logs: WaterLog[];
}
