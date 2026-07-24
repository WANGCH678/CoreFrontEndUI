import type { ReactNode, SyntheticEvent } from 'react';
import Modal from './modal';
import { useModal } from './modalContext';

export const AlertModal = ({ id, children }: { id: string; children: ReactNode }) => (
    <Modal id={id} hideOnBackdropClick={false}>
        <Modal.Content>{children}</Modal.Content>
        <Modal.Footer id={id} buttons={[{ type: 'button', text: '확인' }]} />
    </Modal>
);

export const ConfirmModal = ({
    id,
    children,
    onConfirm,
    onCancel,
}: {
    id: string;
    children: ReactNode;
    onConfirm?: () => void;
    onCancel?: () => void;
}) => (
    <Modal id={id}>
        <Modal.Header id={id} title="확인이 필요합니다." />
        <Modal.Content>{children}</Modal.Content>
        <Modal.Footer
            id={id}
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
}: {
    id: string;
    title?: string;
    children: ReactNode;
    onSubmit?: (formData: FormData) => void;
    onCancel?: () => void;
}) => {
    const { closeModal } = useModal();
    const formId = `form_${id}`;
    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        const data = new FormData(e.target as HTMLFormElement);
        onSubmit?.(data);
        closeModal(id);
    };

    return (
        <Modal id={id}>
            <Modal.Header id={id} title={title} />
            <Modal.Content>
                <form id={formId} onSubmit={handleSubmit}>{children}</form>
            </Modal.Content>
            <Modal.Footer
                id={id}
                buttons={[
                    { type: 'submit', text: '확인', formId },
                    { type: 'button', text: '취소', onClick: onCancel },
                ]}
            />
        </Modal>
    );
};
