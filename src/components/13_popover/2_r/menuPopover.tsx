import useStyleInsideViewport from '@/hooks/useStyleInsideViewport';
import cx from '../cx';
import { type RefObject, useRef } from 'react';
import { createPortal } from 'react-dom';

const MenuPositionStyle = { top: 0, bottom: 0, left: 45, right: 45 };

const MenuPopover = ({
    id,
    close,
    rootRef,
}: {
    id: string;
    close: () => void;
    rootRef: RefObject<HTMLElement | null>;
}) => {
    const targetRef = useRef<HTMLUListElement>(null);
    const style = useStyleInsideViewport(
        rootRef,
        targetRef,
        MenuPositionStyle,
        'absolute',
    );

    return createPortal(
        <div className={cx('MenuPopover')} onClick={close}>
            <ul
                className={cx('context-menu')}
                ref={targetRef}
                style={style}
                onClick={event => event.stopPropagation()}
            >
                <li><button type="button">#{id}</button></li>
                <li><button type="button">스레드의 댓글</button></li>
                <li><button type="button">메시지 전달</button></li>
                <li><button type="button">나중을 위해 저장</button></li>
                <li><button type="button">읽지 않음으로 표시</button></li>
                <li><button type="button">삭제</button></li>
            </ul>
        </div>,
        document.querySelector('#popoverRoot')!,
    );
};

export default MenuPopover;
