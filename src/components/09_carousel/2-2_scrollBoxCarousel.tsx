import { useCallback, useRef, useState } from 'react';
import { LazyImage } from '@/components/07_lazyLoading/4_r';
import ScrollBox, { type IoOptions, type ScrollBoxHandle } from './scrollBox';
import cx from './cx';
import data from './data';

type ScrollBoxItem = {
    id: string;
    description: string;
    imgUrl: string;
    handleClick?: () => void;
};

export const ScrollBoxItem = ({ description, imgUrl, handleClick }: ScrollBoxItem) => (
    <div onClick={handleClick}>
        <LazyImage src={imgUrl} width={300} height={300} />
        <span>{description}</span>
    </div>
);

const ioOptions: IoOptions = { navs: {}, items: { threshold: 1 } };

const ScrollBoxCarousel = () => {
    const scrollBoxRef = useRef<ScrollBoxHandle>(undefined);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleItemClick = useCallback((_item: unknown, index: number) => () => {
        setCurrentIndex(index);
        scrollBoxRef.current?.scrollFocus(index, 'smooth');
    }, []);

    return (
        <>
            <h3>#2-2. React<sub>스크롤 박스 캐러셀</sub></h3>
            <ScrollBox
                list={data}
                Item={ScrollBoxItem}
                currentIndex={currentIndex}
                handleItemClick={handleItemClick}
                classNames={{
                    container: cx('scrollBox', 'scrollBox-carousel'),
                    list: cx('list'),
                    item: cx('item'),
                    current: cx('current'),
                    navButton: cx('nav-button'),
                    navPrev: cx('nav-prev'),
                    navNext: cx('nav-next'),
                }}
                ioOptionProps={ioOptions}
                ref={scrollBoxRef}
            />
        </>
    );
};

export default ScrollBoxCarousel;
