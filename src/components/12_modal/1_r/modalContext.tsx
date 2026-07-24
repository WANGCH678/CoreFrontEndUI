import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { Fragment, createContext, useCallback, useContext, useEffect, useState } from 'react';

type ModalState = Map<string, ReactNode>;
type ModalDispatchState = Dispatch<SetStateAction<ModalState>>;

const ModalContext = createContext<ModalDispatchState>(() => {});

export const ModalContextProvider = ({ children }: { children: ReactNode }) => {
    const [modals, setModals] = useState<ModalState>(new Map());

    useEffect(() => {
        document.body.classList.toggle('no-scroll', modals.size > 0);
    }, [modals]);

    return (
        <ModalContext value={setModals}>
            {children}
            <div id="modalRoot">
                {Array.from(modals).map(([id, modal]) => (
                    <Fragment key={id}>{modal}</Fragment>
                ))}
            </div>
        </ModalContext>
    );
};

export const useModal = () => {
    const setModals = useContext(ModalContext);

    const openModal = useCallback((id: string, children: ReactNode) => {
        setModals(prev => {
            const newMap = new Map(prev);
            newMap.set(id, children);
            return newMap;
        });
    }, [setModals]);

    const closeModal = useCallback((id: string) => {
        setModals(prev => {
            const newMap = new Map(prev);
            newMap.delete(id);
            return newMap;
        });
    }, [setModals]);

    return { openModal, closeModal };
};
