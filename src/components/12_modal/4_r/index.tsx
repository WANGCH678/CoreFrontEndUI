import { type ReactNode, useState } from 'react';
import { AlertModal, ConfirmModal, FormModal } from './modalComponents';
import { useModal, withModal } from './modalContext';

const AlertModalTrigger = withModal(({ children }: { children: ReactNode }) => {
    const { openModal } = useModal();

    return (
        <>
            <button type="button" onClick={openModal}>알럿 띄우기</button>
            <AlertModal>{children}</AlertModal>
        </>
    );
});

const ConfirmModalTrigger = withModal(({ children }: { children: ReactNode }) => {
    const { openModal } = useModal();
    const [confirmed, setConfirmed] = useState<boolean | null>(null);

    return (
        <>
            <button type="button" onClick={openModal}>
                확인모달열기 {confirmed ? '확인됨' : '확인안됨'}
            </button>
            <ConfirmModal
                confirmed={confirmed}
                onConfirm={() => setConfirmed(true)}
                onCancel={() => setConfirmed(false)}
            >
                {children}
            </ConfirmModal>
        </>
    );
});

const FormModalTrigger = withModal(({
    id,
    children,
}: {
    id: string;
    children: ReactNode;
}) => {
    const { openModal, closeModal } = useModal();

    return (
        <>
            <button type="button" onClick={openModal}>폼모달 열기</button>
            <FormModal
                id={id}
                title="상품 등록"
                onSubmit={d => {
                    console.log(Array.from(d));
                    closeModal();
                }}
            >
                {children}
            </FormModal>
        </>
    );
});

const Modal4 = () => (
    <>
        <h2>모달</h2>
        <h3>#4. React<sub>HTML dialog</sub></h3>
        <p>___place___holder___</p>
        <AlertModalTrigger>1번 경고입니다. 아무튼 경고예요.</AlertModalTrigger>
        <p>___place___holder___</p>
        <AlertModalTrigger>2번 경고입니다. 주의하세요!</AlertModalTrigger>
        <p>___place___holder___</p>
        <ConfirmModalTrigger>
            <p>이건 이래서 저런 문제가 있는데, 정말 진행합니까?</p>
        </ConfirmModalTrigger>
        <p>___place___holder___</p>
        <ConfirmModalTrigger>
            <p>이건 이래서 저런 문제가 있는데, 정말 진행합니까?</p>
            <p>중첩해서 모달을 띄워봅시다아</p>
            <p>중첩해서 모달을 띄워봅시다아</p>
            <p>중첩해서 모달을 띄워봅시다아</p>
            <ConfirmModalTrigger>
                <p>이건 이런 문제가 있는데, 정말 진행합니까?</p>
                <p>중첩해서 모달을 띄워봅시다아</p>
                <p>중첩해서 모달을 띄워봅시다아</p>
                <ConfirmModalTrigger>
                    <p>이건 문제가 있는데, 정말 진행합니까?</p>
                </ConfirmModalTrigger>
            </ConfirmModalTrigger>
        </ConfirmModalTrigger>
        <p>___place___holder___</p>
        <FormModalTrigger id="7">
            <input name="name" placeholder="상품명" />
            <input name="price" type="number" placeholder="가격" />
            <label><input name="soldOut" type="checkbox" /> 품절</label>
        </FormModalTrigger>
    </>
);

export default Modal4;
