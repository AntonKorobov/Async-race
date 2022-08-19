import {
    createCar,
    createWinner,
    deleteCar,
    deleteWinner,
    getCar,
    getCars,
    getWinners,
    startStopCarEngine,
    switchDriveMode,
    updateCar,
    updateWinner,
} from './api';
import { storage } from './storage';
import { carDataInterface, OrderType, raceResult } from './types';
import { generateHundredCars } from './utils';

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

export function createCarImage(color: string, id: number): string {
    return `<svg class="car__img" id="car-${id}" width="90" height="42" xmlns="http://www.w3.org/2000/svg" data-id="${id}">
  <g class="prefix__ldl-scale">
      <path d="m69.3,42.4c-5,0 -9,-3.5 -10.2,-8a3.6,3.6 0 0 1 -0.4,0l-28.4,0a10.5,10.5 0 0 1 -20.4,-0.2a3.5,3.5 0 0 1 -0.9,0c-5.1,-0.9 -9,-5.3 -9,-10.5l0,-0.6c0,-5.7 3.5,-10.8 8,-11.6c2,-0.3 5.7,-2.5 7.9,-5c3.3,-3.7 9.5,-6.4 14.5,-6.5l14.4,0a22,22 0 0 1 14.7,6.5l0.2,0.2a22,22 0 0 0 10,5.5l10,2c5.6,1 10,5.6 10.3,10.5c0,2.3 -0.8,4.6 -2.4,6.3a11,11 0 0 1 -7.8,3.4l-0.3,0c-1.1,4.6 -5.3,8 -10.2,8z" fill="#d1d1d1"/>
      <path d="m19.7,24.9a7,7 0 1 1 0,14a7,7 0 1 1 0,-14zm49.3,0a7,7 0 1 1 0,14a7,7 0 0 1 -7,-7a7,7 0 0 1 7,-7zm9.8,-7.3l-10.1,-1.9c-4,-0.7 -9.3,-3.7 -12,-6.6l-0.2,-0.3c-2.6,-2.9 -8,-5.3 -12,-5.2l-14.5,0c-4,0 -9.3,2.4 -12,5.3s-7,5.6 -9.8,6c-2.8,0.7 -5.2,4.3 -5,8.3l0,0.5c0,3.6 2.7,6.5 6,7.1a10.6,10.6 0 0 1 21,0.1l28.2,0a10.6,10.6 0 0 1 21,0c3.8,0 6.8,-2.7 6.7,-6c-0.1,-3.2 -3.4,-6.4 -7.3,-7.2l0,-0.1zm-54.6,-1.4c-4,0 -5.7,-2 -4,-4.3c2,-2.4 6.7,-4.4 10.6,-4.4l4,0l2.5,8.8l-13.1,0l0,-0.1zm27.7,0.1l-10.8,0l-2.6,-8.8l5.5,0c4,0 9,2 11.2,4.4c2.1,2.5 0.7,4.5 -3.3,4.4z" fill="${color}"/>
  </g>
</svg>`;
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

export function createCarUtil(name: string, color: string): void {
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

export function updateCarUtil(id: number, name: string, color: string): void {
    if (name === '') {
        alert('Name is empty');
    } else {
        const tryUpdateCar = new Promise((resolve) => {
            resolve(updateCar<carDataInterface[]>(id, name, color));
        });
        tryUpdateCar.then(() => renderGaragePage());
    }
}

export async function stopCarEngineUtil(carId: number) {
    const tryStopCar = new Promise((resolve) => {
        resolve(startStopCarEngine(carId, 'stopped'));
    });
    tryStopCar.then(() => cancelAnimationFrame(storage.animation[carId]));
}

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

    const count = await getWinners();
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

export function addEvents(): void {
    const createNameInput = document.querySelector('.control-panel__car-name-input_create') as HTMLInputElement;
    const createColorInput = document.querySelector('.control-panel__car-color-input_create') as HTMLInputElement;

    const updateCarButton = document.querySelector('.control-panel__button_update') as HTMLElement;
    const updateNameInput = document.querySelector('.control-panel__car-name-input_update') as HTMLInputElement;
    const updateColorInput = document.querySelector('.control-panel__car-color-input_update') as HTMLInputElement;

    const createCarButton = document.querySelector('.control-panel__button_create') as HTMLElement;
    createCarButton.addEventListener('click', () => {
        const name = createNameInput.value;
        const color = createColorInput.value;
        createCarUtil(name, color);
    });

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
            updateNameInput.removeAttribute('disabled');
            updateColorInput.removeAttribute('disabled');
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
        updateCarUtil(id, updateNameInput.value, updateColorInput.value);
        deselectCars();
        updateCarButton.setAttribute('disabled', '');
        updateNameInput.setAttribute('disabled', '');
        updateColorInput.setAttribute('disabled', '');
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
