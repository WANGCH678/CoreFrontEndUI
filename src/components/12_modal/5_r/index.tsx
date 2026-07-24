import { useState } from 'react';
import { AlertModal, ConfirmModal, FormModal } from './modalComponents';
import { useModal } from './useModal';

const PlaceHolder = () => <p>___place___holder___</p>;

const Modal5 = () => {
    const { Component: Alert, show: showAlertModal } = useModal(AlertModal);
    const { Component: Confirm1, show: showConfirmModal1 } = useModal(ConfirmModal);
    const { Component: Confirm2, show: showConfirmModal2 } = useModal(ConfirmModal);
    const { Component: Confirm3, show: showConfirmModal3 } = useModal(ConfirmModal);
    const { Component: Form1, show: showFormModal1 } = useModal(FormModal);
    const { Component: Form2, show: showFormModal2 } = useModal(FormModal);

    const [confirmed1, setConfirmed1] = useState<boolean | null>(null);
    const [confirmed2, setConfirmed2] = useState<boolean | null>(null);
    const [confirmed3, setConfirmed3] = useState<boolean | null>(null);

    return (
        <>
            <h2>모달</h2>
            <h3>#5. React<sub>html dialog (2)</sub></h3>
            <Alert>경고입니다. 아무튼 경고예요.</Alert>
            <Confirm1
                confirmed={confirmed1}
                onConfirm={() => setConfirmed1(true)}
                onCancel={() => setConfirmed1(false)}
            >
                <p>이건 이래서 저런 문제가 있는데, 정말 진행합니까?</p>
                <p>중첩해서 모달을 띄워봅시다아</p>
                <p>중첩해서 모달을 띄워봅시다아</p>
                <p>중첩해서 모달을 띄워봅시다아</p>
                <button type="button" onClick={() => showConfirmModal2()}>
                    확인모달열기 {confirmed2 ? '확인됨2' : '확인안됨2'}
                </button>
            </Confirm1>
            <Confirm2
                confirmed={confirmed2}
                onConfirm={() => setConfirmed2(true)}
                onCancel={() => setConfirmed2(false)}
            >
                <p>이건 이런 문제가 있는데, 정말 진행합니까?</p>
                <p>중첩해서 모달을 띄워봅시다아</p>
                <p>중첩해서 모달을 띄워봅시다아</p>
                <button type="button" onClick={() => showConfirmModal3()}>
                    확인모달열기 {confirmed3 ? '확인됨3' : '확인안됨3'}
                </button>
            </Confirm2>
            <Confirm3
                confirmed={confirmed3}
                onConfirm={() => setConfirmed3(true)}
                onCancel={() => setConfirmed3(false)}
            >
                <p>이건 문제가 있는데, 정말 진행합니까?</p>
            </Confirm3>
            <Form1 id="productForm" title="상품 등록" onSubmit={d => { console.log(Array.from(d)); }}>
                <input name="name" placeholder="상품명" />
                <input name="price" type="number" placeholder="가격" />
                <label><input name="soldOut" type="checkbox" /> 품절</label>
            </Form1>
            <Form2 id="personalForm" title="개인정보 등록" onSubmit={d => { console.log(Array.from(d)); }}>
                <input name="name" placeholder="이름" />
                <input name="birth" type="number" placeholder="생년월일" />
            </Form2>
            <PlaceHolder />
            <PlaceHolder />
            <PlaceHolder />
            <PlaceHolder />
            <button
                type="button"
                onClick={() => showAlertModal({ children: '첫번째 열렸습니다. 경고예요.' })}
            >알럿 띄우기 #1</button>
            <PlaceHolder />
            <button
                type="button"
                onClick={() => showAlertModal({ children: '두번째 열렸습니다. 아무튼 경고예요.' })}
            >알럿 띄우기 #2</button>
            <PlaceHolder />
            <button type="button" onClick={() => showConfirmModal1()}>
                확인모달열기 {confirmed1 ? '확인됨1' : '확인안됨1'}
            </button>
            <PlaceHolder />
            <button type="button" onClick={() => showFormModal1()}>상품등록폼 열기</button>
            <PlaceHolder />
            <button type="button" onClick={() => showFormModal2()}>개인정보입력폼 열기</button>
        </>
    );
};

export default Modal5;
