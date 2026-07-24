import { type ReactNode, useContext, useState } from 'react';
import cx from '../cx';
import { type SnackbarState, SnackbarContext, useSnackbar } from './snackbarContext';

const SnackbarItem = ({ id, children }: { id: string; children: ReactNode }) => {
    const { snackbarRef } = useSnackbar(id, children);

    return <div className={cx('SnackbarItem')} ref={snackbarRef}>{children}</div>;
};

const SnackbarContainer = () => {
    const [snackbars] = useContext(SnackbarContext);

    return (
        <div className={cx('Snackbars')}>
            {Array.from(snackbars).map(([id, children]) => (
                <SnackbarItem key={id} id={id}>{children}</SnackbarItem>
            ))}
        </div>
    );
};

export const SnackbarContextProvider = ({ children }: { children: ReactNode }) => {
    const state = useState<SnackbarState>(new Map());

    return (
        <SnackbarContext value={state}>
            {children}
            <SnackbarContainer />
        </SnackbarContext>
    );
};
