import { useScrollInfo, useViewportSize } from '@/context/viewportContext';
import {
    type CSSProperties,
    type RefObject,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import { deepCompare } from '@/service/util';

type PositionKey = 'left' | 'top' | 'right' | 'bottom';
export type PositionStyleType = Partial<Record<PositionKey, string | number>>;

const OppositePositionKeys = {
    left: 'right',
    top: 'bottom',
    right: 'left',
    bottom: 'top',
} as const;

const clamp = (value: number, min: number, max: number) => (
    Math.min(Math.max(value, min), max)
);

const useStyleInsideViewport = (
    rootRef: RefObject<HTMLElement | null>,
    targetRef: RefObject<HTMLElement | null>,
    positionStyle?: PositionStyleType | boolean,
    positionType: 'relative' | 'absolute' = 'relative',
    needUpdate = true,
) => {
    const { top: vt, left: vl } = useScrollInfo();
    const { width: vw, height: vh } = useViewportSize();
    const stored = useRef<Record<string, number>>({});
    const [style, setStyle] = useState<CSSProperties | undefined>(undefined);

    useLayoutEffect(() => {
        if (positionStyle === false) {
            stored.current = {};
            setStyle(undefined);
            return;
        }

        const newInfo = { vt, vl, vw, vh };
        if (
            !needUpdate ||
            !rootRef.current ||
            !targetRef.current ||
            deepCompare(newInfo, stored.current)
        ) return;

        stored.current = newInfo;
        const rootRect = rootRef.current.getBoundingClientRect();
        const targetRect = targetRef.current.getBoundingClientRect();
        const viewportWidth = vw || window.innerWidth;
        const viewportHeight = vh || window.innerHeight;

        // 기존 툴팁은 세 번째 인자로 활성화 여부를 전달하고 fixed 좌표를 사용한다.
        if (positionStyle === true) {
            const viewportPadding = 8;
            const gap = 6;
            const preferredTop = rootRect.bottom + gap;
            const flippedTop = rootRect.top - targetRect.height - gap;

            setStyle({
                position: 'fixed',
                left: clamp(
                    rootRect.left + 30,
                    viewportPadding,
                    viewportWidth - targetRect.width - viewportPadding,
                ),
                top: clamp(
                    preferredTop + targetRect.height > viewportHeight
                        ? flippedTop
                        : preferredTop,
                    viewportPadding,
                    viewportHeight - targetRect.height - viewportPadding,
                ),
                right: 'auto',
                bottom: 'auto',
            });
            return;
        }

        const horizontal = rootRect.right + targetRect.width < viewportWidth
            ? 'left'
            : 'right';
        const vertical = rootRect.bottom + targetRect.height < viewportHeight
            ? 'top'
            : 'bottom';
        const oppositeHorizontal = OppositePositionKeys[horizontal];
        const oppositeVertical = OppositePositionKeys[vertical];
        const customPositionStyle = typeof positionStyle === 'object'
            ? positionStyle
            : undefined;

        if (positionType === 'relative') {
            setStyle({
                [horizontal]: customPositionStyle && horizontal in customPositionStyle
                    ? customPositionStyle[horizontal]
                    : '100%',
                [vertical]: customPositionStyle && vertical in customPositionStyle
                    ? customPositionStyle[vertical]
                    : '100%',
                [oppositeHorizontal]: 'auto',
                [oppositeVertical]: 'auto',
            });
        } else {
            setStyle({
                [horizontal]: Number(customPositionStyle?.[horizontal] || 0) + (
                    horizontal === 'left'
                        ? vl + rootRect.left
                        : -1 * (vl + rootRect.right - viewportWidth)
                ),
                [vertical]: Number(customPositionStyle?.[vertical] || 0) + (
                    vertical === 'top'
                        ? vt + rootRect.top
                        : -1 * (vt + rootRect.bottom - viewportHeight)
                ),
                [oppositeHorizontal]: 'auto',
                [oppositeVertical]: 'auto',
            });
        }
    }, [
        rootRef,
        targetRef,
        vt,
        vl,
        vw,
        vh,
        positionStyle,
        positionType,
        needUpdate,
    ]);

    return style;
};

export default useStyleInsideViewport;
