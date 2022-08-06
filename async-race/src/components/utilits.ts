import { createCar } from './api';
import { renderGarage } from './ui';

export function createCarUtil(): void {
    const nameInput = document.querySelector('.control-panel__car-name-input') as HTMLInputElement;
    const colorInput = document.querySelector('.control-panel__car-color-input') as HTMLInputElement;
    const name = nameInput.value;
    const color = colorInput.value;
    if (name !== '') {
        const tryCreateCar = new Promise((resolve) => {
            resolve(createCar(name, color));
        });
        tryCreateCar.then(() => renderGarage());
    }
}
