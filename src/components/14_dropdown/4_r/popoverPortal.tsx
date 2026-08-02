import useStyleInsideViewport, {
    type PositionStyleType,
} from '@/hooks/useStyleInsideViewport';
import useClickOutside from '@/hooks/useClickOutside';
import type { ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';
import type { DropdownListProps } from './useDropdown';

export type PopoverPortalContent = ({
    elRef,
    style,
    children,
}: {
    elRef: RefObject<HTMLUListElement | null>;
    style?: PositionStyleType;
    children: ReactNode;
}) => ReactNode;

const PopoverPortal = ({
    Content,
    containerRef,
    opened,
    positionStyle,
    handleClose,
    children,
}: Omit<
    DropdownListProps<{ id: string; text: string }>,
    'dialogRef'
> & {
    Content: PopoverPortalContent;
    positionStyle: PositionStyleType;
}) => {
    const elRef = useClickOutside<HTMLUListElement>(handleClose);
    const style = useStyleInsideViewport(
        containerRef,
        elRef,
        positionStyle,
        'absolute',
        opened,
    );

    return opened
        ? createPortal(
            <Content elRef={elRef} style={style}>{children}</Content>,
            document.querySelector('#popoverRoot')!,
        )
        : null;
};

export default PopoverPortal;
