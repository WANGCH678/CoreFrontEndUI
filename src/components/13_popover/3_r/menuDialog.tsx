import useStyleInsideViewport from '@/hooks/useStyleInsideViewport';
import cx from '../cx';
import { useEffect, type RefObject } from 'react';

const MenuPositionStyle = { top: 0, bottom: 0, left: 45, right: 45 };

const MenuDialog = ({
    id,
    rootRef,
    dialogRef,
    handleClose,
    opened,
}: {
    id: string;
    rootRef: RefObject<HTMLElement | null>;
    dialogRef: RefObject<HTMLDialogElement | null>;
    handleClose: () => void;
    opened: boolean;
}) => {
    const style = useStyleInsideViewport(
        rootRef,
        dialogRef,
        MenuPositionStyle,
        'absolute',
        opened,
    );

    useEffect(() => {
        const dialog = dialogRef.current;
        dialog?.addEventListener('close', handleClose);

        return () => {
            dialog?.removeEventListener('close', handleClose);
        };
    }, [dialogRef, handleClose]);

    return (
        <dialog
            className={cx('MenuDialog')}
            ref={dialogRef}
            style={style}
            onClick={() => dialogRef.current?.close()}
        >
            <ul
                className={cx('context-menu')}
                onClick={event => event.stopPropagation()}
            >
                <li><button type="button">#{id}</button></li>
                <li><button type="button">스레드의 댓글</button></li>
                <li><button type="button">메시지 전달</button></li>
                <li><button type="button">나중을 위해 저장</button></li>
                <li><button type="button">읽지 않음으로 표시</button></li>
                <li><button type="button">삭제</button></li>
            </ul>
        </dialog>
    );
};

export default MenuDialog;
