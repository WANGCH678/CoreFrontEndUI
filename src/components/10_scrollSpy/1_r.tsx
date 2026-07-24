import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useScrollInfo, useViewportSize, type ViewportSize } from '@/context/viewportContext';
import data from './data';
import cx from './cx';

type ItemInfo = { top: number; height: number; elem: HTMLElement } | null;

const HeaderHeight = 60;

const NavItem = ({ index, current, navsRef, onClick }: {
    index: number;
    current: boolean;
    navsRef: RefObject<HTMLLIElement[]>;
    onClick: () => void;
}) => (
    <li
        className={cx('navItem', { current })}
        ref={el => {
            if (el) navsRef.current[index] = el;
        }}
    >
        <button type="button" onClick={onClick}>{index + 1}</button>
    </li>
);

const Content = ({ id, index, title, description }: {
    id: string;
    index: number;
    title: string;
    description: string;
}) => (
    <li id={id} className={cx('content')} data-number={index + 1}>
        <p><strong>{index + 1}. {title}</strong></p>
        <div>{description.split('\r\n').map((line, i) => <p key={line + i}>{line}</p>)}</div>
    </li>
);

const ScrollSpy1 = () => {
    const { top: scrollTop } = useScrollInfo();
    const viewportSize = useViewportSize();
    const navsRef = useRef<HTMLLIElement[]>([]);
    const itemsRef = useRef<ItemInfo[]>([]);
    const prevViewportSize = useRef<ViewportSize | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (viewportSize !== prevViewportSize.current) {
            prevViewportSize.current = viewportSize;
            itemsRef.current = data.map(d => {
                const elem = document.getElementById(d.id);
                if (!elem) return null;
                const { top, height } = elem.getBoundingClientRect();
                return { elem, top: top + scrollTop, height };
            });
        }

        if (scrollTop <= -1) return;

        let targetIndex = itemsRef.current.findIndex(item => {
            if (!item) return false;
            const { top, height } = item;
            const targetPosition = scrollTop + HeaderHeight + Math.min(height, viewportSize.height) / 2;
            return targetPosition >= top && targetPosition <= top + height;
        });

        if (targetIndex === -1) {
            targetIndex = itemsRef.current.findIndex(item => {
                if (!item) return false;
                const { top, height } = item;
                return scrollTop >= top && scrollTop <= top + height;
            });
        }

        console.log(targetIndex);

        if (targetIndex > -1) {
            setCurrentIndex(targetIndex);
            navsRef.current[targetIndex]?.scrollIntoView({
                block: 'nearest',
                inline: 'center',
                behavior: 'smooth',
            });
        }
    }, [scrollTop, viewportSize]);

    const handleNavClick = useCallback((index: number) => () => {
        const itemY = (itemsRef.current[index]?.top || 0) - HeaderHeight;
        window.scrollTo({ top: itemY, behavior: 'instant' });
    }, []);

    return (
        <div className={cx('ScrollSpy')}>
            <header className={cx('floatingHeader')}>
                <h3 className={cx('title')}>
                    스크롤 스파이 #1. React<sub>scroll event</sub>
                </h3>
                <ul className={cx('nav')}>
                    {data.map(({ index, id }) => (
                        <NavItem
                            key={id}
                            index={index}
                            current={currentIndex === index}
                            navsRef={navsRef}
                            onClick={handleNavClick(index)}
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

export default ScrollSpy1;
