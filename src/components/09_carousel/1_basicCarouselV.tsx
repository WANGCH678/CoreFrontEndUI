import VanillaWrapper from '@/components/vanillaWrapper';
import { generateLazyImage } from '@/components/07_lazyLoading/3_v';
import { generateDOM } from '@/service/util';
import cx from './cx';
import data from './data';

type Direction = 'left' | 'right';

const dataSize = data.length;
const initiator = (wrapper: HTMLDivElement) => {
    const $ul = generateDOM('ul', cx('container'));
    $ul.style.left = '0px';
    let currentIndex = 0;
    let isAnimating = false;
    const handleTransitionEnd = () => { isAnimating = false; };
    $ul.addEventListener('transitionend', handleTransitionEnd);

    data.forEach(({ imgUrl }, index) => {
        const $img = generateLazyImage(imgUrl, 400, 400);
        const $li = generateDOM('li', cx('item'));
        $li.append($img, generateDOM('span', undefined, `#${index + 1}`));
        $ul.append($li);
    });
    const move = (direction: Direction) => {
        if (isAnimating) return;
        const nextIndex = direction === 'right'
            ? Math.min(currentIndex + 1, dataSize - 1)
            : Math.max(currentIndex - 1, 0);
        if (nextIndex === currentIndex) return;
        $ul.style.left = `${-1 * nextIndex * 400}px`;
        currentIndex = nextIndex;
        isAnimating = true;
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
