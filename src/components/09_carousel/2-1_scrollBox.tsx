import { useCallback, useEffect, useRef, useState } from 'react';
import { LazyImage } from '@/components/07_lazyLoading/4_r';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import cx from './cx';
import data from './data';

type ScrollBoxItem = { id: string; description: string; imgUrl: string };
type Direction = 'prev' | 'next';
type IoOptions = Partial<Record<'items' | 'navs', IntersectionObserverInit>>;
type NavState = Record<'prev' | 'next', boolean>;

const DefaultIoOptions: IoOptions = { items: {}, navs: {} };
const DefaultNavState: NavState = { prev: true, next: true };

const getVisibleEdgeItem = (
    list: Element[],
    entries: Map<Element, IntersectionObserverEntry>,
    direction: Direction,
) => {
    const items = Array.from(entries.keys());
    const method = direction === 'prev' ? 'find' : 'findLast';
    return list[method](item => items.includes(item));
};

export const ScrollBoxItem = ({ description, imgUrl }: ScrollBoxItem) => (
    <div>
        <LazyImage src={imgUrl} width={300} height={300} />
        <span>{description}</span>
    </div>
);

const ScrollBoxComponent = () => {
    const listRef = useRef<HTMLUListElement>(null);
    const itemsRef = useRef<Element[]>([]);
    const [ioOptions, setIoOptions] = useState<IoOptions>(DefaultIoOptions);
    const { entries: itemsEntries } = useIntersectionObserver(itemsRef, ioOptions.items);
    const navsRef = useRef<Element[]>([]);
    const [navState, setNavState] = useState<NavState>(DefaultNavState);
    const { entries: navEntries } = useIntersectionObserver(navsRef, ioOptions.navs);

    const move = useCallback((direction: Direction) => {
        if (!listRef.current || !itemsRef.current.length) return;
        const elem = getVisibleEdgeItem(itemsRef.current, itemsEntries, direction);
        elem?.scrollIntoView({
            inline: direction === 'prev' ? 'end' : 'start',
            block: 'nearest',
            behavior: 'smooth',
        });
    }, [itemsEntries]);

    useEffect(() => {
        if (!listRef.current) return;
        setIoOptions({
            items: { root: listRef.current, threshold: 0, rootMargin: '0px 10px' },
            navs: { root: listRef.current, threshold: 1 },
        });
    }, []);

    useEffect(() => {
        if (!navEntries.size) return setNavState(DefaultNavState);
        setNavState(() => {
            const newState = { ...DefaultNavState };
            for (const [elem] of navEntries) {
                const direction = (elem as HTMLElement).dataset.direction as Direction;
                newState[direction] = false;
            }

            return newState;
        });
    }, [navEntries]);

    return (
        <>
            <h3>#2-1. React<sub>스크롤 박스</sub></h3>
            <div className={cx('scrollBox')}>
                <ul className={cx('list')} ref={listRef}>
                    <li
                        className={cx('observer')}
                        data-direction="prev"
                        ref={r => { if (r) navsRef.current[0] = r }}
                    />
                    {data.map((item, i) => (
                        <li
                            key={item.id}
                            className={cx('item')}
                            ref={r => { if (r) itemsRef.current[i] = r }}
                        >
                            <ScrollBoxItem {...item} />
                        </li>
                    ))}
                    <li
                        className={cx('observer')}
                        data-direction="next"
                        ref={r => { if (r) navsRef.current[1] = r }}
                    />
                </ul>
                <button
                    type="button"
                    className={cx('nav-button', 'nav-prev', { on: navState.prev })}
                    onClick={() => move('prev')}
                />
                <button
                    type="button"
                    className={cx('nav-button', 'nav-next', { on: navState.next })}
                    onClick={() => move('next')}
                />
            </div>
        </>
    );
};

export default ScrollBoxComponent;
