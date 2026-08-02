import { useDeferredValue, useEffect, useRef } from 'react';
import type { ReactNode, RefObject } from 'react';
import useStyleInsideViewport, {
    type PositionStyleType,
} from '@/hooks/useStyleInsideViewport';

export type PopoverDialogProps = {
    className?: string;
    rootRef: RefObject<HTMLElement | null>;
    dialogRef: RefObject<HTMLDialogElement | null>;
    opened: boolean;
    positionStyle?: PositionStyleType;
    handleClose: () => void;
    children: ReactNode;
};

const DefaultPositionStyle: PositionStyleType = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
};

const PopoverDialog = ({
    className,
    rootRef,
    dialogRef,
    opened,
    positionStyle = DefaultPositionStyle,
    handleClose,
    children,
}: PopoverDialogProps) => {
    const deferredOpened = useDeferredValue(opened);
    const style = useStyleInsideViewport(
        rootRef,
        dialogRef,
        positionStyle,
        'absolute',
        deferredOpened,
    );
    const positionRef = useRef<[number, number]>([0, 0]);

    useEffect(() => {
        const dialog = dialogRef.current;
        dialog?.addEventListener('close', handleClose);

        return () => {
            dialog?.removeEventListener('close', handleClose);
        };
    }, [dialogRef, handleClose]);

    useEffect(() => {
        if (dialogRef.current && opened && !dialogRef.current.open) {
            positionRef.current = [window.scrollX, window.scrollY];
            dialogRef.current.showModal();
        }
    }, [dialogRef, opened]);

    useEffect(() => {
        if (dialogRef.current && deferredOpened) {
            window.scrollTo(...positionRef.current);
        }
    }, [dialogRef, deferredOpened]);

    return (
        <dialog
            className={className}
            ref={dialogRef}
            style={style}
            onClick={() => dialogRef.current?.close()}
        >
            {children}
        </dialog>
    );
};

export default PopoverDialog;
