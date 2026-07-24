import type { ReactNode, SyntheticEvent } from 'react';
import { useCallback } from 'react';
import cx from '../cx';
import { useModal } from './modalContext';

const Modal = ({
    hideOnBackdropClick = true,
    children,
}: {
    hideOnBackdropClick?: boolean;
    children: ReactNode;
}) => {
    const { dialogRef, closeModal } = useModal();
    const handleClose = useCallback((e: SyntheticEvent) => {
        if (hideOnBackdropClick && dialogRef?.current === e.target) closeModal();
    }, [dialogRef, closeModal, hideOnBackdropClick]);

    return (
        <dialog className={cx('Dialog')} ref={dialogRef} onClick={handleClose}>
            {children}
        </dialog>
    );
};

const ModalHeader = ({
    title,
    children,
    showCloseButton = true,
}: {
    title?: string;
    children?: ReactNode;
    showCloseButton?: boolean;
}) => {
    const { closeModal } = useModal();

    return (
        <div className={cx('ModalHeader')}>
            <div className={cx('title')}>{title}</div>
            {children}
            {showCloseButton && (
                <button type="button" className={cx('close')} onClick={closeModal} />
            )}
        </div>
    );
};

const ModalContent = ({ children }: { children: ReactNode }) => (
    <div className={cx('ModalContent')}>{children}</div>
);

type ButtonProps = {
    type: 'submit' | 'button';
    text: string;
    formId?: string;
    onClick?: (e: SyntheticEvent) => void;
};

const ModalFooter = ({
    buttons,
    children,
}: {
    buttons: ButtonProps[];
    children?: ReactNode;
}) => {
    const { closeModal } = useModal();

    return (
        <div className={cx('ModalFooter')}>
            {children}
            {buttons.map(({ type, text, formId, onClick }) => {
                if (type === 'submit') return (
                    <button key={text} type={type} form={formId}>{text}</button>
                );

                return (
                    <button key={text} type={type} onClick={e => {
                        onClick?.(e);
                        closeModal();
                    }}>{text}</button>
                );
            })}
        </div>
    );
};

Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

export default Modal;
