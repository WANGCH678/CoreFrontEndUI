import { useCallback, useRef, useState } from 'react';
import { LazyImage } from '@/components/07_lazyLoading/4_r';
import cx from './cx';
import data from './data';

type Direction = 'left' | 'right';
type CarouselItem = { index: number; imgUrl: string; degree: number; radius: number };

const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 200;
const carouselData = data.slice(0, 3);

const rotate = ({
    el,
    from,
    to,
    duration,
}: {
    el: HTMLElement | null;
    from: number;
    to: number;
    duration: number;
}) => {
    let start = 0;
    let frameId: number;
    let current = from;

    const tick = (timestamp: number) => {
        if (!el) return;
        if (start === 0) start = timestamp || Date.now();
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        current = from + (to - from) * progress;
        el.style.transform = `rotateY(${current}deg)`;
        if (current === to) return window.cancelAnimationFrame(frameId);
        frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
};

const CarouselItem = ({ imgUrl, index, degree, radius }: CarouselItem) => (
    <li
        className={cx('item')}
        style={{
            transformOrigin: `50% 50% ${-1 * radius}px`,
            transform: `rotateY(${degree * index}deg)`,
        }}
    >
        <LazyImage src={imgUrl} width={IMAGE_WIDTH} height={IMAGE_HEIGHT} />
        <span>#{index + 1}</span>
    </li>
);

const Carousel3D = () => {
    const containerRef = useRef<HTMLUListElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const imageCount = carouselData.length;
    const degree = 360 / carouselData.length;
    const theta = (degree / 2) * (Math.PI / 180);
    const radius = Math.round(IMAGE_WIDTH / (2 * Math.tan(theta)));

    const move = useCallback((direction: Direction) => {
        const nextIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1;
        rotate({
            el: containerRef.current,
            from: -1 * currentIndex * degree,
            to: -1 * nextIndex * degree,
            duration: 300,
        });
        setCurrentIndex((nextIndex + imageCount) % imageCount);
    }, [currentIndex, degree, imageCount]);

    return (
        <>
            <h3>#4. React<sub>3D</sub></h3>
            <div className={cx('carousel', 'carousel3d')}>
                <ul
                    className={cx('container')}
                    ref={containerRef}
                    style={{
                        transformOrigin: `50% 50% ${-1 * radius}px`,
                        transform: 'rotateY(0deg)',
                    }}
                >
                    {carouselData.map(({ id, imgUrl }, index) => (
                        <CarouselItem
                            key={id}
                            index={index}
                            imgUrl={imgUrl}
                            degree={degree}
                            radius={radius}
                        />
                    ))}
                </ul>
                <button type="button" className={cx('navButton', 'navLeft')} onClick={() => move('left')} />
                <button type="button" className={cx('navButton', 'navRight')} onClick={() => move('right')} />
            </div>
        </>
    );
};

export default Carousel3D;
