import { useState } from "react";
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

const TabMenu3_1 = () => {  
    const [currentId, setCurrentId] = useState<string>(data[0].id);
    const toggleItem = (id: string) => {
        setCurrentId(id);
    }


    return (
        <>
            <h3>#3-1. React<sub>css로 그리기</sub></h3>
            <div className={cx('container', 'tabMenu3-1')}>
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
                        <div key={d.id} className={cx('description', { current: d.id === currentId })}>
                            {d.description}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default TabMenu3_1;
