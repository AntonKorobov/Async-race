import {
    createCar,
    deleteCar,
    updateCar,
    startStopCarEngine,
    switchDriveMode,
    createWinner,
    updateWinner,
    getWinner,
} from './api';
import { renderGaragePage, renderWinnersPage } from './ui';
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
    // success: boolean;
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
    // console.log(success, carId, driveTime);
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
    addInformationToWinnList(carId, driveTime);
    showWinner(carId, driveTime / 1000);
    // console.log(storage.winners);
}

export function showWinner(id: number, driveTime: number): void {
    const modalWindowWinnerText = document.querySelector('.modal-window-winner__information_text') as HTMLElement;
    modalWindowWinnerText.innerHTML = `CAR: ${id} WIN RACE<br>TIME: ${driveTime}sec`;
    const modalWindowWinner = document.querySelector('.modal-window-winner') as HTMLElement;
    modalWindowWinner.classList.add('modal-window-winner_visible');
}

export async function addInformationToWinnList(id: number, driveTime: number): Promise<void> {
    const isWinnerExists = await getWinner(id);
    if (Object.keys(isWinnerExists).length === 0) {
        await createWinner(id, 1, driveTime);
    } else {
        const { id, wins, time } = isWinnerExists;
        let winsCounter = wins;
        if (winsCounter) winsCounter = 0;
        if (driveTime > time) driveTime = time;
        await updateWinner(id, winsCounter + 1, driveTime);
    }
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
    });

    const garageButton = document.querySelector('.control-panel__button_to-garage') as HTMLElement;
    garageButton.addEventListener('click', () => {
        renderGaragePage();
    });
}
