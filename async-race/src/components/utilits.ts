import {
    createCar,
    deleteCar,
    updateCar,
    startStopCarEngine,
    switchDriveMode,
    createWinner,
    updateWinner,
    getWinners,
    getCar,
    deleteWinner,
    OrderType,
} from './api';
import { renderGaragePage, renderWinnersPage, renderCars } from './ui';
import { carDataInterface } from './dataInterface';
import { storage } from './storage';

export function createCarUtil(): void {
    const nameInput = document.querySelector('.control-panel__car-name-input_create') as HTMLInputElement;
    const colorInput = document.querySelector('.control-panel__car-color-input_create') as HTMLInputElement;
    const name = nameInput.value;
    const color = colorInput.value;
    if (name === '') {
        alert('Name is empty');
    } else {
        const tryCreateCar = new Promise((resolve) => {
            resolve(createCar<carDataInterface[]>(name, color));
        });
        tryCreateCar.then(() => renderGaragePage());
    }
}

export function deleteCarUtil(id: number): void {
    const tryCreateCar = new Promise((resolve) => {
        resolve(deleteCar<carDataInterface[]>(id));
    });
    tryCreateCar.then(() => renderGaragePage());
    tryCreateCar.then(() => deleteWinner(id));
}

export function updateCarUtil(id: number): void {
    const nameInput = document.querySelector('.control-panel__car-name-input_update') as HTMLInputElement;
    const colorInput = document.querySelector('.control-panel__car-color-input_update') as HTMLInputElement;
    const name = nameInput.value;
    const color = colorInput.value;
    if (name === '') {
        alert('Name is empty');
    } else {
        const tryUpdateCar = new Promise((resolve) => {
            resolve(updateCar<carDataInterface[]>(id, name, color));
        });
        tryUpdateCar.then(() => renderGaragePage());
    }
}

export type raceResult = {
    carId: number;
    driveTime: number;
};
export async function startCarEngineUtil(carId: number): Promise<raceResult> {
    const { velocity, distance } = await startStopCarEngine(carId, 'started');
    const carImage = document.querySelector(`#car-${carId}`) as HTMLElement;

    animation(carId, carImage, velocity, distance);
    const { success } = await switchDriveMode(carId);
    cancelAnimationFrame(storage.animation[carId]);
    const driveTime = storage.animation[carId];
    if (success) {
        return Promise.resolve({ carId, driveTime });
    }
    return Promise.reject({ carId, driveTime });
}

export function animation(carId: number, carImage: HTMLElement, velocity: number, distance: number): void {
    const TRACK_LENGTH = (document.querySelector('.page-area__track') as HTMLElement).offsetWidth + 100;
    let start = 0;
    let driveTime = 0;

    function startCarAnimation(timestamp: number) {
        const duration = distance / velocity;
        if (start === 0) start = timestamp;
        driveTime = timestamp - start;
        const progress = driveTime / duration;
        carImage.style.transform = `translateX(${TRACK_LENGTH * progress}px)`;
        if (progress < 1) {
            storage.animation[carId] = requestAnimationFrame(startCarAnimation);
        } else {
            cancelAnimationFrame(storage.animation[carId]);
        }
    }

    storage.animation[carId] = requestAnimationFrame(startCarAnimation);
}

export async function stopCarEngineUtil(carId: number) {
    const tryStopCar = new Promise((resolve) => {
        resolve(startStopCarEngine(carId, 'stopped'));
    });
    tryStopCar.then(() => cancelAnimationFrame(storage.animation[carId]));
}

export async function startRace(action: (id: number) => Promise<raceResult>): Promise<void> {
    returnCarsOnStartPosition();
    closeModalWindowWinner();
    const tryStartAllCarsPromises: Promise<raceResult>[] = storage.cars.map((id) => action(id));
    const { carId, driveTime } = await Promise.any(tryStartAllCarsPromises);
    addInformationToWinList(carId, driveTime);
    const carModel = await getCar(carId);
    showWinner(carModel.name, driveTime / 1000);
}

export function showWinner(model: string, driveTime: number): void {
    const modalWindowWinnerText = document.querySelector('.modal-window-winner__information_text') as HTMLElement;
    modalWindowWinnerText.innerHTML = `"${model}" WIN RACE<br>TIME: ${driveTime}sec`;
    const modalWindowWinner = document.querySelector('.modal-window-winner') as HTMLElement;
    modalWindowWinner.classList.add('modal-window-winner_visible');
}

export async function addInformationToWinList(id: number, driveTime: number): Promise<void> {
    const arrayOfWinners = await getWinners(1, 10, storage.sort, 'desc');
    const isWinnerExists = arrayOfWinners.winners.find((element) => element.id === id);
    if (!isWinnerExists) {
        await createWinner(id, 1, driveTime / 1000);
    } else {
        const { id, wins, time } = isWinnerExists;
        if (driveTime > time) driveTime = time;
        await updateWinner(id, wins + 1, driveTime);
    }
    updateWinners(storage.sort);
}

export function returnCarsOnStartPosition(): void {
    const cars: NodeListOf<HTMLElement> = document.querySelectorAll('.car__img');
    cars.forEach((car) => {
        car.style.transform = `translateX(0)`;
    });
}

export function closeModalWindowWinner(): void {
    const modalWindowWinner = document.querySelector('.modal-window-winner') as HTMLElement;
    modalWindowWinner.classList.remove('modal-window-winner_visible');
}

export async function updateWinners(sort: 'time' | 'wins'): Promise<void> {
    storage.winners.length = 0;
    storage.sort = sort;
    let sortType: OrderType = 'desc';
    if (storage.sort === 'time') sortType = 'asc';

    const count = await getWinners(1);
    if (count.count) {
        storage.winnersCount = count.count;
    }
    const arrayOfWinners = await getWinners(storage.winnersPage, storage.limitWinners, storage.sort, sortType);
    await Promise.all(
        arrayOfWinners.winners.map(async (winner: { id: number; wins: number; time: number }) => {
            const { name, color, id } = await getCar(winner.id);
            const wins = winner.wins;
            const time = winner.time;
            storage.winners.push({ id, name, color, wins, time });
        })
    );
}

export function generateHundredCars(): { name: string; color: string }[] {
    return new Array(100).fill(1).map(() => ({ name: getRandomCarName(), color: getRandomColor() }));
}

export function getRandomCarName(): string {
    const arrayOfModel = [
        'Volvo',
        'Mclaren',
        'Nissan',
        'Skoda',
        'Mini',
        'Renault',
        'Land Rover',
        'Audi',
        'Bugatti',
        'Chevrolet',
    ];
    const arrayOfNames = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10'];

    const model = arrayOfModel[Math.floor(Math.random() * arrayOfModel.length)];
    const name = arrayOfNames[Math.floor(Math.random() * arrayOfNames.length)];
    return `${model} ${name}`;
}

export function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function addEvents(): void {
    const createCarButton = document.querySelector('.control-panel__button_create') as HTMLElement;
    createCarButton.addEventListener('click', () => {
        createCarUtil();
    });

    const updateCarButton = document.querySelector('.control-panel__button_update') as HTMLElement;
    const nameInput = document.querySelector('.control-panel__car-name-input_update') as HTMLInputElement;
    const colorInput = document.querySelector('.control-panel__car-color-input_update') as HTMLInputElement;

    const garage = document.querySelector('.page-area__garage') as HTMLElement;
    garage.addEventListener('click', (event) => {
        if ((event.target as HTMLElement).classList.contains('car__button_remove')) {
            const id = Number((event.target as HTMLElement).getAttribute('data-id'));
            deleteCarUtil(id);
        }

        if ((event.target as HTMLElement).classList.contains('car__button_select')) {
            deselectCars();
            (event.target as HTMLElement).parentElement?.nextElementSibling?.classList.add('selected');
            updateCarButton.removeAttribute('disabled');
            nameInput.removeAttribute('disabled');
            colorInput.removeAttribute('disabled');
        }

        if ((event.target as HTMLElement).classList.contains('car__button_go')) {
            const id = Number((event.target as HTMLElement).getAttribute('data-id'));
            startCarEngineUtil(id);
        }

        if ((event.target as HTMLElement).classList.contains('car__button_stop')) {
            const id = Number((event.target as HTMLElement).getAttribute('data-id'));
            stopCarEngineUtil(id);
        }
    });

    updateCarButton.addEventListener('click', () => {
        const id = Number((document.querySelector('.selected') as HTMLElement).getAttribute('data-id'));
        updateCarUtil(id);
        deselectCars();
        updateCarButton.setAttribute('disabled', '');
        nameInput.setAttribute('disabled', '');
        colorInput.setAttribute('disabled', '');
    });

    function deselectCars(): void {
        Array.from(document.querySelectorAll('.selected')).forEach((element) => element.classList.remove('selected'));
    }

    const raceButton = document.querySelector('.control-panel__button_race') as HTMLElement;
    raceButton.addEventListener('click', () => {
        startRace(startCarEngineUtil);
    });

    const resetButton = document.querySelector('.control-panel__button_reset') as HTMLElement;
    resetButton.addEventListener('click', () => {
        storage.cars.map((id) => {
            stopCarEngineUtil(id);
        });
        returnCarsOnStartPosition();
        closeModalWindowWinner();
    });

    const winnersButton = document.querySelector('.control-panel__button_to-winners') as HTMLElement;
    winnersButton.addEventListener('click', () => {
        renderWinnersPage();
        storage.currentWindow = 'winners';
    });

    const garageButton = document.querySelector('.control-panel__button_to-garage') as HTMLElement;
    garageButton.addEventListener('click', () => {
        renderGaragePage();
        storage.currentWindow = 'garage';
    });

    const generateButton = document.querySelector('.control-panel__button_generate') as HTMLElement;
    generateButton.addEventListener('click', () => {
        const hundredCars = generateHundredCars();
        hundredCars.forEach((element) => createCar(element.name, element.color));
        renderGaragePage();
    });

    const crossButton = document.querySelector('.modal-window-winner_cross-button') as HTMLElement;
    crossButton.addEventListener('click', () => {
        returnCarsOnStartPosition();
        closeModalWindowWinner();
    });

    const currentPageIcon = document.querySelector('.pagination__page-number') as HTMLElement;
    const paginationLeftButton = document.querySelector('.pagination__left') as HTMLElement;
    paginationLeftButton.addEventListener('click', () => {
        switch (storage.currentWindow) {
            case 'garage':
                if (storage.garagePage !== 1) storage.garagePage -= 1;
                currentPageIcon.innerHTML = storage.garagePage.toString();
                renderCars();
                break;
            case 'winners':
                if (storage.winnersPage !== 1) storage.winnersPage -= 1;
                storage.winnersPage.toString();
                renderWinnersPage();
                break;
        }
    });

    const paginationRightButton = document.querySelector('.pagination__right') as HTMLElement;
    paginationRightButton.addEventListener('click', () => {
        switch (storage.currentWindow) {
            case 'garage':
                if (storage.garagePage < Number(storage.carsCount) / storage.limitGarage) storage.garagePage += 1;
                currentPageIcon.innerHTML = storage.garagePage.toString();
                renderCars();
                break;
            case 'winners':
                if (storage.winnersPage < Number(storage.winnersCount) / storage.limitWinners) storage.winnersPage += 1;
                currentPageIcon.innerHTML = storage.winnersPage.toString();
                renderWinnersPage();
                break;
        }
    });

    const sortByTimeButton = document.querySelector('.page-area_time-button') as HTMLElement;
    sortByTimeButton.addEventListener('click', () => {
        storage.sort = 'time';
        renderWinnersPage();
    });

    const sortByWinsButton = document.querySelector('.page-area_wins-button') as HTMLElement;
    sortByWinsButton.addEventListener('click', () => {
        storage.sort = 'wins';
        renderWinnersPage();
    });
}
