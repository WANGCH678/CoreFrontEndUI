import cx from '../cx';
import { useRef, useState } from 'react';
import MenuDialog from './menuDialog';
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
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [menuOpened, toggleMenu] = useState(false);

    const showMenu = () => {
        if (dialogRef.current) {
            toggleMenu(true);
            const { scrollX, scrollY } = window;
            dialogRef.current.showModal();
            window.scrollTo(scrollX, scrollY);
        }
    };
    const handleClose = () => toggleMenu(false);

    return (
        <li id={id} className={cx('list-item')}>
            #{index + 1}. {title}
            <div className={cx('popover-parent')}>
                <button
                    type="button"
                    ref={buttonRef}
                    className={cx('popover-button', { opened: menuOpened })}
                    onClick={showMenu}
                    aria-label={`${index + 1}번 항목 메뉴 열기`}
                    aria-expanded={menuOpened}
                />
                <MenuDialog
                    id={`${index + 1}`}
                    rootRef={buttonRef}
                    dialogRef={dialogRef}
                    handleClose={handleClose}
                    opened={menuOpened}
                />
            </div>
        </li>
    );
};

const Popover3 = () => {
    const { data, isLoading, moreRef } = useScrollFetch();

    return (
        <>
            <div className={cx('Popovers')}>
                <h2>팝오버</h2>
                <h3>#3. React<sub>HTML Dialog</sub></h3>
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

export default Popover3;
