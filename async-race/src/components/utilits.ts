import { createCar, deleteCar, updateCar } from './api';
import { renderGarage } from './ui';
import { carDataInterface } from './dataInterface';

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
        tryCreateCar.then(() => renderGarage());
    }
}

export function deleteCarUtil(id: number): void {
    const tryCreateCar = new Promise((resolve) => {
        resolve(deleteCar<carDataInterface[]>(id));
    });
    tryCreateCar.then(() => renderGarage());
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
        tryUpdateCar.then(() => renderGarage());
    }
}

export function startCarEngine(carImage: HTMLElement): number {
    const TRACK_LENGTH = (document.querySelector('.racing-area__track') as HTMLElement).offsetWidth + 100;
    const duration = 5000;

    const carEngineId = requestAnimationFrame(startCarAnimation);
    let start = 0;
    function startCarAnimation (timestamp: number) {
        if (start === 0) start = timestamp;
        const progress = (timestamp - start) / duration;
        carImage.style.transform = `translateX(${TRACK_LENGTH * progress}px)`; 
        if (progress < 1) {
            requestAnimationFrame(startCarAnimation);
        } else {
            cancelAnimationFrame(carEngineId);
        }
    }
    return carEngineId;
}

export function stopEngine(requestId: number) {
    window.cancelAnimationFrame(requestId);
}

export function addEvents(): void {
    const createCarButton = document.querySelector('.control-panel__button_create') as HTMLElement;
    createCarButton.addEventListener('click', () => {
        createCarUtil();
    });

    const updateCarButton = document.querySelector('.control-panel__button_update') as HTMLElement;
    const nameInput = document.querySelector('.control-panel__car-name-input_update') as HTMLInputElement;
    const colorInput = document.querySelector('.control-panel__car-color-input_update') as HTMLInputElement;

    const garage = document.querySelector('.racing-area__garage') as HTMLElement;
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
            // const id = Number((event.target as HTMLElement).getAttribute('data-id'));
            const carImage = (event.target as HTMLElement).parentElement?.previousElementSibling as HTMLElement;
            const stopButton = (event.target as HTMLElement).previousElementSibling as HTMLElement;
            stopButton.setAttribute('carEngineId', startCarEngine(carImage).toString());
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
}
