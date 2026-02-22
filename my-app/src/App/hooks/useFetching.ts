import { useState } from 'react';

type AsyncCallback<T extends any[]> = (...args: T) => Promise<void>;

export const useFetching = <T extends any[]>(
    callback: AsyncCallback<T>
): [(...args: T) => Promise<void>, boolean, string] => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetching = async (...args: T) => {
        try {
            setIsLoading(true);
            setError('');
            await callback(...args);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else if (typeof e === 'string') {
                setError(e);
            } else {
                setError('Произошла неизвестная ошибка');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return [fetching, isLoading, error];
};