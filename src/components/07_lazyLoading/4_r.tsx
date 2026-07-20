import { useCallback, useEffect, useRef, useState } from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import cx from './cx';
import data from './data';

type Image = { src: string; width: number; height: number };

export const LazyImage = ({ src, width, height }: Image) => {
    const figureRef = useRef<HTMLElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [loaded, setLoaded] = useState(false);
    const { entries, observerRef } = useIntersectionObserver(imgRef);
    const handleLoad = useCallback(() => { setLoaded(true) }, []);

    useEffect(() => {
        const isVisible = entries.has(imgRef.current!);

        if (isVisible) {
            figureRef.current!.style.backgroundImage = `url(${src.replace('/600/320', '/60/32')})`;
            imgRef.current!.setAttribute('src', src);
            observerRef.current?.disconnect();
        }
    }, [src, entries, observerRef]);

    return (
        <figure ref={figureRef} className={cx('lazy-image', { lazy: !loaded })}>
            <img onLoad={handleLoad} ref={imgRef} width={width} height={height} alt="" />
        </figure>
    );
};

const LazyLoad4 = () => (
    <>
        <h2>지연로딩 </h2>
        <h3>#4. React - IO + 작은 이미지 로딩 추가</h3>
        {data.map(url => (
            <LazyImage src={url} key={url} width={600} height={320} />
        ))}
    </>
);

export default LazyLoad4;
