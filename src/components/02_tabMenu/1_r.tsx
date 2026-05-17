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

const TabMenu1 = () => {  
    const [currentId, setCurrentId] = useState<string>(data[0].id);
    const toggleItem = (id: string) => {
        setCurrentId(id);
    }

    const currentDesc = data.find(d => d.id === currentId)?.description;

    return (
        <>
            <h3>#1. React<sub>현재 desc만 html로 그리기</sub></h3>
            <div className={cx('container')}>
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
                <div className={cx('description')}>
                    {currentDesc}
                </div>
            </div>
        </>
    );
}

export default TabMenu1;
