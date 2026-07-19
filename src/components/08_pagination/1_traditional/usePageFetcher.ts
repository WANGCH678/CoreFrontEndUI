import { useCallback, useState, useTransition } from 'react';
import { generateRandomNumber, shiftData, waitFor } from '@/service/util';
import data from '../data';

export type Item = { id: string; title: string; description: string };
export type FetchState = { currentPage: number; data: Item[][]; totalPages: number };
export const PAGE_SIZE = 15;

const TOTAL_PAGES = generateRandomNumber(5, 10, 1);
const initialState = {
    currentPage: 0,
    data: [shiftData(data, 0, PAGE_SIZE)],
    totalPages: TOTAL_PAGES,
};
const generatePageData = async (page: number) => {
    await waitFor(generateRandomNumber(300, 1000, 50));
    const pageSize = page === TOTAL_PAGES - 1
        ? generateRandomNumber(1, PAGE_SIZE, 1)
        : PAGE_SIZE;
    const nextData = shiftData(data, page, pageSize);

    return { pageData: nextData, totalPages: TOTAL_PAGES };
};

const usePageFetcher = () => {
    const [{ data, currentPage, totalPages }, setState] = useState<FetchState>(initialState);
    const [isLoading, startTransition] = useTransition();
    const fetchPage = useCallback((page: number) => {
        const nextPage = Math.min(Math.max(page, 0), totalPages - 1);

        if (data[nextPage]) return setState(prev => ({ ...prev, currentPage: nextPage }));

        startTransition(async () => {
            const { pageData, totalPages: nextTotalPages } = await generatePageData(nextPage);
            setState(prev => {
                const nextData = [...prev.data];
                nextData[nextPage] = pageData;
                return { currentPage: nextPage, data: nextData, totalPages: nextTotalPages };
            });
        });
    }, [data, totalPages]);

    return { currentPage, data, isLoading, totalPages, fetchPage };
};

export default usePageFetcher;
