import cx from '../cx';
import Popover, { type PopoverProps } from './popover';

const MenuPositionStyle = { top: 0, bottom: 0, left: 45, right: 45 };

const MenuPopoverHtml = (
    popoverProps: Omit<PopoverProps, 'children'>,
) => (
    <Popover
        className={cx('MenuPopoverHtml')}
        positionStyle={MenuPositionStyle}
        {...popoverProps}
    >
        <ul
            className={cx('context-menu')}
            onClick={event => event.stopPropagation()}
        >
            <li><button type="button">#{popoverProps.id}</button></li>
            <li><button type="button">스레드의 댓글</button></li>
            <li><button type="button">메시지 전달</button></li>
            <li><button type="button">나중을 위해 저장</button></li>
            <li><button type="button">읽지 않음으로 표시</button></li>
            <li><button type="button">삭제</button></li>
        </ul>
    </Popover>
);

export default MenuPopoverHtml;
