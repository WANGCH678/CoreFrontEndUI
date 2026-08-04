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

export type AutocompleteProps<T> = {
    items: T[];
    opened: boolean;
    selectedItem: T | null;
    focusedIndex: number;
    itemsRef: RefObject<HTMLLIElement[]>;
    containerRef: RefObject<HTMLDivElement | null>;
};

export type AutocompleteDispatchProps<T> = {
    selectItem: Dispatch<SetStateAction<T | null>>;
    toggle: Dispatch<SetStateAction<boolean>>;
    focusIndex: Dispatch<SetStateAction<number>>;
    setItems: Dispatch<SetStateAction<T[]>>;
    handleKeyDown: (event: KeyboardEvent) => void;
};

export type AutocompleteContainerProps<T> =
    Pick<AutocompleteProps<T>, 'containerRef'> &
    Pick<AutocompleteDispatchProps<T>, 'handleKeyDown'> & {
        children: ReactNode;
    };

export type AutocompleteTriggerProps<T> =
    Pick<AutocompleteProps<T>, 'opened' | 'selectedItem'> &
    Pick<
        AutocompleteDispatchProps<T>,
        'toggle' | 'focusIndex' | 'selectItem' | 'setItems'
    > & {
        allItems: T[];
    };

export type AutocompleteItemProps<T> = {
    item: T;
    index: number;
} & Pick<
    AutocompleteProps<T>,
    'focusedIndex' | 'selectedItem' | 'itemsRef'
> & {
    handleClickItem: () => void;
};

type KeyEventHandler<T> = (
    event: KeyboardEvent,
    props: Pick<AutocompleteProps<T>, 'items' | 'focusedIndex'> &
        Pick<
            AutocompleteDispatchProps<T>,
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
        toggle(false);
    },
    Escape: (_event, { toggle }) => toggle(false),
});

const useAutocomplete = <T,>(allItems: T[]) => {
    const [opened, toggle] = useState(false);
    const [selectedItem, selectItem] = useState<T | null>(null);
    const [focusedIndex, focusIndex] = useState(0);
    const [items, setItems] = useState<T[]>([]);
    const itemsRef = useRef<HTMLLIElement[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const handleClose = useCallback(() => toggle(false), [toggle]);
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
        allItems,
        focusIndex,
        selectItem,
        setItems,
    }), [allItems, opened, selectedItem]);

    const getListProps = useCallback(() => ({
        opened,
        containerRef,
        handleClose,
    }), [opened, containerRef, handleClose]);

    const getItemProps = useCallback((index: number) => {
        const item = items[index];

        return {
            item,
            index,
            selectedItem,
            focusedIndex,
            itemsRef,
            handleClickItem: () => {
                if (item) selectItem(item);
                toggle(false);
            },
        };
    }, [items, selectedItem, focusedIndex]);

    return {
        items,
        getContainerProps,
        getTriggerProps,
        getListProps,
        getItemProps,
    };
};

export default useAutocomplete;
