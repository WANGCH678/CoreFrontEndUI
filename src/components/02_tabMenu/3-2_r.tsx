import { useEffect, useRef, useState } from "react";
import cx from "./cx";
import data from "./data";

type TabItem = {
    title: string;
    current: boolean;
    toggle: () => void;
}

const TabItem = ({ title, current, toggle }: TabItem) => (
    <li className={cx('tab', { current })}>
        <button type="button" onClick={toggle}>{title}</button>
    </li>
)

const TabPanel = ({description, current}: { description: string; current: boolean }) => {
    const [animationClassName, setAnimationClassName] = useState<string | null>(
        current ? 'current' : null
    );
    const prevRef = useRef(current);

    const handleAnimationEnd = () => {
        setAnimationClassName(prev => {
            switch (prev) {
                case 'exit': return null;
                case 'enter': return 'current';
            }
            return prev; 
        }); 
    }
    useEffect(() => {
        if (prevRef.current !== current) {
            prevRef.current = current;
            setAnimationClassName(current ? 'enter' : 'exit');
        }
    }, [current]);
    return (
        <div className={cx('description', animationClassName)} onAnimationEnd={handleAnimationEnd}>{description}
        </div>
    );
}

const TabMenu3_2 = () => {  
    const [currentId, setCurrentId] = useState<string>(data[0].id);
    const toggleItem = (id: string) => {
        setCurrentId(id);
    }


    return (
        <>
            <h3>#3-2. React<sub>css로 그리기</sub></h3>
            <div className={cx('container', 'tabMenu3-2')}>
                <ul className={cx('tabList')}>
                    {data.map((d) => (
                        <TabItem
                            {...d}
                            key={d.id}
                            current={d.id === currentId}
                            toggle={() => toggleItem(d.id)}
                        />
                    ))}
                </ul>
                <div className={cx('tabPanel')}>
                    {data.map(d => (
                        <TabPanel key={d.id} {...d} current={d.id === currentId} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default TabMenu3_2;
