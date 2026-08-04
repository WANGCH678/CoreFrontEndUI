import useAutocomplete from '../1_r/useAutocomplete';
import type {
    AutocompleteItemProps,
    AutocompleteTriggerProps,
} from '../1_r/useAutocomplete';
import { ACContainer, ACList, positionStyle } from '../1_r';
import {
    useCallback,
    useDeferredValue,
    useEffect,
    useState,
} from 'react';
import type { SyntheticEvent } from 'react';
import { type Album, useFetch } from './fakeApi';
import PopoverPortal from '@/components/14_dropdown/4_r/popoverPortal';
import cx from '../cx';

const ACForm = ({
    selectedItem,
    opened,
    focusIndex,
    selectItem,
    toggle,
    setItems,
}: AutocompleteTriggerProps<Album>) => {
    const [query, setQuery] = useState('');
    const deferredQuery = useDeferredValue(query);
    const { data, state } = useFetch<Album[]>(
        `/search?q=${deferredQuery}`,
        !!deferredQuery,
    );
    const handleInput = useCallback((event: SyntheticEvent) => {
        const element = event.target as HTMLInputElement;
        const value = element.value.trim().toLowerCase();

        focusIndex(0);
        selectItem(null);
        setQuery(value);
    }, [focusIndex, selectItem]);

    useEffect(() => {
        if (selectedItem) setQuery(selectedItem.title);
    }, [selectedItem]);

    useEffect(() => {
        setItems(data || []);
        toggle(!!data?.length);
    }, [data, toggle, setItems]);

    return (
        <div className={cx('form')}>
            <input
                type="text"
                name="album"
                placeholder="Search Album"
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={opened}
                onChange={handleInput}
                value={query}
            />
            <button
                type="button"
                className={cx('toggle-button', { open: opened })}
                aria-label={opened ? '목록 닫기' : '목록 열기'}
                onClick={() => toggle(previous => !previous)}
            />
            <span>{state}</span>
        </div>
    );
};

const ACItem = ({
    item,
    index,
    selectedItem,
    focusedIndex,
    handleClickItem,
    itemsRef,
}: AutocompleteItemProps<Album>) => (
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
            {item.title} <sub>{item.year}</sub>
        </button>
    </li>
);

const Autocomplete2 = () => {
    const {
        items,
        getContainerProps,
        getTriggerProps,
        getListProps,
        getItemProps,
    } = useAutocomplete<Album>([]);

    return (
        <article>
            <h3>#2. 비동기 자동완성</h3>
            <ACContainer {...getContainerProps()}>
                <ACForm {...getTriggerProps()} />
                <PopoverPortal
                    {...getListProps()}
                    positionStyle={positionStyle}
                    Content={ACList}
                >
                    {items.map((item, index) => (
                        <ACItem
                            key={item.id}
                            {...getItemProps(index)}
                        />
                    ))}
                </PopoverPortal>
            </ACContainer>
        </article>
    );
};

export default Autocomplete2;
