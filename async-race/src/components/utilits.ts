import { createCar, deleteCar } from './api';
import { renderGarage } from './ui';
import { carDataInterface } from './dataInterface';

export function createCarUtil(): void {
    const nameInput = document.querySelector('.control-panel__car-name-input') as HTMLInputElement;
    const colorInput = document.querySelector('.control-panel__car-color-input') as HTMLInputElement;
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
