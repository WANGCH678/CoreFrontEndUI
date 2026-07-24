import type { ReactNode } from 'react';
import { AlertModal, ConfirmModal, FormModal } from './modalComponents';
import { ModalContextProvider, useModal } from './modalContext';

const AlertModalTrigger = ({ id, children }: { id: string; children: ReactNode }) => {
    const { openModal } = useModal();
    const openAlertModal = () => openModal(id, <AlertModal id={id}>{children}</AlertModal>);

    return (
        <button type="button" onClick={openAlertModal}>알럿모달 열기</button>
    );
};

const ConfirmModalTrigger = ({ id, children }: { id: string; children: ReactNode }) => {
    const { openModal } = useModal();
    const openConfirmModal = () => openModal(id, <ConfirmModal id={id}>{children}</ConfirmModal>);

    return (
        <button type="button" onClick={openConfirmModal}>확인모달 열기</button>
    );
};

const FormModalTrigger = ({
    id,
    title,
    children,
}: {
    id: string;
    title: string;
    children: ReactNode;
}) => {
    const { openModal } = useModal();
    const openFormModal = () => {
        openModal(
            id,
            <FormModal
                id={id}
                title={title}
                onSubmit={d => {
                    console.log(Array.from(d));
                }}
            >
                {children}
            </FormModal>,
        );
    };

    return (
        <button type="button" onClick={openFormModal}>폼모달 열기</button>
    );
};

const Modal1 = () => (
    <ModalContextProvider>
        <h2>모달</h2>
        <h3>#1. React<sub>context</sub></h3>
        <p>___place___holder___</p>
        <AlertModalTrigger id="1">1번 경고입니다. 아무튼 경고예요.</AlertModalTrigger>
        <p>___place___holder___</p>
        <AlertModalTrigger id="2">2번 경고입니다. 주의하세요!</AlertModalTrigger>
        <p>___place___holder___</p>
        <ConfirmModalTrigger id="3">
            <p>이건 이래서 저런 문제가 있는데, 정말 진행합니까?</p>
        </ConfirmModalTrigger>
        <p>___place___holder___</p>
        <ConfirmModalTrigger id="4">
            <p>이건 이래서 저런 문제가 있는데, 정말 진행합니까?</p>
            <p>중첩해서 모달을 띄워봅시다아</p>
            <p>중첩해서 모달을 띄워봅시다아</p>
            <p>중첩해서 모달을 띄워봅시다아</p>
            <ConfirmModalTrigger id="5">
                <p>이건 이런 문제가 있는데, 정말 진행합니까?</p>
                <p>중첩해서 모달을 띄워봅시다아</p>
                <p>중첩해서 모달을 띄워봅시다아</p>
                <ConfirmModalTrigger id="6">
                    <p>이건 문제가 있는데, 정말 진행합니까?</p>
                </ConfirmModalTrigger>
            </ConfirmModalTrigger>
        </ConfirmModalTrigger>
        <p>___place___holder___</p>
        <FormModalTrigger id="7" title="상품 등록">
            <input name="name" placeholder="상품명" />
            <input name="price" type="number" placeholder="가격" />
            <label><input name="soldOut" type="checkbox" /> 품절</label>
        </FormModalTrigger>
    </ModalContextProvider>
);

export default Modal1;
