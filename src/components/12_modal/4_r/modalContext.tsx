import type { ComponentType, RefObject } from 'react';
import { createContext, useCallback, useContext, useEffect, useRef } from 'react';

const ModalContext = createContext<RefObject<HTMLDialogElement | null>>({ current: null });

export const withModal = <T extends {}>(Component: ComponentType<T>) => (props: T) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    return (
        <ModalContext value={dialogRef}>
            <Component {...props} />
        </ModalContext>
    );
};

const toggleScrollbar = () => {
    document.body.classList.toggle(
        'no-scroll',
        document.querySelectorAll('dialog[open]').length > 0
    );
};

export const useModal = () => {
    const dialogRef = useContext(ModalContext);
    const openModal = useCallback(() => {
        if (dialogRef?.current && !dialogRef.current.open) {
            dialogRef.current.showModal();
            toggleScrollbar();
        }
    }, [dialogRef]);
    const closeModal = useCallback(() => {
        dialogRef.current?.close();
    }, [dialogRef]);

    useEffect(() => {
        const dialog = dialogRef.current;
        dialog?.addEventListener('close', toggleScrollbar);
        return () => { dialog?.removeEventListener('close', toggleScrollbar); };
    }, [dialogRef]);

    return { dialogRef, openModal, closeModal };
};
