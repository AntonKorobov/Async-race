import './global.css';
import { render, renderGarage } from './components/ui';
import { createCarUtil, deleteCarUtil } from './components/utilits';

render();
renderGarage();

const createCarButton = document.querySelector('.control-panel__button_create') as HTMLElement;
createCarButton.addEventListener('click', () => {
    createCarUtil();
});

const garage = document.querySelector('.racing-area__garage') as HTMLElement;
garage.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).classList.contains('car__button_remove')) {
        const id = Number((event.target as HTMLElement).getAttribute('data-id'));
        deleteCarUtil(id);
    }
});
