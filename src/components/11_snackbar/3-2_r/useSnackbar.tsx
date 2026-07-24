import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import cx from '../cx';

const SNACKBAR_DURATION = 3000;

export const useSnackbar = (children: ReactNode) => {
    const [opened, toggleSnackbar] = useState(false);
    const snackbarRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<number | null>(null);

    const handleTransitionEnd = useCallback(() => {
        const $el = snackbarRef.current;
        if (!$el) return;

        const cancelTimer = () => {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        };
        const startTimer = () => {
            cancelTimer();
            timeoutRef.current = window.setTimeout(hideSnackbar, SNACKBAR_DURATION);
        };
        const hideSnackbar = () => {
            $el.classList.remove(cx('show'));
            $el.removeEventListener('mouseenter', cancelTimer);
            $el.removeEventListener('mouseleave', startTimer);
        };

        if ($el.className.includes(cx('show'))) {
            $el.addEventListener('mouseenter', cancelTimer);
            $el.addEventListener('mouseleave', startTimer);
            startTimer();
        } else {
            toggleSnackbar(false);
        }
    }, []);

    const showSnackbar = useCallback(() => toggleSnackbar(true), []);

    useEffect(() => {
        if (opened) {
            window.requestAnimationFrame(() => snackbarRef.current?.classList.add(cx('show')));
            snackbarRef.current?.addEventListener('transitionend', handleTransitionEnd);
        }

        return () => {
            if (snackbarRef.current) {
                snackbarRef.current.removeEventListener('transitionend', handleTransitionEnd);
            }
        };
    }, [handleTransitionEnd, opened]);

    const snackbar = opened
        ? createPortal(
            <div ref={snackbarRef} className={cx('SnackbarItem')}>{children}</div>,
            document.querySelector('#snackbarRoot')!
        )
        : null;

    return { snackbar, showSnackbar };
};
