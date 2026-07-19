import { useCallback, useState, useTransition } from 'react';
import { generateRandomNumber, shiftData, waitFor } from '@/service/util';
import data from '../data';

export type Item = { id: string; title: string; description: string };
export type FetchState = { data: Item[][]; hasNextPage: boolean };
export const PAGE_SIZE = 15;

const TOTAL_PAGES = generateRandomNumber(5, 10, 1);
const initialState = { data: [], hasNextPage: true };
const generatePageData = async (page: number) => {
    await waitFor(generateRandomNumber(300, 1000, 50));
    const pageSize = page === TOTAL_PAGES - 1
        ? generateRandomNumber(1, PAGE_SIZE, 1)
        : PAGE_SIZE + 1;
    return shiftData(data, page, pageSize);
};

const useInfiniteFetcher = () => {
    const [{ data, hasNextPage }, setState] = useState<FetchState>(initialState);
    const [isLoading, startTransition] = useTransition();
    const fetchNextPage = useCallback(() => {
        startTransition(async () => {
            const pageData = await generatePageData(data.length);
            setState(prev => {
                const nextPageData = pageData.slice(0, PAGE_SIZE);
                const nextData = [...prev.data, nextPageData];
                return { data: nextData, hasNextPage: pageData.length === PAGE_SIZE + 1 };
            });
        });
    }, [data]);

    return { data, isLoading, fetchNextPage, hasNextPage };
};

export default useInfiniteFetcher;
