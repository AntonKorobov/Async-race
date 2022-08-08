interface storageInterface {
    cars: number[];
    animation: { [carId: number]: number };
    winners: { [carId: number]: number };
}

export const storage: storageInterface = {
    cars: [],
    animation: {},
    winners: {},
};
