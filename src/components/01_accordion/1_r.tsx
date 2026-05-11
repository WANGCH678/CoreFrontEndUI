import cx from './cx';
import data from './data';
import { useState } from 'react';

type AccordionItem = {
    id: string;
    title: string;
    description: string;
    current: boolean;
    toggle: () => void;
}
const AccordionItem = ({ id, title, description, current, toggle }: AccordionItem) => {
    return (
        <li key={id} className={cx('item', { current })}>
            <button type='button' className={cx('tab')} onClick={toggle}>
                {title}
            </button>
            {current && <div className={cx('description')}>{description}</div>}
        </li>
    );
};

const Accordion1 = () => {
    const [currentId, setCurrentId] = useState<string | null>(data[0].id); // 현재 렌더링된 아코디언의 id
    const toggleItem = (id: string) => {
        setCurrentId(prev => (prev === id ? null : id));
    }

    return (
        <> 
            <h3>#1. React<sub>현재 desc만 렌더링</sub></h3>
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

export default Accordion1;