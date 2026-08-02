import type { ReactNode } from 'react';
import data from '../data';
import useDropdown from './useDropdown';
import type {
    DropdownContainerProps,
    DropdownItemProps,
    DropdownTriggerProps,
} from './useDropdown';
import cx from '../cx';

type Datum = { id: string; text: string };

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

const CustomDropdownList = ({ children }: { children: ReactNode }) => (
    <ul className={cx('DropdownList')} role="listbox">{children}</ul>
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

const Dropdown2_2 = () => {
    const {
        items,
        opened,
        getContainerProps,
        getTriggerProps,
        getItemProps,
    } = useDropdown(data);

    return (
        <article>
            <h3>#2-2. Headless Component (2) hook pattern</h3>
            <CustomDropdownContainer {...getContainerProps()}>
                <CustomDropdownTrigger {...getTriggerProps()} />
                {opened && (
                    <CustomDropdownList>
                        {items.map((item, index) => (
                            <CustomDropdownItem
                                key={item.id}
                                {...getItemProps(index)}
                            />
                        ))}
                    </CustomDropdownList>
                )}
            </CustomDropdownContainer>
        </article>
    );
};

export default Dropdown2_2;
