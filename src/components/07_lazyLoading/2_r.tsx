import { useCallback, useEffect, useRef, useState } from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import cx from './cx';
import data from './data';

type Image = { src: string; width: number; height: number };

const LazyImageNative = ({ src, width, height }: Image) => {
    const [loaded, setLoaded] = useState(false);
    const handleLoad = useCallback(() => { setLoaded(true) }, []);

    return (
        <img
            loading="lazy"
            className={cx({ lazy: !loaded })}
            onLoad={handleLoad}
            src={src}
            width={width}
            height={height}
            alt=""
        />
    );
};

const LazyImageIO = ({ src, width, height }: Image) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const [loaded, setLoaded] = useState(false);
    const { entries, observerRef } = useIntersectionObserver(imgRef);
    const handleLoad = useCallback(() => { setLoaded(true) }, []);

    useEffect(() => {
        if (entries.has(imgRef.current!)) {
            imgRef.current!.setAttribute('src', src);
            observerRef.current?.disconnect();
        }
    }, [src, entries, observerRef]);

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

const isNativeSupported = 'loading' in HTMLImageElement.prototype;
export const LazyImage = isNativeSupported ? LazyImageNative : LazyImageIO;

const LazyLoad2 = () => (
    <>
        <h2>지연로딩 </h2>
        <h3>#2. React - IntersectionObserver + native</h3>
        {data.map(url => <LazyImage src={url} key={url} width={600} height={320} />)}
    </>
);

export default LazyLoad2;
