import { carDataInterface } from './dataInterface';

export function renderGarage(cars: carDataInterface[]): void {
    const garage = document.querySelector('.racing-area__garage') as HTMLElement;
    for (let i = 0; i < cars.length; i++) {
        const car = document.createElement('div');
        car.classList.add('car');
        car.innerHTML = renderCar(cars[i].name);
        garage.appendChild(car);
    }
}

export function renderCar(name: string): string {
    return `
    <div class="car__settings-wrapper">
      <button class="car__button">SELECT</button>
      <button class="car__button">REMOVE</button>
      <h2 class="car__name">${name}</h2>
    </div>
    <img class="car__img" src="./assets/car.svg" alt="car">
    <div class="car__buttons-wrapper">
      <button class="car__button">STOP</button>
      <button class="car__button car__button_play">GO</button>
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
            <input type="text" class="control-panel__car-name-input" name="add-car-name">
            <input type="color" class="control-panel__car-color-input" name="create-car-color" value="#ed9121">
            <button class="control-panel__button button">CREATE</button>
          </div>
          <div class="control-panel__form-wrapper">
            <input type="text" class="control-panel__car-name-input" name="change-car-name">
            <input type="color" class="control-panel__car-color-input" name="update-car-color" value="#ed9121">
            <button class="control-panel__button button">UPDATE</button>
          </div>
        </div>
        <div class="control-panel__button-wrapper">
          <button class="button">RESET</button>
          <button class="button">GENERATE CARS</button>
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
