import Modal from '@/components/12_modal/5_r/modal';
import InfiniteCarousel from '@/components/09_carousel/infiniteCarousel';
import { useMemo } from 'react';
import type { Image } from './reviews';

export type GalleryProps = {
    images: Image[];
    initialIndex: number;
};

export const initialGalleryProps: GalleryProps = {
    images: [],
    initialIndex: 0,
};

const GalleryModal = ({
    images,
    initialIndex = 0,
}: GalleryProps) => {
    const fullImages = useMemo(
        () => images.map(({ fullsize }) => fullsize),
        [images],
    );

    return (
        <Modal>
            <Modal.Content>
                <InfiniteCarousel
                    images={fullImages}
                    initialIndex={initialIndex}
                    width={600}
                    height={320}
                />
            </Modal.Content>
        </Modal>
    );
};

export default GalleryModal;
