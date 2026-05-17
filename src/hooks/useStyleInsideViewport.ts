import { useScrollInfo, useViewportSize } from '@/context/viewportContext';
import { type CSSProperties, type RefObject, useLayoutEffect, useState } from 'react';

const ViewportPadding = 8;
const TooltipGap = 6;

const clamp = (value: number, min: number, max: number) => (
    Math.min(Math.max(value, min), max)
);

const useStyleInsideViewport = (
    rootRef: RefObject<HTMLElement | null>,
    targetRef: RefObject<HTMLElement | null>,
    enabled = true,
) => {
    const { top: vt, left: vl } = useScrollInfo();
    const { width: vw, height: vh } = useViewportSize();
    const [style, setStyle] = useState<CSSProperties | undefined>(undefined);

    useLayoutEffect(() => {
        if (!enabled) {
            setStyle(undefined);
            return;
        }
        if (!rootRef.current || !targetRef.current) return;

        const viewportWidth = vw || window.innerWidth;
        const viewportHeight = vh || window.innerHeight;
        const rootRect = rootRef.current.getBoundingClientRect();
        const { width, height } = targetRef.current.getBoundingClientRect();
        const maxLeft = viewportWidth - width - ViewportPadding;
        const maxTop = viewportHeight - height - ViewportPadding;

        const preferredLeft = rootRect.left + 30;
        const preferredTop = rootRect.bottom + TooltipGap;
        const flippedTop = rootRect.top - height - TooltipGap;
        const top = preferredTop + height > viewportHeight
            ? flippedTop
            : preferredTop;

        setStyle({
            position: 'fixed',
            left: clamp(preferredLeft, ViewportPadding, maxLeft),
            top: clamp(top, ViewportPadding, maxTop),
            right: 'auto',
            bottom: 'auto',
        });
    }, [enabled, vt, vl, vw, vh, rootRef, targetRef]);

    return style;
};

export default useStyleInsideViewport;
