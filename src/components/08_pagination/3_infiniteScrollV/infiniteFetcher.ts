import { generateRandomNumber, shiftData, waitFor } from '@/service/util';
import data from '../data';

export type Item = { id: string; title: string; description: string };
export const PAGE_SIZE = 15;
const TOTAL_PAGES = generateRandomNumber(5, 10, 1);
const generatePageData = async (page: number) => {
    await waitFor(generateRandomNumber(300, 1000, 50));
    const pageSize = page === TOTAL_PAGES - 1
        ? generateRandomNumber(1, PAGE_SIZE, 1)
        : PAGE_SIZE + 1;
    return shiftData(data, page, pageSize);
};

export type RenderProps = {
    isLoading: boolean;
    page?: number;
    data?: Item[];
    hasNextPage?: boolean;
};

const infiniteFetcher = async (renderer: (arg: RenderProps) => void, page: number) => {
    renderer({ isLoading: true });
    const nextPageData = await generatePageData(page);
    renderer({
        isLoading: false,
        page,
        data: nextPageData.slice(0, PAGE_SIZE),
        hasNextPage: nextPageData.length === PAGE_SIZE + 1,
    });
};

export default infiniteFetcher;
