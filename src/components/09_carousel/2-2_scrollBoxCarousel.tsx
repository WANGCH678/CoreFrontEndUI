import { useCallback, useEffect, useRef, useState } from 'react';
import { LazyImage } from '@/components/07_lazyLoading/4_r';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import cx from './cx';
import data from './data';

type ScrollBoxItem = {
    id: string;
    description: string;
    imgUrl: string;
    handleClickItem: () => void;
};

export const ScrollBoxItem = ({ description, imgUrl, handleClickItem }: ScrollBoxItem) => (
    <div onClick={handleClickItem}>
        <LazyImage src={imgUrl} width={300} height={300} />
        <span>{description}</span>
    </div>
);

const getCenteredItemIndex = (list: HTMLElement, items: Element[]) => {
    const { left, width } = list.getBoundingClientRect();
    const center = left + width / 2;

    return items.reduce(
        (closest, item, index) => {
            const rect = item.getBoundingClientRect();
            const itemCenter = rect.left + rect.width / 2;
            const distance = Math.abs(center - itemCenter);

            return distance < closest.distance ? { index, distance } : closest;
        },
        { index: 0, distance: Infinity },
    ).index;
};

const DefaultIoOptions = {};

const ScrollBoxCarousel = () => {
    const listRef = useRef<HTMLUListElement>(null);
    const itemsRef = useRef<Element[]>([]);
    const isTransitionRef = useRef(false);
    const isScrollingRef = useRef(false);
    const [ioOptions, setIoOptions] = useState<IntersectionObserverInit>(DefaultIoOptions);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { entries: itemsEntries } = useIntersectionObserver(itemsRef, ioOptions);

    const updateCurrentIndex = useCallback(() => {
        if (!listRef.current || !itemsRef.current.length) return;
        setCurrentIndex(getCenteredItemIndex(listRef.current, itemsRef.current));
    }, []);

    const handleItemClick = useCallback((index: number) => () => {
        if (!listRef.current || !itemsRef.current.length) return;
        if (isTransitionRef.current || isScrollingRef.current) return;
        const elem = itemsRef.current[index];
        isScrollingRef.current = true;
        setCurrentIndex(index);
        elem?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (!listRef.current) return;
        setIoOptions({ root: listRef.current, threshold: 0.5 });
    }, []);

    useEffect(() => {
        if (!itemsEntries.size) return;
        updateCurrentIndex();
    }, [itemsEntries, updateCurrentIndex]);

    useEffect(() => {
        const list = listRef.current;
        if (!list) return;
        let frame = 0;
        let scrollEndTimer = 0;
        const handleScroll = () => {
            isScrollingRef.current = true;
            cancelAnimationFrame(frame);
            window.clearTimeout(scrollEndTimer);
            frame = requestAnimationFrame(updateCurrentIndex);
            scrollEndTimer = window.setTimeout(() => {
                isScrollingRef.current = false;
            }, 120);
        };
        const handleScrollEnd = () => {
            isScrollingRef.current = false;
            updateCurrentIndex();
        };
        const handleTransitionStart = () => {
            isTransitionRef.current = true;
        };
        const handleTransitionEnd = () => {
            isTransitionRef.current = false;
        };

        list.addEventListener('scroll', handleScroll, { passive: true });
        list.addEventListener('scrollend', handleScrollEnd);
        list.addEventListener('transitionstart', handleTransitionStart);
        list.addEventListener('transitionend', handleTransitionEnd);
        updateCurrentIndex();

        return () => {
            cancelAnimationFrame(frame);
            window.clearTimeout(scrollEndTimer);
            list.removeEventListener('scroll', handleScroll);
            list.removeEventListener('scrollend', handleScrollEnd);
            list.removeEventListener('transitionstart', handleTransitionStart);
            list.removeEventListener('transitionend', handleTransitionEnd);
        };
    }, [updateCurrentIndex]);

    return (
        <>
            <h3>#2-2. React<sub>스크롤 박스 캐러셀</sub></h3>
            <div className={cx('scrollBox', 'scrollBox-carousel')}>
                <ul className={cx('list')} ref={listRef}>
                    {data.map((item, i) => (
                        <li
                            key={item.id}
                            data-index={i}
                            className={cx('item', { current: currentIndex === i })}
                            ref={r => { if (r) itemsRef.current[i] = r }}
                        >
                            <ScrollBoxItem {...item} handleClickItem={handleItemClick(i)} />
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default ScrollBoxCarousel;
