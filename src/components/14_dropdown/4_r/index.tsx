import data from '../data';
import useDropdown from './useDropdown';
import type {
    DropdownContainerProps,
    DropdownItemProps,
    DropdownTriggerProps,
} from './useDropdown';
import PopoverPortal, {
    type PopoverPortalContent,
} from './popoverPortal';
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

const CustomDropdownList: PopoverPortalContent = ({
    elRef,
    style,
    children,
}) => (
    <ul
        className={cx('DropdownList')}
        ref={elRef}
        style={style}
        role="listbox"
    >
        {children}
    </ul>
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

const Dropdown4 = () => {
    const {
        items,
        getContainerProps,
        getTriggerProps,
        getListProps,
        getItemProps,
    } = useDropdown(data);

    return (
        <article>
            <h3>#4. popover with portal</h3>
            <CustomDropdownContainer {...getContainerProps()}>
                <CustomDropdownTrigger {...getTriggerProps()} />
                <PopoverPortal
                    {...getListProps()}
                    positionStyle={dropdownPosition}
                    Content={CustomDropdownList}
                >
                    {items.map((item, index) => (
                        <CustomDropdownItem
                            key={item.id}
                            {...getItemProps(index)}
                        />
                    ))}
                </PopoverPortal>
            </CustomDropdownContainer>
        </article>
    );
};

export default Dropdown4;
