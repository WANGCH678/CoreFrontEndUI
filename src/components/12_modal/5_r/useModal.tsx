import type { ComponentType, RefObject, SyntheticEvent } from 'react';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

const ModalContext = createContext<{
    ref: RefObject<HTMLDialogElement | null>;
    show: () => void;
    hide: () => void;
}>({
    ref: { current: null },
    show: () => {},
    hide: () => {},
});

export const useModalContext = () => useContext(ModalContext);

export const useModal = <T extends object, U extends Partial<T> = Partial<T>>(
    Child: ComponentType<T>,
) => {
    const [opened, toggleModal] = useState(false);
    const [additionalProps, setAdditionalProps] = useState<U | undefined>(undefined);
    const ref = useRef<HTMLDialogElement | null>(null);

    const show = useCallback((props?: U | SyntheticEvent) => {
        if (props && !('nativeEvent' in props)) setAdditionalProps(props);
        toggleModal(true);
    }, []);

    const hide = useCallback(() => {
        toggleModal(false);
        setAdditionalProps(undefined);
    }, []);

    const Component = useMemo(() => {
        if (!opened) return () => null;

        return (defaultProps: T) => {
            const props = { ...defaultProps, ...(additionalProps ?? {}) } as T;

            return (
                <ModalContext.Provider value={{ ref, show, hide }}>
                    <Child {...props} />
                </ModalContext.Provider>
            );
        };
    }, [Child, additionalProps, hide, opened, show]);

    useEffect(() => {
        document.body.classList.toggle(
            'no-scroll',
            opened || document.querySelectorAll('dialog[open]').length > 0,
        );
    }, [opened]);

    return { Component, opened, show, hide };
};
