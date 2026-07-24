import ScrollBox from './scrollBox';
import data from './data';
import { LazyImage } from '@/components/07_lazyLoading/4_r';
import cx from './cx';

export const ScrollBoxItem = ({ description, imgUrl }: {
    id: string;
    description: string;
    imgUrl: string;
}) => (
    <div>
        <LazyImage src={imgUrl} width={300} height={300} />
        <span>{description}</span>
    </div>
);

const ScrollBoxComponent = () => (
    <>
        <h3>#2-1. React<sub>스크롤 박스</sub></h3>
        <ScrollBox
            list={data}
            Item={ScrollBoxItem}
            classNames={{
                container: cx('scrollBox'),
                item: cx('item'),
                observer: cx('observer'),
                navButton: cx('nav-button'),
                navVisible: cx('on'),
                navPrev: cx('nav-prev'),
                navNext: cx('nav-next'),
            }}
        />
    </>
);

export default ScrollBoxComponent;
