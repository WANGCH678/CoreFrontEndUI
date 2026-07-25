import cx from '../cx';
import { useRef, useState } from 'react';
import MenuPopoverHtml from './menuPopoverHtml';
import useScrollFetch from '@/components/08_pagination/2_infiniteScroll/useScrollFetch';

const ListItem = ({
    id,
    title,
    index,
}: {
    id: string;
    title: string;
    index: number;
}) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [menuOpened, toggleMenu] = useState(false);
    const menuPopoverId = `menuPopover_${index + 1}`;

    return (
        <li id={id} className={cx('list-item')}>
            #{index + 1}. {title}
            <div className={cx('popover-parent')}>
                <button
                    type="button"
                    className={cx('popover-button', { opened: menuOpened })}
                    ref={buttonRef}
                    popoverTarget={menuPopoverId}
                    aria-label={`${index + 1}번 항목 메뉴 열기`}
                    aria-expanded={menuOpened}
                />
                <MenuPopoverHtml
                    id={menuPopoverId}
                    setOpened={toggleMenu}
                    rootRef={buttonRef}
                    opened={menuOpened}
                />
            </div>
        </li>
    );
};

const Popover4 = () => {
    const { data, isLoading, moreRef } = useScrollFetch();

    return (
        <div className={cx('Popovers')}>
            <h2>팝오버</h2>
            <h3>#4. React<sub>HTML Popover API</sub></h3>
            <ul className={cx('list')}>
                {data.map((page, i) => page.map((item, j) => (
                    <ListItem
                        key={`${i}_${item.id}`}
                        {...item}
                        index={(data[0]?.length ?? 0) * i + j}
                    />
                )))}
            </ul>
            <div ref={moreRef} />
            {isLoading && <div>Loading...</div>}
        </div>
    );
};

export default Popover4;
