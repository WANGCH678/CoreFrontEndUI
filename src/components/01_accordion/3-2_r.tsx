import cx from './cx';
import data from './data';
import { useEffect, useRef, useState } from 'react';

type AccordionItem = {
    id: string;
    title: string;
    description: string;
    current: boolean;
    toggle: () => void;
}
const AccordionItem = ({ id, title, description, current, toggle }: AccordionItem) => {
    const descRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const $desc = descRef.current!;
        $desc.style.maxHeight = current ? `${$desc.scrollHeight}px` : '0';
    }, [current]);

    return (
        <li key={id} className={cx('item', 'item3', { current })}>
            <button type='button' className={cx('tab')} onClick={toggle}>
                {title}
            </button>
            <div ref={descRef} className={cx('description')}>
                {description}
            </div>
        </li>
    );
};

const Accordion3_2 = () => {
    const [currentId, setCurrentId] = useState<string | null>(data[0].id); // 현재 렌더링된 아코디언의 id
    const toggleItem = (id: string) => {
        setCurrentId(prev => (prev === id ? null : id));
    }

    return (
        <> 
            <h3>#3. React<sub>useRef로 구현</sub></h3>
            <ul className={cx('container')}>
                {data.map((d) => (
                    <AccordionItem
                        {...d}
                        key={d.id}
                        current={d.id === currentId}
                        toggle={() => toggleItem(d.id)}
                    />
                ))}
            </ul>
        </>
    );
}

export default Accordion3_2;