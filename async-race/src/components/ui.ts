import { carDataInterface } from './dataInterface';
import { getCars } from './api';
import { createCarUtil, deleteCarUtil, updateCarUtil } from './utilits';

export async function renderGarage(): Promise<void> {
    const cars = await getCars<carDataInterface[]>(1);
    const garage = document.querySelector('.racing-area__garage') as HTMLElement;
    garage.innerHTML = '';
    for (let i = 0; i < cars.length; i++) {
        const car = document.createElement('div');
        car.classList.add('car');
        car.innerHTML = renderCar(cars[i].name, cars[i].id);
        garage.appendChild(car);
    }
}

export function renderCar(name: string, id: number): string {
    return `
    <div class="car__settings-wrapper">
      <button class="car__button car__button_select" data-id="${id}">SELECT</button>
      <button class="car__button car__button_remove" data-id="${id}">REMOVE</button>
      <h2 class="car__name">${name}</h2>
    </div>
    <img class="car__img" src="./assets/car.svg" alt="car" data-id="${id}">
    <div class="car__buttons-wrapper">
      <button class="car__button car__button_stop" data-id="${id}">STOP</button>
      <button class="car__button car__button_play" data-id="${id}">GO</button>
    </div>`;
}

export function render(): void {
    const html = `
    <header class="header">
      <div class="header__container container">
        <a href="#" class="title">
          <h1>Async-race</h1>
        </a>
      </div>
  </header>
  <main class="main">
    <div class="main__container container">
      <section class="control-panel">
        <div class="control-panel__page-buttons-wrapper">
          <button class="button">TO GARAGE</button>
          <button class="button">TO WINNERS</button>
        </div>
        <div class="control-panel__create-update-wrapper">
          <div class="control-panel__form-wrapper">
            <input type="text" class="control-panel__car-name-input_create" name="add-car-name">
            <input type="color" class="control-panel__car-color-input_create" name="create-car-color" value="#ed9121">
            <button class="control-panel__button control-panel__button_create button">CREATE</button>
          </div>
          <div class="control-panel__form-wrapper">
            <input type="text" class="control-panel__car-name-input_update" name="change-car-name" disabled>
            <input type="color" class="control-panel__car-color-input_update" name="update-car-color" value="#ed9121" disabled>
            <button class="control-panel__button control-panel__button_update button" disabled>UPDATE</button>
          </div>
        </div>
        <div class="control-panel__button-wrapper">
          <button class="control-panel__button control-panel__button_reset button">RESET</button>
          <button class="control-panel__button control-panel__button_generate button">GENERATE CARS</button>
        </div>
      </section>
      <section class="racing-area">
        <div class="racing-area__garage">
        </div>
        <div class="racing-area__track">
        </div>
        <div class="racing-area__finish">
        </div>
      </section>
    </div>
  </main>
  <footer class="footer">
    <div class="footer__container container">
      <p class="link-wrapper">
        <a class="rss-link" href="https://rs.school/js/">
          <img src="./assets/rs_school_js.svg" alt="rs school logo" class="rss__logo">
        </a>
      </p>
      <p class="link-wrapper">
        <a class="github-link" href="https://github.com/NewAnton/">
          <img src="./assets/iconmonstr-github-2.svg" alt="github logo" class="github__logo">
          <span class="github-link_description">© 2022 Anton Korobov</span>
        </a>
      </p>
    </div>
  </footer>`;

    const mainPage = document.createElement('div');
    mainPage.classList.add('main-page');
    mainPage.innerHTML = html;
    document.body.appendChild(mainPage);
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
