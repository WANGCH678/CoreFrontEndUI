import PopoverDialog from '@/components/13_popover/3_r/popoverDialog';
import data from '../data';
import useDropdown from './useDropdown';
import type {
    DropdownContainerProps,
    DropdownItemProps,
    DropdownListProps,
    DropdownTriggerProps,
} from './useDropdown';
import cx from '../cx';

type Datum = { id: string; text: string };
const dropdownPosition = { top: 50, bottom: 50, left: 0, right: 0 };

const CustomDropdownContainer = ({
    handleKeyDown,
    containerRef,
    children,
}: DropdownContainerProps) => (
    <div
        className={cx('Dropdown')}
        onKeyDown={handleKeyDown}
        ref={containerRef}
    >
        {children}
    </div>
);

const CustomDropdownTrigger = ({
    opened,
    selectedItem,
    toggle,
}: DropdownTriggerProps<Datum>) => (
    <button
        type="button"
        className={cx('button-toggle', { opened })}
        aria-haspopup="listbox"
        aria-expanded={opened}
        onClick={() => toggle(previous => !previous)}
    >
        <span className={cx('text')}>
            {selectedItem?.text || '항목을 선택하세요'}
        </span>
    </button>
);

export const CustomDropdownList = ({
    opened,
    containerRef,
    dialogRef,
    handleClose,
    children,
}: DropdownListProps<Datum>) => (
    <PopoverDialog
        className={cx('DropdownList', 'DropdownPopover')}
        rootRef={containerRef}
        dialogRef={dialogRef}
        opened={opened}
        positionStyle={dropdownPosition}
        handleClose={handleClose}
    >
        <ul role="listbox" onClick={event => event.stopPropagation()}>
            {children}
        </ul>
    </PopoverDialog>
);

const CustomDropdownItem = ({
    item,
    index,
    selectedItem,
    focusedIndex,
    handleClickItem,
    itemsRef,
}: DropdownItemProps<Datum>) => (
    <li
        className={cx('item')}
        role="option"
        ref={element => {
            if (element) itemsRef.current[index] = element;
        }}
        aria-selected={item === selectedItem}
        aria-current={focusedIndex === index}
    >
        <button type="button" onClick={handleClickItem}>
            <span>{item.text}</span>
        </button>
    </li>
);

const Dropdown3 = () => {
    const {
        items,
        getContainerProps,
        getTriggerProps,
        getListProps,
        getItemProps,
    } = useDropdown(data);

    return (
        <article>
            <h3>#3. Headless Component - popover</h3>
            <CustomDropdownContainer {...getContainerProps()}>
                <CustomDropdownTrigger {...getTriggerProps()} />
                <CustomDropdownList {...getListProps()}>
                    {items.map((item, index) => (
                        <CustomDropdownItem
                            key={item.id}
                            {...getItemProps(index)}
                        />
                    ))}
                </CustomDropdownList>
            </CustomDropdownContainer>
        </article>
    );
};

export default Dropdown3;
