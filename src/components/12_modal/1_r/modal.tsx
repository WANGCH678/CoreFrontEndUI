import type { ReactNode, SyntheticEvent } from 'react';
import cx from '../cx';
import { useModal } from './modalContext';

const Modal = ({
    id,
    children,
    hideOnBackdropClick = true,
}: {
    id: string;
    children: ReactNode;
    hideOnBackdropClick?: boolean;
}) => {
    const { closeModal } = useModal();
    const stopPropagation = (e: SyntheticEvent) => e.stopPropagation();

    return (
        <div
            id={id}
            className={cx('Modal')}
            onClick={hideOnBackdropClick ? () => closeModal(id) : undefined}
        >
            <div className={cx('inner')} onClick={stopPropagation}>{children}</div>
        </div>
    );
};

const ModalHeader = ({
    id,
    title,
    children,
    showCloseButton = true,
}: {
    id: string;
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
                <button type="button" className={cx('close')} onClick={() => closeModal(id)} />
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
    id,
    buttons,
    children,
}: {
    id: string;
    buttons: ButtonProps[];
    children?: ReactNode;
}) => {
    const { closeModal } = useModal();
    const hide = () => closeModal(id);

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

Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

export default Modal;
