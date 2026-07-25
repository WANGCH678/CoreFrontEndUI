import { useCallback, useRef } from 'react';
import type {
    Dispatch,
    ReactNode,
    RefObject,
    SetStateAction,
} from 'react';
import useStyleInsideViewport, {
    type PositionStyleType,
} from '@/hooks/useStyleInsideViewport';

export type PopoverProps = {
    id: string;
    className?: string;
    rootRef: RefObject<HTMLElement | null>;
    opened: boolean;
    positionStyle?: PositionStyleType;
    children: ReactNode;
    setOpened: Dispatch<SetStateAction<boolean>>;
};

const DefaultPositionStyle: PositionStyleType = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
};

const Popover = ({
    id,
    className,
    rootRef,
    positionStyle = DefaultPositionStyle,
    children,
    opened,
    setOpened,
}: PopoverProps) => {
    const popoverRef = useRef<HTMLDivElement>(null);
    const style = useStyleInsideViewport(
        rootRef,
        popoverRef,
        positionStyle,
        'absolute',
        opened,
    );

    const handleToggle = useCallback(() => {
        const opened = !!popoverRef.current?.matches(':popover-open');
        setOpened(opened);
    }, [setOpened]);

    return (
        <div
            id={id}
            popover="auto"
            className={className}
            style={style}
            ref={popoverRef}
            onToggle={handleToggle}
        >
            {children}
        </div>
    );
};

export default Popover;
