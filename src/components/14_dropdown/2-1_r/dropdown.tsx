import type {
    Dispatch,
    FunctionComponent,
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

type DropdownProps<T> = {
    items: T[];
    opened: boolean;
    selectedItem: T | null;
    focusedIndex: number;
    itemsRef: RefObject<HTMLLIElement[]>;
    containerRef: RefObject<HTMLDivElement | null>;
};

type DropdownDispatchProps<T> = {
    selectItem: Dispatch<SetStateAction<T | null>>;
    toggle: Dispatch<SetStateAction<boolean>>;
    focusIndex: Dispatch<SetStateAction<number>>;
    handleKeyDown: (event: KeyboardEvent) => void;
};

export type DropdownContainerProps<T> =
    Pick<DropdownProps<T>, 'containerRef'> &
    Pick<DropdownDispatchProps<T>, 'handleKeyDown'> & {
        children: ReactNode;
    };

export type DropdownTriggerProps<T> =
    Pick<DropdownProps<T>, 'opened' | 'selectedItem'> &
    Pick<DropdownDispatchProps<T>, 'toggle'>;

export type DropdownListProps<T> = Pick<DropdownProps<T>, 'items'>;

export type DropdownItemProps<T> = {
    item: T;
    index: number;
} & Pick<
    DropdownProps<T>,
    'focusedIndex' | 'selectedItem' | 'itemsRef'
> & {
    handleClickItem: () => void;
};

type Headless<T> = {
    render: FunctionComponent<T>;
    children?: ReactNode;
};

type KeyEventHandler<T> = (
    event: KeyboardEvent,
    props: Pick<DropdownProps<T>, 'items' | 'focusedIndex'> &
        Pick<
            DropdownDispatchProps<T>,
            'focusIndex' | 'selectItem' | 'toggle'
        >,
) => void;

const getKeyEventMap = <T,>(): Partial<
    Record<KeyboardEvent<Element>['key'], KeyEventHandler<T>>
> => ({
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
});

const createDropdown = <T,>() => {
    const DropdownContext = createContext<DropdownProps<T>>({
        items: [],
        opened: false,
        selectedItem: null,
        focusedIndex: 0,
        itemsRef: { current: [] },
        containerRef: { current: null },
    });
    const DropdownDispatchContext = createContext<DropdownDispatchProps<T>>({
        selectItem: () => {},
        toggle: () => {},
        focusIndex: () => {},
        handleKeyDown: () => {},
    });
    const useDropdown = () => useContext(DropdownContext);
    const useDropdownDispatch = () => useContext(DropdownDispatchContext);
    const KeyEventMap = getKeyEventMap<T>();

    const Dropdown = ({
        items,
        children,
    }: {
        items: T[];
        children: ReactNode;
    }) => {
        const [opened, toggle] = useState(false);
        const [selectedItem, selectItem] = useState<T | null>(null);
        const [focusedIndex, focusIndex] = useState(0);
        const itemsRef = useRef<HTMLLIElement[]>([]);
        const handleClose = useCallback(() => toggle(false), [toggle]);
        const containerRef = useClickOutside<HTMLDivElement>(handleClose);
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
                containerRef,
            }}>
                <DropdownDispatchContext value={{
                    toggle,
                    selectItem,
                    focusIndex,
                    handleKeyDown,
                }}>
                    {children}
                </DropdownDispatchContext>
            </DropdownContext>
        );
    };

    const DropdownContainer = ({
        render,
        children,
    }: Headless<DropdownContainerProps<T>>) => {
        const { containerRef } = useDropdown();
        const { handleKeyDown } = useDropdownDispatch();

        return render({ containerRef, handleKeyDown, children });
    };

    const DropdownTrigger = ({
        render,
    }: Headless<DropdownTriggerProps<T>>) => {
        const { opened, selectedItem } = useDropdown();
        const { toggle } = useDropdownDispatch();

        return render({ opened, selectedItem, toggle });
    };

    const DropdownItem = ({
        render,
        item,
        index,
    }: Headless<DropdownItemProps<T>> &
        Pick<DropdownItemProps<T>, 'item' | 'index'>) => {
        const { selectedItem, focusedIndex, itemsRef } = useDropdown();
        const { selectItem, toggle } = useDropdownDispatch();
        const handleClickItem = () => {
            selectItem(item);
            toggle(false);
        };

        return render({
            item,
            index,
            selectedItem,
            focusedIndex,
            itemsRef,
            handleClickItem,
        });
    };

    const DropdownList = ({
        render,
    }: Headless<DropdownListProps<T>>) => {
        const { items, opened } = useDropdown();
        if (!opened) return null;

        return render({ items });
    };

    Dropdown.Container = DropdownContainer;
    Dropdown.Trigger = DropdownTrigger;
    Dropdown.List = DropdownList;
    Dropdown.Item = DropdownItem;

    return Dropdown;
};

export default createDropdown;
