import type {
    Dispatch,
    KeyboardEvent,
    ReactNode,
    RefObject,
    SetStateAction,
} from 'react';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import useClickOutside from '@/hooks/useClickOutside';
import cx from '../cx';

export type DropdownItem = { id: string; text: string };

type DropdownProps = {
    items: DropdownItem[];
    opened: boolean;
    selectedItem: DropdownItem | null;
    focusedIndex: number;
    itemsRef: RefObject<HTMLLIElement[]>;
};

type DropdownDispatchProps = {
    selectItem: (item: DropdownItem) => void;
    toggle: Dispatch<SetStateAction<boolean>>;
    focusIndex: Dispatch<SetStateAction<number>>;
};

type KeyEventHandler = (
    event: KeyboardEvent,
    props: Pick<DropdownProps, 'items' | 'focusedIndex'> &
        Pick<DropdownDispatchProps, 'focusIndex' | 'selectItem' | 'toggle'>,
) => void;

const KeyEventMap: Partial<
    Record<KeyboardEvent<Element>['key'], KeyEventHandler>
> = {
    ArrowUp: (event, { items, focusIndex, toggle }) => {
        event.preventDefault();
        if (!items.length) return;
        toggle(true);
        focusIndex(previous => (
            (items.length + previous - 1) % items.length
        ));
    },
    ArrowDown: (event, { items, focusIndex, toggle }) => {
        event.preventDefault();
        if (!items.length) return;
        toggle(true);
        focusIndex(previous => (
            (items.length + previous + 1) % items.length
        ));
    },
    Enter: (event, {
        items,
        focusedIndex,
        selectItem,
        toggle,
    }) => {
        event.preventDefault();
        const item = items[focusedIndex];
        if (item) selectItem(item);
        toggle(previous => !previous);
    },
    Escape: (_event, { toggle }) => {
        toggle(false);
    },
};

const DropdownContext = createContext<DropdownProps>({
    items: [],
    opened: false,
    selectedItem: null,
    focusedIndex: 0,
    itemsRef: { current: [] },
});

const DropdownDispatchContext = createContext<DropdownDispatchProps>({
    selectItem: () => {},
    toggle: () => {},
    focusIndex: () => {},
});

const useDropdown = () => useContext(DropdownContext);
const useDropdownDispatch = () => useContext(DropdownDispatchContext);

const Dropdown = ({
    items,
    children,
}: {
    items: DropdownItem[];
    children: ReactNode;
}) => {
    const [opened, toggle] = useState(false);
    const [selectedItem, selectItem] = useState<DropdownItem | null>(null);
    const [focusedIndex, focusIndex] = useState(0);
    const itemsRef = useRef<HTMLLIElement[]>([]);
    const handleClose = useCallback(() => toggle(false), [toggle]);
    const ref = useClickOutside<HTMLDivElement>(handleClose);
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        const handler = KeyEventMap[event.key];
        if (handler) {
            handler(event, {
                items,
                selectItem,
                focusedIndex,
                focusIndex,
                toggle,
            });
        }
    }, [items, focusedIndex]);

    useEffect(() => {
        const targetElement = itemsRef.current[focusedIndex];
        if (targetElement) {
            targetElement.scrollIntoView({ block: 'nearest' });
        }
    }, [focusedIndex]);

    return (
        <DropdownContext value={{
            items,
            opened,
            selectedItem,
            focusedIndex,
            itemsRef,
        }}>
            <DropdownDispatchContext value={{
                toggle,
                selectItem,
                focusIndex,
            }}>
                <div
                    className={cx('Dropdown')}
                    ref={ref}
                    onKeyDown={handleKeyDown}
                >
                    {children}
                </div>
            </DropdownDispatchContext>
        </DropdownContext>
    );
};

const DropdownTrigger = () => {
    const { selectedItem, opened } = useDropdown();
    const { toggle } = useDropdownDispatch();

    return (
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
};

const DropdownItemComponent = ({
    item,
    index,
}: {
    item: DropdownItem;
    index: number;
}) => {
    const { selectedItem, focusedIndex, itemsRef } = useDropdown();
    const { selectItem, toggle } = useDropdownDispatch();
    const handleClickItem = () => {
        selectItem(item);
        toggle(false);
    };

    return (
        <li
            className={cx('item')}
            role="option"
            aria-selected={selectedItem === item}
            aria-current={focusedIndex === index}
            aria-posinset={index + 1}
            ref={element => {
                if (element) itemsRef.current[index] = element;
            }}
        >
            <button type="button" onClick={handleClickItem}>
                <span>{item.text}</span>
            </button>
        </li>
    );
};

const DropdownList = () => {
    const { items, opened } = useDropdown();

    if (!opened) return null;

    return (
        <ul className={cx('DropdownList')} role="listbox">
            {items.map((item, index) => (
                <DropdownItemComponent
                    item={item}
                    index={index}
                    key={item.id}
                />
            ))}
        </ul>
    );
};

Dropdown.Trigger = DropdownTrigger;
Dropdown.List = DropdownList;

export default Dropdown;
