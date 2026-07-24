import type { ReactNode, SyntheticEvent } from 'react';
import { useCallback, useEffect } from 'react';
import cx from '../cx';
import { useModalContext } from './useModal';

export type ModalProps = {
    children?: ReactNode;
    className?: string;
    hideOnBackdropClick?: boolean;
};

const Modal = ({ hideOnBackdropClick = true, className, children }: ModalProps) => {
    const { ref, hide } = useModalContext();
    const handleClose = useCallback((e: SyntheticEvent) => {
        if (hideOnBackdropClick && ref?.current === e.target) hide();
    }, [ref, hide, hideOnBackdropClick]);

    useEffect(() => {
        const modal = ref.current;
        if (!modal) return;
        if (!modal.open) modal.showModal();
        modal.addEventListener('close', hide);
        return () => { modal.removeEventListener('close', hide); };
    }, [ref, hide]);

    return (
        <dialog className={cx('Dialog', className)} ref={ref} onClick={handleClose}>
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
    const { hide } = useModalContext();

    return (
        <div className={cx('ModalHeader')}>
            <div className={cx('title')}>{title}</div>
            {children}
            {showCloseButton && (
                <button type="button" className={cx('close')} onClick={hide} />
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
    const { hide } = useModalContext();

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
                        hide();
                    }}>{text}</button>
                );
            })}
        </div>
    );
};

const CompoundModal = Modal as typeof Modal & {
    Header: typeof ModalHeader;
    Content: typeof ModalContent;
    Footer: typeof ModalFooter;
};

CompoundModal.Header = ModalHeader;
CompoundModal.Content = ModalContent;
CompoundModal.Footer = ModalFooter;

export default CompoundModal;
