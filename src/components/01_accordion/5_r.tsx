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
const AccordionItem = ({ id: _id, title, description, current, toggle }: AccordionItem) => {
    const descRef = useRef<HTMLDivElement>(null);
    const hidden = current ? undefined : ('until-found' as unknown as boolean);
    useEffect(() => {
        const desc = descRef.current;
        desc?.addEventListener('beforematch', toggle);
        return () => desc?.removeEventListener('beforematch', toggle);
    }, [toggle]);

    return (
        <li className={cx('item', 'item3', { current })}>
            <button type='button' className={cx('tab')} onClick={toggle}>
                {title}
            </button>
            <div className={cx('description')} ref={descRef} 
                hidden={hidden}
            >
                {description}
            </div>
        </li>
    );
};

const Accordion5 = () => {
    const [currentId, setCurrentId] = useState<string | null>(data[0].id); // 현재 렌더링된 아코디언의 id
    const toggleItem = (id: string) => {
        setCurrentId(prev => (prev === id ? null : id));
    }

    return (
        <>
            <h3>#5. React<sub>useRef로 구현</sub></h3>
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

export default Accordion5;
