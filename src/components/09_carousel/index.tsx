import BasicCarouselV from './1_basicCarouselV';
import ScrollBoxComponent from './2-1_scrollBox';
import ScrollBoxCarousel from './2-2_scrollBoxCarousel';
import InfiniteCarousel from './3_infiniteCarousel';
import Carousel3D from './4_3Dcarousel';
import cx from './cx';

const Carousels = () => (
    <div className={cx('Carousels')}>
        <h2>캐러셀</h2>
        <BasicCarouselV />
        <ScrollBoxComponent />
        <ScrollBoxCarousel />
        <InfiniteCarousel />
        <Carousel3D />
    </div>
);

export default Carousels;
