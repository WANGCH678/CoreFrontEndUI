import type { SyntheticEvent } from 'react';
import Modal, { type ModalProps } from './modal';
import { useModalContext } from './useModal';

export const AlertModal = ({ children }: ModalProps) => (
    <Modal hideOnBackdropClick={false}>
        <Modal.Content>{children}</Modal.Content>
        <Modal.Footer buttons={[{ type: 'button', text: '확인' }]} />
    </Modal>
);

export const ConfirmModal = ({
    children,
    confirmed,
    onConfirm,
    onCancel,
}: ModalProps & {
    confirmed: boolean | null;
    onConfirm: () => void;
    onCancel: () => void;
}) => (
    <Modal>
        <Modal.Header title={confirmed ? '확인된 컨펌' : '확인안된 컨펌'} />
        <Modal.Content>{children}</Modal.Content>
        <Modal.Footer
            buttons={[
                { type: 'button', text: '확인', onClick: onConfirm },
                { type: 'button', text: '취소', onClick: onCancel },
            ]}
        />
    </Modal>
);

export const FormModal = ({
    id,
    title,
    children,
    onSubmit,
    onCancel,
}: ModalProps & {
    id: string;
    title?: string;
    onSubmit?: (formData: FormData) => void;
    onCancel?: () => void;
}) => {
    const { hide } = useModalContext();
    const formId = `form_${id}`;
    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        const data = new FormData(e.target as HTMLFormElement);
        onSubmit?.(data);
        hide();
    };

    return (
        <Modal>
            <Modal.Header title={title} />
            <Modal.Content>
                <form id={formId} onSubmit={handleSubmit}>{children}</form>
            </Modal.Content>
            <Modal.Footer
                buttons={[
                    { type: 'submit', text: '확인', formId },
                    { type: 'button', text: '취소', onClick: onCancel },
                ]}
            />
        </Modal>
    );
};
