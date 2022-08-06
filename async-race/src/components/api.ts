const limitGarage = 100;

export const getCars = async <T>(page: number, limit = limitGarage): Promise<T> => {
    const response = await fetch(`http://127.0.0.1:3000/garage?_page=${page}&_limit=${limit}`);
    if (response.ok) {
        return await response.json();
    } else {
        const error = new Error('Error HTTP: ' + response.status);
        return Promise.reject(error);
    }
};

export const createCar = async <T>(name: string, color: string): Promise<T> => {
    const response = await fetch(`http://127.0.0.1:3000/garage/`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            color: color,
        }),
    });
    if (response.ok) {
        return await response.json();
    } else {
        const error = new Error('Error HTTP: ' + response.status);
        return Promise.reject(error);
    }
};

export const deleteCar = async <T>(id: number): Promise<T> => {
    const response = await fetch(`http://127.0.0.1:3000/garage/${id}`, {
        method: 'DELETE',
    });
    if (response.ok) {
        return await response.json();
    } else {
        const error = new Error('Error HTTP: ' + response.status);
        return Promise.reject(error);
    }
};
