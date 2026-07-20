import { useCallback, useState } from 'react';
import { LazyImage } from '@/components/07_lazyLoading/4_r';
import cx from './cx';
import data from './data';

type Direction = 'left' | 'right';
type CarouselState = { currentIndex: number; nextIndex: number; direction: Direction | null };
type CarouselItem = CarouselState & { imgUrl: string; index: number };

const carouselData = data.slice(0, 5);

const getItemClassNames = ({ index, currentIndex, nextIndex, direction }: CarouselItem) => {
    if (index === currentIndex) return direction ? `${direction}_current` : 'current';
    if (index === nextIndex && direction) return `${direction}_next`;
    return undefined;
};

const CarouselItem = (props: CarouselItem) => (
    <li className={cx('item', getItemClassNames(props))}>
        <LazyImage src={props.imgUrl} width={400} height={400} />
        <span>#{props.index + 1}</span>
    </li>
);

const InfiniteCarousel = () => {
    const [state, setState] = useState<CarouselState>({
        currentIndex: 0,
        nextIndex: 0,
        direction: null,
    });

    const move = useCallback((dir: Direction) => {
        setState(prevState => {
            const curr = prevState.currentIndex;
            const next = ((dir === 'right' ? curr + 1 : curr - 1) + carouselData.length) % carouselData.length;
            if (next === curr) return prevState;
            return { currentIndex: curr, nextIndex: next, direction: dir };
        });
    }, []);

    const handleAnimationEnd = useCallback(() => {
        setState(({ nextIndex }) => ({ currentIndex: nextIndex, nextIndex, direction: null }));
    }, []);

    return (
        <>
            <h3>#3. React <sub>무한 캐러셀</sub></h3>
            <div className={cx('carousel', 'infiniteCarousel')}>
                <ul className={cx('container')} onAnimationEnd={handleAnimationEnd}>
                    {carouselData.map(({ id, imgUrl }, index) => (
                        <CarouselItem key={id} imgUrl={imgUrl} index={index} {...state} />
                    ))}
                </ul>
                <button type="button" className={cx('navButton', 'navLeft')} onClick={() => move('left')} />
                <button type="button" className={cx('navButton', 'navRight')} onClick={() => move('right')} />
            </div>
        </>
    );
};

export default InfiniteCarousel;
