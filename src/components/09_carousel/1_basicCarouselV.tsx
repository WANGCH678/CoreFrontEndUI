import VanillaWrapper from '@/components/vanillaWrapper';
import { generateLazyImage } from '@/components/07_lazyLoading/3_v';
import { generateDOM } from '@/service/util';
import cx from './cx';
import data from './data';

type Direction = 'left' | 'right';

const initiator = (wrapper: HTMLDivElement) => {
    const $ul = generateDOM('ul', cx('container'));
    data.forEach(({ imgUrl }, index) => {
        const $img = generateLazyImage(imgUrl, 400, 400);
        const $li = generateDOM('li', cx('item'));
        $li.append($img, generateDOM('span', undefined, `#${index + 1}`));
        $ul.append($li);
    });
    const move = (direction: Direction) => {
        void direction;
        // 여기에 이동 명령을 작성할 예정입니다.
    };
    const $left = generateDOM('button', cx('navButton', 'navLeft'));
    $left.addEventListener('click', () => move('left'));
    const $right = generateDOM('button', cx('navButton', 'navRight'));
    $right.addEventListener('click', () => move('right'));
    wrapper.classList.add(cx('carousel'));
    wrapper.append($ul, $left, $right);
};

const BasicCarouselV = () => <VanillaWrapper title="#1" initiator={initiator} />;

export default BasicCarouselV;
