import data from '../data';
import createDropdown from './dropdown';
import type {
    DropdownContainerProps,
    DropdownItemProps,
    DropdownListProps,
    DropdownTriggerProps,
} from './dropdown';
import cx from '../cx';

type Datum = { id: string; text: string };
const CustomDropdown = createDropdown<Datum>();

const CustomDropdownContainer = ({
    handleKeyDown,
    containerRef,
    children,
}: DropdownContainerProps<Datum>) => (
    <div
        className={cx('Dropdown')}
        onKeyDown={handleKeyDown}
        onClick={event => event.stopPropagation()}
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

const CustomDropdownList = ({ items }: DropdownListProps<Datum>) => (
    <ul className={cx('DropdownList')} role="listbox">
        {items.map((item, index) => (
            <CustomDropdown.Item
                item={item}
                index={index}
                key={item.id}
                render={CustomDropdownItem}
            />
        ))}
    </ul>
);

const Dropdown2_1 = () => (
    <article>
        <h3>#2-1. Headless Component (1) render pattern</h3>
        <CustomDropdown items={data}>
            <CustomDropdown.Container render={CustomDropdownContainer}>
                <CustomDropdown.Trigger render={CustomDropdownTrigger} />
                <CustomDropdown.List render={CustomDropdownList} />
            </CustomDropdown.Container>
        </CustomDropdown>
    </article>
);

export default Dropdown2_1;
