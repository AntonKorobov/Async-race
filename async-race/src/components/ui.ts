import { getCars } from './api';
import { storage } from './storage';
import { updateWinners } from './utilits';

export async function renderCars(): Promise<void> {
    storage.cars.length = 0;

    const count = await getCars(1);
    if (count.count) {
        storage.carsCount = count.count;
    }

    const cars = await getCars(storage.garagePage, storage.limitGarage);

    const garage = document.querySelector('.page-area__garage') as HTMLElement;

    garage.innerHTML = '';
    for (let i = 0; i < cars.cars.length; i++) {
        const car = document.createElement('div');
        car.classList.add('car');
        car.innerHTML = renderCar(cars.cars[i].name, cars.cars[i].id, cars.cars[i].color);
        garage.appendChild(car);

        storage.cars.push(cars.cars[i].id);
    }
}

export function createCarImage(color: string, id: number): string {
    return `<svg class="car__img" id="car-${id}" width="90" height="42" xmlns="http://www.w3.org/2000/svg" data-id="${id}">
  <g class="prefix__ldl-scale">
      <path d="m69.3,42.4c-5,0 -9,-3.5 -10.2,-8a3.6,3.6 0 0 1 -0.4,0l-28.4,0a10.5,10.5 0 0 1 -20.4,-0.2a3.5,3.5 0 0 1 -0.9,0c-5.1,-0.9 -9,-5.3 -9,-10.5l0,-0.6c0,-5.7 3.5,-10.8 8,-11.6c2,-0.3 5.7,-2.5 7.9,-5c3.3,-3.7 9.5,-6.4 14.5,-6.5l14.4,0a22,22 0 0 1 14.7,6.5l0.2,0.2a22,22 0 0 0 10,5.5l10,2c5.6,1 10,5.6 10.3,10.5c0,2.3 -0.8,4.6 -2.4,6.3a11,11 0 0 1 -7.8,3.4l-0.3,0c-1.1,4.6 -5.3,8 -10.2,8z" fill="#d1d1d1"/>
      <path d="m19.7,24.9a7,7 0 1 1 0,14a7,7 0 1 1 0,-14zm49.3,0a7,7 0 1 1 0,14a7,7 0 0 1 -7,-7a7,7 0 0 1 7,-7zm9.8,-7.3l-10.1,-1.9c-4,-0.7 -9.3,-3.7 -12,-6.6l-0.2,-0.3c-2.6,-2.9 -8,-5.3 -12,-5.2l-14.5,0c-4,0 -9.3,2.4 -12,5.3s-7,5.6 -9.8,6c-2.8,0.7 -5.2,4.3 -5,8.3l0,0.5c0,3.6 2.7,6.5 6,7.1a10.6,10.6 0 0 1 21,0.1l28.2,0a10.6,10.6 0 0 1 21,0c3.8,0 6.8,-2.7 6.7,-6c-0.1,-3.2 -3.4,-6.4 -7.3,-7.2l0,-0.1zm-54.6,-1.4c-4,0 -5.7,-2 -4,-4.3c2,-2.4 6.7,-4.4 10.6,-4.4l4,0l2.5,8.8l-13.1,0l0,-0.1zm27.7,0.1l-10.8,0l-2.6,-8.8l5.5,0c4,0 9,2 11.2,4.4c2.1,2.5 0.7,4.5 -3.3,4.4z" fill="${color}"/>
  </g>
</svg>`;
}

export function renderCar(name: string, id: number, color: string): string {
    return `
    <div class="car__settings-wrapper">
      <button class="car__button car__button_select" data-id="${id}">SELECT</button>
      <button class="car__button car__button_remove" data-id="${id}">REMOVE</button>
      <h2 class="car__name">${name}</h2>
    </div>
    ${createCarImage(color, id)}
    <div class="car__buttons-wrapper">
      <button class="car__button car__button_stop" data-id="${id}">STOP</button>
      <button class="car__button car__button_go" data-id="${id}">GO</button>
    </div>`;
}

export function render(): void {
    const html = `
    <header class="header">
      <div class="header__container container">
        <a href="#" class="title">
          <h1>Async-race (Work in progress... Sorry)</h1>
        </a>
      </div>
  </header>
  <main class="main">
    <div class="modal-window-winner">
      <div class="modal-window-winner__information">
        <p class="modal-window-winner__information_text"></p>
      </div>
      <button class="modal-window-winner_cross-button">&times</button>
    </div>
    <div class="main__container container">
      <section class="control-panel">
        <div class="control-panel__page-buttons-wrapper">
          <button class="button control-panel__button_to-garage">TO GARAGE</button>
          <button class="button control-panel__button_to-winners">TO WINNERS</button>
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
          <button class="control-panel__button control-panel__button_race button">RACE</button>
          <button class="control-panel__button control-panel__button_reset button">RESET</button>
          <button class="control-panel__button control-panel__button_generate button">GENERATE CARS</button>
        </div>
        <div class="control-panel__pagination-buttons pagination">
          <button class="button pagination__left">LEFT</button>
          <p class="pagination__page-number" data-page="${storage.garagePage}">${storage.garagePage}</p>
          <button class="button pagination__right">RIGHT</button>
        </div>
      </section>
      <section class="page-area page-area_garage-page page-visible">
        <div class="page-area__garage">
        </div>
        <div class="page-area__track">
        </div>
        <div class="page-area__finish">
        </div>
      </section>
      <section class="page-area page-area_winners-page">
        <div class="page-area__winners-table-wrapper">
        </div>
        <button class="button page-area_wins-button">Sort by Wins</button>
        <button class="button page-area_time-button">Sort by Time</button>
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

export async function renderWinnersPage(): Promise<void> {
    await updateWinners(storage.sort);

    const currentPageIcon = document.querySelector('.pagination__page-number') as HTMLElement;
    currentPageIcon.innerHTML = storage.winnersPage.toString();
    const garagePage = document.querySelector('.page-area_garage-page') as HTMLElement;
    garagePage.classList.remove('page-visible');

    const winnersPage = document.querySelector('.page-area_winners-page') as HTMLElement;
    winnersPage.classList.add('page-visible');
    const winnersTable = document.querySelector('.page-area__winners-table-wrapper') as HTMLElement;
    const html = `
    <div class="winners-table">
      <table>
          <tr>
            <th>№</th>
            <th>Car</th>
            <th>Model</th>
            <th>Wins</th>
            <th>Time(sec)</th>
          </tr>
        ${storage.winners
            .map(
                (winner: { id: number; name: string; color: string; wins: number; time: number }, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${createCarImage(winner.color, winner.id)}</td>
              <td>${winner.name}</td>
              <td>${winner.wins}</td>
              <td>${winner.time}</td>
            </tr>`
            )
            .join('')}
      </table>
  </div>`;

    winnersTable.innerHTML = html;
}

export async function renderGaragePage(): Promise<void> {
    const currentPageIcon = document.querySelector('.pagination__page-number') as HTMLElement;
    currentPageIcon.innerHTML = storage.garagePage.toString();
    const garagePage = document.querySelector('.page-area_garage-page') as HTMLElement;
    garagePage.classList.add('page-visible');

    const winnersPage = document.querySelector('.page-area_winners-page') as HTMLElement;
    winnersPage.classList.remove('page-visible');
    renderCars();
}
