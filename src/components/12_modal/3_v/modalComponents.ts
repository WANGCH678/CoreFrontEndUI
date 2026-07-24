import Modal, { ModalContent, ModalFooter, ModalHeader } from './modal';

export type ModalComponentProps = {
    id: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    headerChildren?: Element[];
    contentChildren?: Element[];
    footerChildren?: Element[];
};

export const AlertModal = ({ id, contentChildren }: ModalComponentProps) => new Modal({
    id,
    content: new ModalContent(contentChildren),
    footer: new ModalFooter(),
    footerButtons: [{ text: '확인' }],
    hideOnBackdropClick: false,
});

export const ConfirmModal = ({
    id,
    onConfirm,
    onCancel,
    headerChildren,
    contentChildren,
}: ModalComponentProps) => new Modal({
    id,
    header: new ModalHeader(headerChildren),
    content: new ModalContent(contentChildren),
    footer: new ModalFooter(),
    footerButtons: [
        { text: '확인', handleClick: onConfirm },
        { text: '취소', handleClick: onCancel },
    ],
});
