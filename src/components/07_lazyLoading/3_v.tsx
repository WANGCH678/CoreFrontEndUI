import VanillaWrapper from '@/components/vanillaWrapper';
import cx from './cx';
import data from './data';
import lazyLoad from './v_lazyLoad';

export const generateLazyImage = (src: string, width: number, height: number) => {
    const $elem = document.createElement('img');

    $elem.classList.add(cx('lazy'));
    $elem.setAttribute('width', `${width}px`);
    $elem.setAttribute('height', `${height}px`);

    const handleLoad = () => { $elem.classList.remove(cx('lazy')); };
    $elem.addEventListener('load', handleLoad);
    lazyLoad($elem, src);

    return $elem;
};

const initiator = (wrapper: HTMLDivElement) => {
    const $imgs = data.map(src => generateLazyImage(src, 600, 320));
    wrapper.append(...$imgs);
};

const LazyLoad3_V = () => (
    <>
        <h2>지연로딩</h2>
        <VanillaWrapper title="#3" initiator={initiator} />
    </>
);

export default LazyLoad3_V;
