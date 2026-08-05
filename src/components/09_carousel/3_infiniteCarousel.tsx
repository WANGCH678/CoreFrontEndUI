import data from './data';
import InfiniteCarousel from './infiniteCarousel';

const InfiniteCarouselPage = () => (
    <>
        <h3>#3. React <sub>무한 캐러셀</sub></h3>
        <InfiniteCarousel images={data.map(item => item.imgUrl)} />
    </>
);

export default InfiniteCarouselPage;
