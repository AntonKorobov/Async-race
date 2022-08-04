export interface carDataInterface {
    name: string;
    color: string;
    id: number;
}

export const getCars = async <T>(page: number, limit = 7): Promise<T> => {
    const response = await fetch(`http://127.0.0.1:3000/garage?_page=${page}&_limit=${limit}`);
    if (response.ok) {
        return await response.json();
    } else {
        const error = new Error('Error HTTP: ' + response.status);
        return Promise.reject(error);
    }
};

