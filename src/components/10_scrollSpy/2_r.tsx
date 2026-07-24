import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import cx from './cx';
import data from './data';

const HeaderHeight = 60;

const NavItem = ({ index, current, navsRef, handleClick }: {
    index: number;
    current: boolean;
    navsRef: RefObject<HTMLLIElement[]>;
    handleClick: () => void;
}) => (
    <li
        className={cx('navItem', { current })}
        ref={el => {
            if (el) navsRef.current[index] = el;
        }}
    >
        <button type="button" onClick={handleClick}>{index + 1}</button>
    </li>
);

const Content = ({ id, index, title, description }: {
    id: string;
    index: number;
    title: string;
    description: string;
}) => (
    <li className={cx('content')} id={id}>
        <span data-index={index} data-io-target className={cx('io-target', '_io-target')} />
        <p><strong>{index + 1}. {title}</strong></p>
        <div>{description.split('\r\n').map((line, i) => <p key={line + i}>{line}</p>)}</div>
    </li>
);

const IOOptions: IntersectionObserverInit = {
    rootMargin: `-${HeaderHeight}px 0% 0% 0%`,
    threshold: 0,
};

const ScrollSpy2 = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navsRef = useRef<HTMLLIElement[]>([]);
    const itemsRef = useRef<Element[]>([]);
    const ioTargetsRef = useRef<Element[]>([]);
    const { entries } = useIntersectionObserver(ioTargetsRef, IOOptions);

    const setCurrentItem = useCallback((index: number) => {
        setCurrentIndex(index);
        navsRef.current[index]?.scrollIntoView({
            block: 'nearest',
            inline: 'center',
            behavior: 'smooth',
        });
    }, []);

    const handleNavClick = useCallback((index: number) => () => {
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
        <div className={cx('ScrollSpy', 'ScrollSpy2')}>
            <header className={cx('floatingHeader')}>
                <h3 className={cx('title')}>스크롤 스파이 #2. React<sub>IntersectionObserver</sub></h3>
                <ul className={cx('nav')}>
                    {data.map(({ index, id }) => (
                        <NavItem
                            key={id}
                            index={index}
                            current={currentIndex === index}
                            navsRef={navsRef}
                            handleClick={handleNavClick(index)}
                        />
                    ))}
                </ul>
            </header>
            <ul className={cx('contents')}>
                {data.map(item => (
                    <Content {...item} key={item.id} />
                ))}
            </ul>
        </div>
    );
};

export default ScrollSpy2;
