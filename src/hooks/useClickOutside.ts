import { useCallback, useEffect, useRef } from 'react';

const useClickOutside = <T extends HTMLElement>(
    callback: (event: MouseEvent) => void,
) => {
    const ref = useRef<T>(null);
    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            callback(event);
        }
    }, [callback]);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [handleClickOutside]);

    return ref;
};

export default useClickOutside;
