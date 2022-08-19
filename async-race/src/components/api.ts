import {
    driveCarResponse,
    engineStatus,
    getCarResponse,
    getCarsResponse,
    getWinnerResponse,
    getWinnersResponse,
    OrderType,
    SortType,
    startCarEngineResponse,
} from './types';

export const getCars = async (page?: number, limit?: number): Promise<getCarsResponse> => {
    const response = await fetch(`http://127.0.0.1:3000/garage?_page=${page}&_limit=${limit}`);
    if (response.ok) {
        return {
            cars: await response.json(),
            count: response.headers.get('X-Total-Count'),
        };
    } else {
        const error = new Error('Error HTTP: ' + response.status);
        return Promise.reject(error);
    }
};

export const getCar = async (id: number): Promise<getCarResponse> => {
    const response = await fetch(`http://127.0.0.1:3000/garage/${id}`, {
        method: 'GET',
    });
    return await response.json();
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

export const updateCar = async <T>(id: number, name: string, color: string): Promise<T> => {
    const response = await fetch(`http://127.0.0.1:3000/garage/${id}`, {
        method: 'PUT',
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

export const startStopCarEngine = async (id: number, status: engineStatus): Promise<startCarEngineResponse> => {
    const response = await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=${status}`, {
        method: 'PATCH',
    });
    if (response.ok) {
        return await response.json();
    } else {
        const error = new Error('Error HTTP: ' + response.status);
        return Promise.reject(error);
    }
};

export const switchDriveMode = async (id: number, status = 'drive'): Promise<driveCarResponse> => {
    const response = await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=${status}`, {
        method: 'PATCH',
    });
    if (response.status !== 200) {
        return { success: false };
    } else {
        return { ...(await response.json()) };
    }
};

export const createWinner = async (id: number, wins: number, time: number): Promise<void> => {
    const response = await fetch(`http://127.0.0.1:3000/winners`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            id: id,
            wins: wins,
            time: time,
        }),
    });
    if (response.ok) {
        return await response.json();
    } else {
        const error = new Error('Error HTTP: ' + response.status);
        return Promise.reject(error);
    }
};

export const updateWinner = async (id: number, wins: number, time: number): Promise<void> => {
    const response = await fetch(`http://127.0.0.1:3000/winners/${id}`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            wins: wins,
            time: time,
        }),
    });
    if (response.ok) {
        return await response.json();
    } else {
        const error = new Error('Error HTTP: ' + response.status);
        return Promise.reject(error);
    }
};

export const getWinner = async (id: number): Promise<getWinnerResponse> => {
    const response = await fetch(`http://127.0.0.1:3000/winners/${id}`, {
        method: 'GET',
    });
    if (response.status !== 200) {
        return await response.json();
    } else {
        return { ...(await response.json()) };
    }
};

export const getWinners = async (
    page = 1,
    limit?: number,
    sort?: SortType,
    order?: OrderType
): Promise<getWinnersResponse> => {
    const response = await fetch(
        `http://127.0.0.1:3000/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`,
        {
            method: 'GET',
        }
    );
    if (response.ok) {
        return {
            winners: await response.json(),
            count: response.headers.get('X-Total-Count'),
        };
    } else {
        const error = new Error('Error HTTP: ' + response.status);
        return Promise.reject(error);
    }
};

export const deleteWinner = async (id: number): Promise<void> => {
    const response = await fetch(`http://127.0.0.1:3000/winners/${id}`, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
        },
    });
    if (response.ok) {
        return await response.json();
    } else {
        const error = new Error('Error HTTP: ' + response.status);
        return Promise.reject(error);
    }
};
