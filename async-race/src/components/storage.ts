interface storageInterface {
    cars: number[];
    animation: { [carId: number]: number };
}

export const storage: storageInterface = {
    cars: [],
    animation: {},
};
