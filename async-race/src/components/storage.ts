interface winnersInterface {
    id: number;
    name: string;
    color: string;
    wins: number;
    time: number;
}

interface storageInterface {
    cars: number[];
    animation: { [carId: number]: number };
    winners: winnersInterface[];
}

export const storage: storageInterface = {
    cars: [],
    animation: {},
    winners: [],
};
