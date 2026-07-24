import type { ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';
import cx from '../cx';

const SnackbarItem = ({
    opened,
    children,
    ref,
}: {
    opened: boolean;
    children: ReactNode;
    ref: RefObject<HTMLDivElement | null>;
}) => {
    if (!opened) return null;

    return createPortal(
        <div ref={ref} className={cx('SnackbarItem')}>{children}</div>,
        document.querySelector('#snackbarRoot')!
    );
};

export default SnackbarItem;
