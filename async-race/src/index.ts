import './global.css';
import { getCars } from './components/getCars';
import { carDataInterface } from './components/getCars';

const cars = await getCars<carDataInterface[]>(1);
addCarsToGarage(cars);

function addCarsToGarage(cars: carDataInterface[]): void {
    const garage = document.querySelector('.racing-area__garage') as HTMLElement;
    for (let i = 0; i < cars.length; i++) {
        const car = document.createElement('div');
        car.classList.add('car');
        car.innerHTML = addCar(i);
        garage.appendChild(car);
    }
}

export function addCar(position: number): string {
    return `<div class="car__settings-wrapper">
      <button class="car__button">SELECT</button>
      <button class="car__button">REMOVE</button>
      <h2 class="car__name">${cars[position].name}</h2>
    </div>
    <img class="car__img" src="./assets/car.svg" alt="car">
    <div class="car__buttons-wrapper">
      <button class="car__button">STOP</button>
      <button class="car__button car__button_play">GO</button>
    </div>`
}
