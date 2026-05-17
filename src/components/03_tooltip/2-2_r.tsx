import { useCallback, useEffect, useState } from 'react';
import useClickOutside from '@/hooks/useClickOutside';
import cx from './cx';
import data from './data';

type TooltipProps = { id: string; text: string; description: string };
const TooltipDescription = ({ description, handleClose }: {
    description: string;
    handleClose: () => void;
}) => {
    const ref = useClickOutside(handleClose);
    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            handleClose();
        }
    }, [handleClose]);
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, {capture: true});
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [handleClickOutside]);

    return <span className={cx('tooltip-layer')} ref={ref}>
        {description}
    </span>;
};

const TooltipItem = ({ id: _id, text, description }: TooltipProps) => {
    const [isOpen, toggle] = useState(false);
    const handleClick = () => toggle(prev => !prev);
    const handleClose = () => toggle(false);

    return (
        <span className={cx('tooltip-root')}>
            {text}
            <span className={cx('tooltip-trigger', { open: isOpen})} onClick={handleClick}>
                {isOpen && (
                    <TooltipDescription description={description} handleClose={handleClose} />
                )}
            </span>
        </span>
    );
};

const Tooltip2_2 = () => (
    <>
        <h3>#2-2. React<sub>하나만 열리도록 처리 - 이벤트 핸들러</sub></h3>
        {data.map(d => <TooltipItem id={d.id} text={d.title} description={d.description} key={d.id} />)}
    </>
)

export default Tooltip2_2;
