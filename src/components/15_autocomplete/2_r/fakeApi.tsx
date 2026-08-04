import { generateRandomNumber, waitFor } from '@/service/util';
import { useEffect, useState } from 'react';

export type Album = { id: string; title: string; year: number };

const allAlbums: Album[] = [
    { id: '13', title: 'Let It Be', year: 1970 },
    { id: '12', title: 'Abbey Road', year: 1969 },
    { id: '11', title: 'Yellow Submarine', year: 1969 },
    { id: '10', title: 'The Beatles', year: 1968 },
    { id: '9', title: 'Magical Mystery Tour', year: 1967 },
    { id: '8', title: "Sgt. Pepper's Lonely Hearts Club Band", year: 1967 },
    { id: '7', title: 'Revolver', year: 1966 },
    { id: '6', title: 'Rubber Soul', year: 1965 },
    { id: '5', title: 'Help!', year: 1965 },
    { id: '4', title: 'Beatles For Sale', year: 1964 },
    { id: '3', title: "A Hard Day's Night", year: 1964 },
    { id: '2', title: 'With The Beatles', year: 1963 },
    { id: '1', title: 'Please Please Me', year: 1963 },
];

const cache: Map<string, Album[]> = new Map();

async function getSearchResults(query: string) {
    await waitFor(generateRandomNumber(500, 1500, 100));
    const lowerQuery = query.trim().toLowerCase();

    return allAlbums.filter(album => {
        const lowerTitle = album.title.toLowerCase();
        return lowerTitle.startsWith(lowerQuery) ||
            lowerTitle.indexOf(`${lowerQuery} `) !== -1;
    });
}

async function getData(url: string) {
    const query = url.slice('/search?q='.length);
    if (query) return await getSearchResults(query);
    throw Error('Not implemented');
}

export async function fetchData(url: string) {
    if (!cache.has(url)) {
        const data = await getData(url);
        cache.set(url, data);
    }

    return cache.get(url);
}

export const useFetch = <T,>(query: string, enabled: boolean) => {
    const [state, setState] = useState<'idle' | 'loading' | 'fetched'>('idle');
    const [data, setData] = useState<T | null>(null);

    useEffect(() => {
        const fetch = async (request: string) => {
            setState('loading');
            const result = (await fetchData(request)) as T;
            setData(result);
            setState('fetched');
        };

        if (enabled) fetch(query);
        else {
            setData(null);
            setState('idle');
        }
    }, [query, enabled]);

    return { data, state };
};
