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

type engineStatus = 'started' | 'stopped';
type startCarEngineResponce = {
    velocity: number;
    distance: number;
};
export const startStopCarEngine = async (id: number, status: engineStatus): Promise<startCarEngineResponce> => {
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

type driveCarResponce = {
    success: boolean;
};
export const switchDriveMode = async (id: number, status = 'drive'): Promise<driveCarResponce> => {
    const response = await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=${status}`, {
        method: 'PATCH',
    });
    if (response.status !== 200) {
        return { success: false };
    } else {
        return { ...(await response.json()) };
    }
    // const response = await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=${status}`, {
    //     method: 'PATCH',
    // }).catch();
    // return response.status !== 200 ? { success: false } : { ...(await response.json()) }; //??????
};
