export function generateHundredCars(): { name: string; color: string }[] {
    return new Array(100).fill(1).map(() => ({ name: getRandomCarName(), color: getRandomColor() }));
}

export function getRandomCarName(): string {
    const arrayOfModel = [
        'Volvo',
        'Mclaren',
        'Nissan',
        'Skoda',
        'Mini',
        'Renault',
        'Land Rover',
        'Audi',
        'Bugatti',
        'Chevrolet',
    ];
    const arrayOfNames = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10'];

    const model = arrayOfModel[Math.floor(Math.random() * arrayOfModel.length)];
    const name = arrayOfNames[Math.floor(Math.random() * arrayOfNames.length)];
    return `${model} ${name}`;
}

export function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
