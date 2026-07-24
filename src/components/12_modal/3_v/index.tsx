import VanillaWrapper from '@/components/vanillaWrapper';
import { generateDOM, stringToDOM } from '@/service/util';
import cx from '../cx';
import { AlertModal, ConfirmModal, type ModalComponentProps } from './modalComponents';

const appendPlaceHolders = (template: HTMLTemplateElement) => {
    const placeHolders = Array.from({ length: 10 }, () =>
        stringToDOM('<p>___place___holder___</p>')
    );
    template.content.append(...placeHolders);
};

const AlertTrigger = ({ id, contentChildren }: ModalComponentProps) => {
    const $btn = stringToDOM('<button type="button">알럿 띄우기</button>');
    $btn.addEventListener('click', () => AlertModal({ id, contentChildren }));
    return $btn;
};

const ConfirmTrigger = ({ id, contentChildren }: ModalComponentProps) => {
    const $btn = document.createElement('button');
    const $title = generateDOM('div', cx('title'));
    const setConfirmed = (flag: boolean) => {
        $btn.textContent = `컨펌모달 열기 ${flag ? '확인됨' : '확인안됨'}`;
        $title.textContent = `${flag ? '확인된' : '확인안된'} 컨펌`;
    };
    const handleConfirm = () => setConfirmed(true);
    const handleCancel = () => setConfirmed(false);

    $btn.type = 'button';
    $btn.addEventListener('click', () => ConfirmModal({
        id,
        headerChildren: [$title],
        contentChildren,
        onConfirm: handleConfirm,
        onCancel: handleCancel,
    }));
    setConfirmed(false);
    return $btn;
};

const initiator = (wrapper: HTMLDivElement) => {
    const template = document.createElement('template');
    template.content.append(AlertTrigger({
        id: 'a1',
        contentChildren: [stringToDOM('<p>1번 경고입니다. 아무튼 경고예요.</p>')],
    }));
    appendPlaceHolders(template);

    const confirm3 = ConfirmTrigger({
        id: 'c3',
        contentChildren: [stringToDOM('<p>이건 이런 문제가 있는데, 정말 진행합니까?</p>')],
    });
    const confirm2 = ConfirmTrigger({
        id: 'c2',
        contentChildren: [
            stringToDOM('<p>이건 이래서 저런 문제가 있는데, 정말 진행합니까?</p>'),
            stringToDOM('<p>중첩해서 모달을 띄워봅시다아</p>'),
            stringToDOM('<p>중첩해서 모달을 띄워봅시다아</p>'),
            confirm3,
        ],
    });
    const confirm1 = ConfirmTrigger({
        id: 'c1',
        contentChildren: [
            stringToDOM('<p>이건 이래서 저런 문제가 있는데, 정말 진행합니까?</p>'),
            stringToDOM('<p>중첩해서 모달을 띄워봅시다아</p>'),
            stringToDOM('<p>중첩해서 모달을 띄워봅시다아</p>'),
            stringToDOM('<p>중첩해서 모달을 띄워봅시다아</p>'),
            confirm2,
        ],
    });

    template.content.append(confirm1);
    appendPlaceHolders(template);

    const $modalRoot = stringToDOM('<div id="modalRoot"></div>');
    const observer = new MutationObserver(() => {
        const size = $modalRoot.children.length;
        document.body.classList.toggle('no-scroll', size > 0);
    });
    observer.observe($modalRoot, { childList: true, subtree: false });

    wrapper.append(...template.content.children, $modalRoot);
};

const Modal3V = () => (
    <>
        <h2>모달</h2>
        <VanillaWrapper title="#3" initiator={initiator} />
    </>
);

export default Modal3V;
