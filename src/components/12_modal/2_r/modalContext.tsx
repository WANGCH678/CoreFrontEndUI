import type { ComponentType, Dispatch, SetStateAction } from 'react';
import { createContext, useCallback, useContext, useState } from 'react';

const ModalContext = createContext<[boolean, Dispatch<SetStateAction<boolean>>]>([
    false,
    () => {},
]);

export const withModal = <T extends object>(Component: ComponentType<T>) => {
    const HOC = (props: T) => {
        const state = useState(false);

        return (
            <ModalContext value={state}>
                <Component {...props} />
            </ModalContext>
        );
    };
    const componentName = (
        Component as ComponentType<T> & { displayName?: string; name?: string }
    ).displayName || (
        Component as ComponentType<T> & { displayName?: string; name?: string }
    ).name || 'unknown';
    HOC.displayName = `withModal(${componentName})`;

    return HOC;
};

export const useModal = () => {
    const [opened, toggleModal] = useContext(ModalContext);
    const openModal = useCallback(() => toggleModal(true), [toggleModal]);
    const closeModal = useCallback(() => toggleModal(false), [toggleModal]);

    return { opened, openModal, closeModal };
};
