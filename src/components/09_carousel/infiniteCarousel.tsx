import { useCallback, useState } from 'react';
import { LazyImage } from '@/components/07_lazyLoading/4_r';
import cx from './cx';

type Direction = 'left' | 'right';
type CarouselState = {
    currentIndex: number;
    nextIndex: number;
    direction: Direction | null;
};
type CarouselItemProps = CarouselState & {
    imgUrl: string;
    index: number;
    width?: number;
    height?: number;
};

const getItemClassNames = ({
    index,
    currentIndex,
    nextIndex,
    direction,
}: CarouselItemProps) => {
    if (index === currentIndex) {
        return direction ? `${direction}_current` : 'current';
    }
    if (index === nextIndex && direction) return `${direction}_next`;
    return undefined;
};

const CarouselItem = (props: CarouselItemProps) => (
    <li className={cx('item', getItemClassNames(props))}>
        <LazyImage
            src={props.imgUrl}
            width={props.width || 0}
            height={props.height || 0}
        />
        <span>#{props.index + 1}</span>
    </li>
);

const InfiniteCarousel = ({
    images,
    initialIndex = 0,
    width = 400,
    height = 400,
}: {
    images: string[];
    initialIndex?: number;
    width?: number;
    height?: number;
}) => {
    const normalizedInitialIndex = images.length
        ? Math.min(Math.max(initialIndex, 0), images.length - 1)
        : 0;
    const [state, setState] = useState<CarouselState>({
        currentIndex: normalizedInitialIndex,
        nextIndex: normalizedInitialIndex,
        direction: null,
    });
    const move = useCallback((direction: Direction) => {
        if (!images.length) return;

        setState(previousState => {
            const current = previousState.currentIndex;
            const next = (
                (direction === 'right' ? current + 1 : current - 1) +
                images.length
            ) % images.length;
            if (next === current) return previousState;

            return {
                currentIndex: current,
                nextIndex: next,
                direction,
            };
        });
    }, [images]);
    const handleAnimationEnd = useCallback(() => {
        setState(({ nextIndex }) => ({
            currentIndex: nextIndex,
            nextIndex,
            direction: null,
        }));
    }, []);

    return (
        <div className={cx('Carousels')}>
            <div
                className={cx('carousel', 'infiniteCarousel')}
                style={{ width, height }}
            >
                <ul
                    className={cx('container')}
                    onAnimationEnd={handleAnimationEnd}
                >
                    {images.map((imgUrl, index) => (
                        <CarouselItem
                            key={imgUrl}
                            imgUrl={imgUrl}
                            index={index}
                            {...state}
                            width={width}
                            height={height}
                        />
                    ))}
                </ul>
                <button
                    type="button"
                    className={cx('navButton', 'navLeft')}
                    aria-label="이전 이미지"
                    onClick={() => move('left')}
                />
                <button
                    type="button"
                    className={cx('navButton', 'navRight')}
                    aria-label="다음 이미지"
                    onClick={() => move('right')}
                />
            </div>
        </div>
    );
};

export default InfiniteCarousel;
