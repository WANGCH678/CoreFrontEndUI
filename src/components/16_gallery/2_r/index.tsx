import Reviews from '../1_r/reviews';
import { useCallback, useState } from 'react';
import { useModal } from '@/components/12_modal/5_r/useModal';
import GalleryModal, {
    type GalleryProps,
    initialGalleryProps,
} from './galleryModal';

const Gallery2 = () => {
    const [galleryData, setGalleryData] = useState<GalleryProps>(initialGalleryProps);
    const { Component: Gallery, show: showGalleryModal } = useModal(GalleryModal);
    const showGallery = useCallback((galleryProps: GalleryProps) => {
        setGalleryData(galleryProps);
        showGalleryModal();
    }, [showGalleryModal]);

    return (
        <>
            <h2>Gallery #2 - LightBox</h2>
            <Reviews showGallery={showGallery} />
            <Gallery {...galleryData} />
        </>
    );
};

export default Gallery2;
