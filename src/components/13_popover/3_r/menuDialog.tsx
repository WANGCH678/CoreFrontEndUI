import cx from '../cx';
import PopoverDialog, { type PopoverDialogProps } from './popoverDialog';

const MenuPositionStyle = { top: 0, bottom: 0, left: 45, right: 45 };

const MenuDialog = ({
    id,
    ...popoverProps
}: Omit<PopoverDialogProps, 'children'> & { id: string }) => (
    <PopoverDialog
        className={cx('MenuDialog')}
        positionStyle={MenuPositionStyle}
        {...popoverProps}
    >
        <ul
            className={cx('context-menu')}
            onClick={event => event.stopPropagation()}
        >
            <li><button type="button">#{id}</button></li>
            <li><button type="button">스레드의 댓글</button></li>
            <li><button type="button">메시지 전달</button></li>
            <li><button type="button">나중을 위해 저장</button></li>
            <li><button type="button">읽지 않음으로 표시</button></li>
            <li><button type="button">삭제</button></li>
        </ul>
    </PopoverDialog>
);

export default MenuDialog;
