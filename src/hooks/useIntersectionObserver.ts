import {
    type RefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

const DefaultOptions: IntersectionObserverInit = {};

const useIntersectionObserver = (
    elemRef: RefObject<Element | Element[] | null>,
    options: IntersectionObserverInit = DefaultOptions,
) => {
    const observerRef = useRef<IntersectionObserver>(null);
    const [entries, setEntries] = useState<Map<Element, IntersectionObserverEntry>>(new Map());

    const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
        setEntries(prev => {
            const next = new Map(prev);

            for (const entry of entries) {
                const el = entry.target;

                if (!entry.isIntersecting) next.delete(el);
                else next.set(el, entry);
            }

            return next;
        });
    }, []);

    useEffect(() => {
        const node = elemRef.current;

        if (!node) return;

        const observer = new IntersectionObserver(handleIntersect, options);
        observerRef.current = observer;

        for (const n of (Array.isArray(node) ? node : [node])) {
            if (n) observer.observe(n);
        }

        return () => {
            observer?.disconnect();
        };
    }, [elemRef, handleIntersect, options]);

    return { entries, observerRef };
};

export default useIntersectionObserver;
