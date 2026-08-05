import cx from '../cx';
import data from '../data';
import { useCallback, useMemo, useRef } from 'react';
import ScrollBox, {
    type ScrollBoxHandle,
} from '@/components/09_carousel/scrollBox';
import { LazyImage } from '@/components/07_lazyLoading/4_r';
import type { GalleryProps } from './galleryModal';

export type Image = {
    id: string;
    thumbnail: string;
    fullsize: string;
};

type Review = {
    id: string;
    name: string;
    text: string;
    images?: Image[];
    showGallery: (galleryProps: GalleryProps) => void;
};

const totalImages: Image[] = data.flatMap(review => review.images || []);

const TotalImageItem = ({
    thumbnail,
    handleClick,
}: Image & { handleClick?: () => void }) => (
    <button type="button" className={cx('item')} onClick={handleClick}>
        <LazyImage src={thumbnail} width={150} height={80} />
    </button>
);

const ReviewItem = ({
    name,
    text,
    images = [],
    showGallery,
}: Review) => {
    const openGallery = useCallback(() => {
        showGallery({ images, initialIndex: 0 });
    }, [images, showGallery]);
    const imageLength = images.length;

    return (
        <li className={cx('review-item')}>
            {imageLength > 0 && (
                <button
                    type="button"
                    className={cx('image-button')}
                    onClick={openGallery}
                >
                    <LazyImage
                        src={images[0].thumbnail}
                        width={150}
                        height={80}
                    />
                    {imageLength > 1 && (
                        <span className={cx('image-more')}>
                            +{imageLength - 1}
                        </span>
                    )}
                </button>
            )}
            <div className={cx('user')}>{name}</div>
            <div className={cx('text')}>{text}</div>
        </li>
    );
};

const Reviews = ({
    showGallery,
}: {
    showGallery: (galleryProps: GalleryProps) => void;
}) => {
    const scrollBoxRef = useRef<ScrollBoxHandle>(null);
    const handleTotalItemClick = useCallback((_: unknown, index: number) => () => {
        showGallery({ images: totalImages, initialIndex: index });
    }, [showGallery]);
    const totalImageList = useMemo(() => totalImages.slice(0, 10), []);

    return (
        <div className={cx('Reviews')}>
            <h3>사용자 리뷰</h3>
            <div>
                <h4>사진 모아보기</h4>
                <ScrollBox
                    list={totalImageList}
                    Item={TotalImageItem}
                    ref={scrollBoxRef}
                    handleItemClick={handleTotalItemClick}
                    classNames={{
                        container: cx('ScrollBox'),
                        item: cx('item'),
                        navButton: cx('nav-button'),
                        navPrev: cx('nav-prev'),
                        navNext: cx('nav-next'),
                        navVisible: cx('visible'),
                    }}
                />
            </div>
            <div>
                <h4>리뷰</h4>
                <ul className={cx('review-list')}>
                    {data.map(item => (
                        <ReviewItem
                            key={item.id}
                            {...item}
                            showGallery={showGallery}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Reviews;
