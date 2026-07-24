import { useCallback, useEffect, useRef, useState } from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import ScrollBox, { type ScrollBoxHandle } from '@/components/09_carousel/scrollBox';
import cx from './cx';
import data from './data';

const HeaderHeight = 60;

const NavItem = ({ index, handleClick }: {
    id: string;
    index: number;
    handleClick?: () => void;
}) => (
    <button type="button" onClick={handleClick}>{index + 1}</button>
);

const Content = ({ id, index, title, description }: {
    id: string;
    index: number;
    title: string;
    description: string;
}) => (
    <li className={cx('content')} id={id}>
        <span data-index={index} data-io-target className={cx('io-target')} />
        <p><strong>{index + 1}. {title}</strong></p>
        <div>{description.split('\r\n').map((line, i) => <p key={line + i}>{line}</p>)}</div>
    </li>
);

const IOOptions: IntersectionObserverInit = {
    rootMargin: `-${HeaderHeight}px 0% 0% 0%`,
    threshold: 0,
};

const ScrollSpy3 = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollBoxRef = useRef<ScrollBoxHandle>(undefined);
    const itemsRef = useRef<Element[]>([]);
    const ioTargetsRef = useRef<Element[]>([]);
    const { entries } = useIntersectionObserver(ioTargetsRef, IOOptions);

    const setCurrentItem = useCallback((index: number) => {
        setCurrentIndex(index);
        scrollBoxRef.current?.scrollFocus(index, 'smooth');
    }, []);

    const handleNavClick = useCallback((_item: unknown, index: number) => () => {
        const scrollTop = document.scrollingElement!.scrollTop;
        const itemY = itemsRef.current[index]?.getBoundingClientRect().top || 0;
        const top = scrollTop + itemY - HeaderHeight;
        window.scrollTo({ top, behavior: 'instant' });
    }, []);

    useEffect(() => {
        data.forEach((d, i) => {
            itemsRef.current[i] = document.getElementById(d.id)!;
            ioTargetsRef.current[i] = itemsRef.current[i].querySelector('[data-io-target]')!;
        });
    }, []);

    useEffect(() => {
        if (!entries.size) return;

        const entryIndexes = Array.from(
            entries.values(),
            e => Number.parseInt((e.target as HTMLElement).dataset.index || '0')
        );

        const minIndex = Math.min(...entryIndexes);
        setCurrentItem(minIndex);
    }, [entries, setCurrentItem]);

    return (
        <div className={cx('ScrollSpy', 'ScrollSpy3')}>
            <header className={cx('floatingHeader')}>
                <h3 className={cx('title')}>스크롤 스파이 #3. React <sub>IO + ScrollBox</sub></h3>
                <ScrollBox
                    list={data}
                    Item={NavItem}
                    handleItemClick={handleNavClick}
                    currentIndex={currentIndex}
                    ref={scrollBoxRef}
                    classNames={{
                        container: cx('container'),
                        list: cx('nav'),
                        item: cx('navItem'),
                        current: cx('current'),
                        navButton: cx('navButton'),
                        navPrev: cx('navPrev'),
                        navNext: cx('navNext'),
                    }}
                />
            </header>
            <ul className={cx('contents')}>
                {data.map(item => <Content {...item} index={item.index} key={item.id} />)}
            </ul>
        </div>
    );
};

export default ScrollSpy3;
