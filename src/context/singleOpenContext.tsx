import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";


const SingleOpenContext = createContext<
    [string | null, Dispatch<SetStateAction<string | null>>]
>([null, () => {}]);

const SingleOpenContextProvider = ({ children }: { children: ReactNode }) => {
    const state = useState<string | null>(null);
    return <SingleOpenContext value={state}>{children}</SingleOpenContext>;
};

export default SingleOpenContextProvider;
export const useSingleOpen = (id: string) => {
    const [currentId, dispatch] = useContext(SingleOpenContext);
    return [id === currentId, dispatch] as const;
};