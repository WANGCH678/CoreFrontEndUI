import { useState } from "react";
import cx from "./cx";
import data from "./data";

type TabItem = {
    id: string;
    title: string;
    description: string;
    current: boolean;
    toggle: () => void;
}

const TabItem = ({ id, title, description, current, toggle }: TabItem) => (
    <li className={cx('tab', { current })} key={id}>
        <button type="button" onClick={toggle}>{title}</button>
    </li>
)

const TabMenu2 = () => {  
    const [currentId, setCurrentId] = useState<string>(data[0].id);
    const toggleItem = (id: string) => {
        setCurrentId(id);
    }


    return (
        <>
            <h3>#2. React<sub>css로 그리기</sub></h3>
            <div className={cx('container', 'tabMenu2')}>
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
                {data.map(d => (
                    <div key={d.id} className={cx('description', { current: d.id === currentId })}>
                        {d.description}
                    </div>
                ))}
            </div>
        </>
    );
}

export default TabMenu2;