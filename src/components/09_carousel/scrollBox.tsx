import {
    type ReactNode,
    type RefObject,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import classNames from 'classnames/bind';
import styles from './scrollBox.module.scss';

type Direction = 'prev' | 'next';
export type IoOptions = Partial<Record<'items' | 'navs', IntersectionObserverInit>>;
type NavState = Record<Direction, boolean>;

export type ScrollBoxHandle = {
    scrollFocus: (index: number, behavior?: 'instant' | 'smooth') => void;
} | null | undefined;

type ScrollBoxProps<T> = {
    list: T[];
    Item: (props: T & { handleClick?: () => void }) => ReactNode;
    currentIndex?: number;
    ioOptionProps?: IoOptions;
    classNames?: Partial<Record<
        'container' | 'list' | 'item' | 'current' | 'observer' |
        'navButton' | 'navPrev' | 'navNext' | 'navVisible',
        string
    >>;
    handleItemClick?: (item: T, index: number) => () => void;
    ref?: RefObject<ScrollBoxHandle>;
};

const cx = classNames.bind(styles);

const getVisibleEdgeItem = (
    list: Element[],
    entries: Map<Element, IntersectionObserverEntry>,
    direction: Direction,
) => {
    const items = Array.from(entries.keys());
    const method = direction === 'prev' ? 'find' : 'findLast';
    return list[method](item => items.includes(item));
};

const DefaultIoOptions: IoOptions = { items: { threshold: 0 }, navs: { threshold: 1 } };
const DefaultNavState: NavState = { prev: true, next: true };

const ScrollBox = <T extends { id: string }>({
    list,
    Item,
    currentIndex = 0,
    classNames = {},
    ioOptionProps = DefaultIoOptions,
    handleItemClick,
    ref,
}: ScrollBoxProps<T>) => {
    const listRef = useRef<HTMLUListElement>(null);
    const itemsRef = useRef<Element[]>([]);
    const [ioOptions, setIoOptions] = useState<IoOptions>(ioOptionProps);
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

    const scrollFocus = useCallback((
        index: number,
        behavior: 'instant' | 'smooth' = 'instant',
    ) => {
        itemsRef.current[index]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior });
    }, []);

    useImperativeHandle(ref, () => ({ scrollFocus }), [scrollFocus]);

    useEffect(() => {
        if (!listRef.current) return;
        setIoOptions({
            items: { ...ioOptionProps.items, root: listRef.current },
            navs: { ...ioOptionProps.navs, root: listRef.current },
        });
    }, [ioOptionProps]);

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
        <div className={cx('ScrollBox', classNames.container)}>
            <ul className={cx('list', classNames.list)} ref={listRef}>
                <li
                    className={cx('observer', classNames.observer)}
                    ref={r => { if (r) navsRef.current[0] = r }}
                    data-direction="prev"
                />
                {list.map((item, i) => (
                    <li
                        key={item.id}
                        className={cx('item', classNames.item, {
                            [classNames.current || 'current']: currentIndex === i,
                        })}
                        ref={r => { if (r) itemsRef.current[i] = r }}
                    >
                        <Item {...item} handleClick={handleItemClick?.(item, i)} />
                    </li>
                ))}
                <li
                    className={cx('observer', classNames.observer)}
                    ref={r => { if (r) navsRef.current[1] = r }}
                    data-direction="next"
                />
            </ul>
            <button
                type="button"
                className={cx('nav-button', 'nav-prev', classNames.navButton, classNames.navPrev, {
                    on: navState.prev,
                    [classNames.navVisible || 'on']: navState.prev,
                })}
                onClick={() => move('prev')}
            />
            <button
                type="button"
                className={cx('nav-button', 'nav-next', classNames.navButton, classNames.navNext, {
                    on: navState.next,
                    [classNames.navVisible || 'on']: navState.next,
                })}
                onClick={() => move('next')}
            />
        </div>
    );
};

export default ScrollBox;
