import type {
    Dispatch,
    KeyboardEvent,
    ReactNode,
    RefObject,
    SetStateAction,
} from 'react';
import {
    useCallback,
    useEffect,
    useMemo,
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

export type DropdownContainerProps =
    Pick<DropdownProps<unknown>, 'containerRef'> &
    Pick<DropdownDispatchProps<unknown>, 'handleKeyDown'> & {
        children: ReactNode;
    };

export type DropdownTriggerProps<T> =
    Pick<DropdownProps<T>, 'opened' | 'selectedItem'> &
    Pick<DropdownDispatchProps<T>, 'toggle'>;

export type DropdownItemProps<T> = {
    item: T;
    index: number;
} & Pick<
    DropdownProps<T>,
    'focusedIndex' | 'selectedItem' | 'itemsRef'
> & {
    handleClickItem: () => void;
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

const useDropdown = <T,>(items: T[]) => {
    const [opened, toggle] = useState(false);
    const [selectedItem, selectItem] = useState<T | null>(null);
    const [focusedIndex, focusIndex] = useState(0);
    const itemsRef = useRef<HTMLLIElement[]>([]);
    const handleClose = useCallback(() => toggle(false), [toggle]);
    const containerRef = useClickOutside<HTMLDivElement>(handleClose);
    const KeyEventMap = useMemo(() => getKeyEventMap<T>(), []);
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
    }, [items, focusedIndex, KeyEventMap]);

    useEffect(() => {
        const targetElement = itemsRef.current[focusedIndex];
        if (targetElement) {
            targetElement.scrollIntoView({ block: 'nearest' });
        }
    }, [focusedIndex]);

    const getContainerProps = useCallback(() => ({
        containerRef,
        handleKeyDown,
    }), [containerRef, handleKeyDown]);

    const getTriggerProps = useCallback(() => ({
        opened,
        selectedItem,
        toggle,
    }), [opened, selectedItem, toggle]);

    const getItemProps = useCallback((index: number) => {
        const item = items[index];

        return {
            index,
            item,
            selectedItem,
            focusedIndex,
            itemsRef,
            handleClickItem: () => {
                if (item) selectItem(item);
                toggle(false);
            },
        };
    }, [items, focusedIndex, selectedItem, toggle]);

    return {
        items,
        opened,
        getContainerProps,
        getTriggerProps,
        getItemProps,
    };
};

export default useDropdown;
