import { useCallback, useEffect, useRef } from 'react';
import type { SyntheticEvent } from 'react';
import data from './data';
import useAutocomplete from './useAutocomplete';
import type {
    AutocompleteContainerProps,
    AutocompleteItemProps,
    AutocompleteTriggerProps,
} from './useAutocomplete';
import cx from '../cx';
import PopoverPortal, {
    type PopoverPortalContent,
} from '@/components/14_dropdown/4_r/popoverPortal';

type Country = { code: string; name: string };

export const ACContainer = ({
    children,
    containerRef,
    handleKeyDown,
}: AutocompleteContainerProps<Country>) => (
    <div
        className={cx('container')}
        onKeyDown={handleKeyDown}
        onClick={event => event.stopPropagation()}
        ref={containerRef}
    >
        {children}
    </div>
);

const ACForm = ({
    allItems,
    selectedItem,
    opened,
    focusIndex,
    selectItem,
    toggle,
    setItems,
}: AutocompleteTriggerProps<Country>) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleInput = useCallback((event: SyntheticEvent) => {
        const element = event.target as HTMLInputElement;
        const value = element.value.trim().toLowerCase();
        const result = allItems.filter(({ name }) => (
            value && name.toLowerCase().includes(value)
        ));

        focusIndex(0);
        selectItem(null);
        setItems(result);
        toggle(result.length > 0);
    }, [setItems, allItems, focusIndex, selectItem, toggle]);

    useEffect(() => {
        if (selectedItem && inputRef.current) {
            inputRef.current.value = selectedItem.name;
        }
    }, [selectedItem]);

    return (
        <div className={cx('form')}>
            <input
                type="text"
                name="country"
                placeholder="Search Country"
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={opened}
                onInput={handleInput}
                ref={inputRef}
            />
            <button
                type="button"
                className={cx('toggle-button', { open: opened })}
                aria-label={opened ? '목록 닫기' : '목록 열기'}
                onClick={() => toggle(previous => !previous)}
            />
        </div>
    );
};

export const positionStyle = { top: 45, bottom: 45, left: 0, right: 0 };

export const ACList: PopoverPortalContent = ({
    elRef,
    style,
    children,
}) => (
    <ul
        className={cx('list')}
        ref={elRef}
        style={style}
        role="listbox"
    >
        {children}
    </ul>
);

const ACItem = ({
    item,
    index,
    selectedItem,
    focusedIndex,
    handleClickItem,
    itemsRef,
}: AutocompleteItemProps<Country>) => (
    <li
        className={cx('item')}
        role="option"
        aria-selected={selectedItem === item}
        aria-current={focusedIndex === index}
        ref={element => {
            if (element) itemsRef.current[index] = element;
        }}
    >
        <button type="button" onClick={handleClickItem}>
            <span>{item.name}</span><br />
            <sub>{item.code}</sub>
        </button>
    </li>
);

const Autocomplete1 = () => {
    const {
        items,
        getContainerProps,
        getTriggerProps,
        getListProps,
        getItemProps,
    } = useAutocomplete<Country>(data);

    return (
        <article>
            <h3>#1. 정적인 자동완성</h3>
            <ACContainer {...getContainerProps()}>
                <ACForm {...getTriggerProps()} />
                <PopoverPortal
                    {...getListProps()}
                    positionStyle={positionStyle}
                    Content={ACList}
                >
                    {items.map((item, index) => (
                        <ACItem
                            key={item.code}
                            {...getItemProps(index)}
                        />
                    ))}
                </PopoverPortal>
            </ACContainer>
        </article>
    );
};

export default Autocomplete1;
