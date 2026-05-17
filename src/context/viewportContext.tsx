import { type ReactNode, createContext, useContext, useSyncExternalStore } from "react";
import { deepCompare } from "@/service/util";

type ScrollInfo = Pick<DOMRect, 'left' | 'top'> & { scrollHeight: number };
type ViewPortSize = Pick<DOMRect, 'width' | 'height'>;

const DefaultScrollInfo: ScrollInfo = { left: 0, top: 0, scrollHeight: 0 };
const getScrollInfo = (() => {
    let stored: ScrollInfo = DefaultScrollInfo;
    return () => {
        const { scrollLeft, scrollTop, scrollHeight } = document.scrollingElement!;
        const newScrollInfo = { left: scrollLeft, top: scrollTop, scrollHeight };
        if (!deepCompare(stored, newScrollInfo)) {
            stored = newScrollInfo;
        }
        return stored;
    };
})();

const subscribeScroll = (getSnapshot: () => void) => {
    window.addEventListener('scroll', getSnapshot, { passive: true });

    return () => {
        window.removeEventListener('scroll', getSnapshot);
    };
};

const ScrollInfoContext = createContext<ScrollInfo>(DefaultScrollInfo);
const ScrollInfoContextProvider = ({ children }: { children: ReactNode }) => {
    const scrollInfo = useSyncExternalStore(
        subscribeScroll, getScrollInfo, () => DefaultScrollInfo
    );
    console.log(scrollInfo);

    return <ScrollInfoContext.Provider value={scrollInfo}>{children}</ScrollInfoContext.Provider>;
};

const getViewportElem = (() => {
    let elem: HTMLElement | null = document.querySelector('#viewport');
    return () => {
        if (!elem) {
            elem = document.createElement('div');
            elem.id = 'viewport';
            elem.style.cssText = 'position: fixed; inset: 0; z-index: -1;';
            document.body.insertAdjacentElement('afterbegin', elem);
        }
        return elem;
    };
})();

const DefaultViewportSize: ViewPortSize = { width: 0, height: 0 };
const getViewportSize = (() => {
    let stored: ViewPortSize = DefaultViewportSize;
    return () => {
        const { clientWidth, clientHeight } = getViewportElem();
        const newSize = { width: clientWidth, height: clientHeight };
        if (!deepCompare(stored, newSize)) {
            stored = newSize;
        }
        return stored;
    };
})();

const subscribeResize = (getSnapshot: () => void) => {
    const callback = () => window.requestAnimationFrame(getSnapshot);
    const resizeObserver = new ResizeObserver(callback);
    resizeObserver.observe(getViewportElem());

    return () => {
        resizeObserver.disconnect();
    };
};

const ViewportSizeContext = createContext<ViewPortSize>(DefaultViewportSize);
const ViewportSizeContextProvider = ({ children }: { children: ReactNode }) => {
    const viewportSize = useSyncExternalStore(
        subscribeResize, getViewportSize, () => DefaultViewportSize
    );
    console.log(viewportSize);

    return <ViewportSizeContext.Provider value={viewportSize}>{children}</ViewportSizeContext.Provider>;
};

const ViewportContextProvider = ({ children }: { children: ReactNode }) => (
    <ScrollInfoContextProvider>
        <ViewportSizeContextProvider>{children}</ViewportSizeContextProvider>
    </ScrollInfoContextProvider>
);

export default ViewportContextProvider;
export const useScrollInfo = () => useContext(ScrollInfoContext);
export const useViewportSize = () => useContext(ViewportSizeContext);
