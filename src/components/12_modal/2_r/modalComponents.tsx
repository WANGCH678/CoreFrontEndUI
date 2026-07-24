import type { ReactNode, SyntheticEvent } from 'react';
import Modal from './modal';
import { useModal } from './modalContext';

export const AlertModal = ({ children }: { children: ReactNode }) => (
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
}: {
    children: ReactNode;
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
        closeModal();
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
