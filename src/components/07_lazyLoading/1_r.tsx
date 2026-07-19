import { useCallback, useEffect, useRef, useState } from 'react';
import { useScrollInfo, useViewportSize } from '@/context/viewportContext';
import cx from './cx';
import data from './data';

type Image = { src: string; width: number; height: number };

const LazyImage = ({ src, width, height }: Image) => {
    const scrollInfo = useScrollInfo();
    const viewportSize = useViewportSize();
    const imgRef = useRef<HTMLImageElement>(null);
    const [loaded, setLoaded] = useState(false);
    const handleLoad = useCallback(() => { setLoaded(true) }, []);

    useEffect(() => {
        if (loaded || !scrollInfo) return;
        const $img = imgRef.current!;
        const { width: vw, height: vh } = viewportSize;
        const { top, left, width, height } = $img.getBoundingClientRect();

        if (top > vh || top + height < 0 || left > vw || left + width < 0) return;

        $img.setAttribute('src', src);
    }, [src, loaded, scrollInfo, viewportSize]);

    return (
        <img
            className={cx({ lazy: !loaded })}
            onLoad={handleLoad}
            ref={imgRef}
            width={width}
            height={height}
            alt=""
        />
    );
};

const LazyLoad1 = () => (
    <>
        <h2>지연 로딩</h2>
        <h3>#1. React - 직접 계산</h3>
        {data.map(url => <LazyImage src={url} key={url} width={600} height={320} />)}
    </>
);

export default LazyLoad1;
