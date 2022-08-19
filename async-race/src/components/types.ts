export interface carDataInterface {
    name: string;
    color: string;
    id: number;
}

export type getCarResponse = {
    name: string;
    color: string;
    id: number;
};

export type getCarsResponse = {
    cars: Array<{
        name: string;
        color: string;
        id: number;
    }>;
    count: string | null;
};

export type engineStatus = 'started' | 'stopped';

export type startCarEngineResponse = {
    velocity: number;
    distance: number;
};

export type driveCarResponse = {
    success: boolean;
};

export type getWinnerResponse = {
    id: number;
    wins: number;
    time: number;
};

export type SortType = 'id' | 'wins' | 'time';
export type OrderType = 'asc' | 'desc';
export type getWinnersResponse = {
    winners: Array<{
        id: number;
        wins: number;
        time: number;
    }>;
    count: string | null;
};

export type raceResult = {
    carId: number;
    driveTime: number;
};
