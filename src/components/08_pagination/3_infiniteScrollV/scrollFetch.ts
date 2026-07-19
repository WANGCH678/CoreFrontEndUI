import vanillaIntersectionObserver, {
    type EntryMap
} from '@/hooks/vanilla/intersectionObserver';
import cx from '../cx';
import infiniteFetcher, { type Item, type RenderProps } from './infiniteFetcher';

export type AddList = (data: Item[], page: number) => void;

const scrollFetch = (wrapper: HTMLDivElement, addList: AddList) => {
    const $more = document.createElement('div');
    const $spinner = document.createElement('div');
    $spinner.classList.add(cx('spinner'));
    let currentPage = -1;

    const renderer = ({ isLoading, page, data = [], hasNextPage = true }: RenderProps) => {
        $spinner.style.display = isLoading ? 'block' : 'none';
        if (!hasNextPage) observer.disconnect();
        if (!isLoading) {
            currentPage = typeof page === 'number' ? page : currentPage;
            addList(data, currentPage);
        }
    };

    const handleIntersect = (entries: EntryMap) => {
        if (entries.has($more)) infiniteFetcher(renderer, currentPage + 1);
    };

    const observer = vanillaIntersectionObserver(handleIntersect, $more);
    wrapper.append($more, $spinner);
};

export default scrollFetch;
