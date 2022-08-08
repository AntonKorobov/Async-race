// interface winnerInterface {
//     id: number,
//     time: number,
//     name: string,
//     color: string,
//     winsCounter: number,
// }

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
