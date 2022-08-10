interface winnersInterface {
    id: number;
    name: string;
    color: string;
    wins: number;
    time: number;
}

interface storageInterface {
    currentWindow: 'garage' | 'winners';
    garagePage: number;
    winnersPage: number;
    cars: number[];
    animation: { [carId: number]: number };
    winners: winnersInterface[];
}

export const storage: storageInterface = {
    currentWindow: 'garage',
    garagePage: 1,
    winnersPage: 1,
    cars: [],
    animation: {},
    winners: [],
};
