import { carDataInterface } from './components/dataInterface';
import { getCars } from './components/getCars';
import { render, renderGarage } from './components/ui';
import './global.css';

const cars = await getCars<carDataInterface[]>(1);

render();
renderGarage(cars);
