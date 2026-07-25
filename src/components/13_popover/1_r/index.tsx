import cx from '../cx';
import { useRef, useState } from 'react';
import MenuPopover from './menuPopover';
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
    const handleClickButton = () => toggleMenu(true);

    return (
        <li id={id} className={cx('list-item')}>
            #{index + 1}. {title}
            <div className={cx('popover-parent')}>
                <button
                    type="button"
                    ref={buttonRef}
                    onClick={handleClickButton}
                    className={cx('popover-button', { opened: menuOpened })}
                    aria-label={`${index + 1}번 항목 메뉴 열기`}
                    aria-expanded={menuOpened}
                />
                {menuOpened && (
                    <MenuPopover
                        id={`${index + 1}`}
                        rootRef={buttonRef}
                        close={() => toggleMenu(false)}
                    />
                )}
            </div>
        </li>
    );
};

const Popover1 = () => {
    const { data, isLoading, moreRef } = useScrollFetch();

    return (
        <>
            <div className={cx('Popovers')}>
                <h2>팝오버</h2>
                <h3>#1. React<sub>콘텐츠 내부에서 그대로 렌더링</sub></h3>
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
        </>
    );
};

export default Popover1;
