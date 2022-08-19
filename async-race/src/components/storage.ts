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
    allCarsNumber: number;
    limitGarage: number;
    limitWinners: number;
    sort: 'time' | 'wins';
    winnersCount: string;
    carsCount: string;
}

export const storage: storageInterface = {
    currentWindow: 'garage',
    garagePage: 1,
    winnersPage: 1,
    cars: [],
    animation: {},
    winners: [],
    allCarsNumber: 0,
    limitGarage: 7,
    limitWinners: 10,
    sort: 'time',
    winnersCount: '0',
    carsCount: '0',
};
