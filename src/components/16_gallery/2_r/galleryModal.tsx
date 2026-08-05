import Modal from '@/components/12_modal/5_r/modal';
import ScrollBox, {
    type ScrollBoxHandle,
} from '@/components/09_carousel/scrollBox';
import { LazyImage } from '@/components/07_lazyLoading/4_r';
import type { Image } from '../1_r/reviews';
import { useCallback, useEffect, useRef, useState } from 'react';
import cx from '../cx';

export type GalleryProps = {
    images: Image[];
    initialIndex: number;
};

export const initialGalleryProps: GalleryProps = {
    images: [],
    initialIndex: 0,
};

type Zoom = 'scaleUp' | 'scaleDown';

const GalleryThumbnail = ({
    thumbnail,
    handleClick,
}: Image & { handleClick?: () => void }) => (
    <div className={cx('thumbnail')} onClick={handleClick}>
        <LazyImage src={thumbnail} width={150} height={80} />
    </div>
);

const GalleryModal = ({ images, initialIndex = 0 }: GalleryProps) => {
    const scrollBoxRef = useRef<ScrollBoxHandle>(null);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [zoom, setZoom] = useState(1);
    const fullSizeImageUrl = images[currentIndex]?.fullsize || '';

    const resetZoom = useCallback(() => setZoom(1), []);
    const handleZoom = useCallback((direction: Zoom) => {
        setZoom(previous => Math.min(
            Math.max(previous + (direction === 'scaleUp' ? 1 : -1) * 0.25, 0.25),
            2.5,
        ));
    }, []);

    const handleItemClick = useCallback((_: unknown, index: number) => () => {
        setCurrentIndex(index);
        scrollBoxRef.current?.scrollFocus(index, 'smooth');
        resetZoom();
    }, [resetZoom]);

    useEffect(() => {
        scrollBoxRef.current?.scrollFocus(initialIndex, 'instant');
    }, [initialIndex]);

    return (
        <Modal className={cx('GalleryModal')}>
            <Modal.Header
                className={cx('GalleryModalHeader')}
                closeButtonClassName={cx('close')}
            >
                <div className={cx('zoom-buttons')}>
                    <button
                        type="button"
                        className={cx('zoom-down')}
                        onClick={() => handleZoom('scaleDown')}
                    >
                        −
                    </button>
                    <button
                        type="button"
                        className={cx('current-zoom')}
                        onClick={resetZoom}
                    >
                        {Math.round(zoom * 100)}%
                    </button>
                    <button
                        type="button"
                        className={cx('zoom-up')}
                        onClick={() => handleZoom('scaleUp')}
                    >
                        +
                    </button>
                </div>
            </Modal.Header>
            <Modal.Content className={cx('GalleryModalContent')}>
                <div className={cx('main-view')}>
                    {fullSizeImageUrl && (
                        <LazyImage
                            key={fullSizeImageUrl}
                            src={fullSizeImageUrl}
                            width={600}
                            height={320}
                            style={{ transform: `scale(${zoom})` }}
                        />
                    )}
                </div>
                <ScrollBox
                    list={images}
                    Item={GalleryThumbnail}
                    currentIndex={currentIndex}
                    classNames={{
                        container: cx('ScrollBox'),
                        current: cx('current'),
                        navButton: cx('nav-button'),
                        navPrev: cx('nav-prev'),
                        navNext: cx('nav-next'),
                        navVisible: cx('visible'),
                    }}
                    handleItemClick={handleItemClick}
                    ref={scrollBoxRef}
                />
            </Modal.Content>
        </Modal>
    );
};

export default GalleryModal;
