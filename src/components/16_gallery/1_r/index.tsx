import { useState } from 'react';
import ScrollBox from '@/components/09_carousel/scrollBox';
import data, { type GalleryImage } from '../data';
import cx from '../cx';

const Thumbnail = ({
    thumbnail,
    id,
    handleClick,
}: GalleryImage & { handleClick?: () => void }) => (
    <button
        type="button"
        className={cx('image-button')}
        onClick={handleClick}
        aria-label={`${id}번 이미지 크게 보기`}
    >
        <img src={thumbnail} alt="" width="150" height="80" />
    </button>
);

const Gallery1 = () => {
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

    return (
        <section>
            <h2>갤러리</h2>
            <h3>#1. Carousel</h3>
            {selectedImage && (
                <figure>
                    <img
                        src={selectedImage.fullsize}
                        alt="선택한 리뷰 이미지"
                        width="600"
                        height="320"
                    />
                </figure>
            )}
            <div className={cx('Reviews')}>
                <ul className={cx('review-list')}>
                    {data.map(review => (
                        <li className={cx('review-item')} key={review.id}>
                            <strong className={cx('user')}>{review.name}</strong>
                            <p>{review.text}</p>
                            <ScrollBox
                                list={review.images}
                                Item={Thumbnail}
                                classNames={{
                                    container: cx('ScrollBox'),
                                    item: cx('item'),
                                    navButton: cx('nav-button'),
                                    navPrev: cx('nav-prev'),
                                    navNext: cx('nav-next'),
                                    navVisible: cx('visible'),
                                }}
                                handleItemClick={image => () => setSelectedImage(image)}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Gallery1;
