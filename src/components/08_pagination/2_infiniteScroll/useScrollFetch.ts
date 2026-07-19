import { useEffect, useRef } from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import useInfiniteFetcher from './useInfiniteFetcher';

const useScrollFetch = () => {
    const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteFetcher();
    const moreRef = useRef<HTMLDivElement>(null);
    const { entries, observerRef } = useIntersectionObserver(moreRef);
    const prevEntries = useRef<Map<Element, IntersectionObserverEntry> | null>(null);

    useEffect(() => {
        if (
            hasNextPage && !isLoading && entries.has(moreRef.current!) &&
            entries !== prevEntries.current
        ) {
            prevEntries.current = entries;
            fetchNextPage();
        }
    }, [hasNextPage, entries, isLoading, fetchNextPage]);

    useEffect(() => {
        if (!hasNextPage) observerRef.current?.disconnect();
    }, [hasNextPage, observerRef]);

    return { data, isLoading, moreRef };
};

export default useScrollFetch;
