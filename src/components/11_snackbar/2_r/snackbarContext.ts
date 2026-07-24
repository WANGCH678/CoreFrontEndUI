import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import cx from '../cx';

const SNACKBAR_DURATION = 3000;

export type SnackbarState = Map<string, ReactNode>;

export const SnackbarContext = createContext<
    [SnackbarState, Dispatch<SetStateAction<SnackbarState>>]
>([new Map(), () => {}]);

export const useSnackbar = (id: string, children: ReactNode) => {
    const [snackbars, setSnackbars] = useContext(SnackbarContext);
    const snackbarRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<number | null>(null);
    const opened = snackbars.has(id);

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
            setSnackbars(prev => {
                const next = new Map(prev);
                next.delete(id);
                return next;
            });
        }
    }, [id, setSnackbars]);

    const showSnackbar = useCallback(() => {
        setSnackbars(prev => {
            const next = new Map(prev);
            next.set(id, children);
            return next;
        });
    }, [id, children, setSnackbars]);

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
    }, [opened, handleTransitionEnd]);

    return { snackbarRef, showSnackbar };
};
