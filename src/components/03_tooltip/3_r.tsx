import { type CSSProperties, type RefObject, useRef, useState } from 'react';
import { useScrollInfo } from '@/context/viewportContext';
import useClickOutside from '@/hooks/useClickOutside';
import cx from './cx';
import data from './data';
import useStyleInsideViewport from '@/hooks/useStyleInsideViewport';

type TooltipProps = { id: string; text: string; description: string };
const TooltipDescription = ({ description, handleClose, layerRef, style }: {
    description: string;
    handleClose: () => void;
    layerRef: RefObject<HTMLElement | null>;
    style?: CSSProperties;
}) => {
    const ref = useClickOutside(handleClose);

    return <span className={cx('tooltip-layer', 'inside-viewport')} ref={(node) => {
        ref.current = node;
        layerRef.current = node;
    }} style={style}>
        {description}
    </span>;
};

const TooltipItem = ({ id: _id, text, description }: TooltipProps) => {
    const [isOpen, toggle] = useState(false);
    const handleClick = () => toggle(prev => !prev);
    const handleClose = () => toggle(false);
    const triggerRef = useRef<HTMLSpanElement>(null);
    const layerRef = useRef<HTMLSpanElement>(null);
    const style = useStyleInsideViewport(triggerRef, layerRef, isOpen);

    return (
        <span className={cx('tooltip-root')}>
            {text}
            <span className={cx('tooltip-trigger', { open: isOpen})} onClick={handleClick} ref={triggerRef}>
                {isOpen && (
                    <TooltipDescription
                        description={description}
                        handleClose={handleClose}
                        layerRef={layerRef}
                        style={style}
                    />
                )}
            </span>
        </span>
    );
};

const Tooltip3 = () => {
    const scrollInfo = useScrollInfo();
    console.log(scrollInfo);

    return (
        <>
            <h3>#3. React<sub>화면을 벗어나지 않도록 처리</sub></h3>
            {data.map(d => <TooltipItem id={d.id} text={d.title} description={d.description} key={d.id} />)}
        </>
    )
};

export default Tooltip3;
