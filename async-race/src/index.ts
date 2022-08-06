import './global.css';
import { render, renderGarage } from './components/ui';
import { createCarUtil } from './components/utilits';

render();
renderGarage();

const createCarButton = document.querySelector('.control-panel__button_create') as HTMLElement;
createCarButton.addEventListener('click', () => {
    createCarUtil();
});
