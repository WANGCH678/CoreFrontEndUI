import { useCallback, type SyntheticEvent } from "react";
import cx from "./cx";
import measureLines from "@/service/measureLines";

const ReactiveTextBox1 = () => {
    const handleInput = useCallback((e: SyntheticEvent) => {
        const elem = e.target as HTMLTextAreaElement;
        const val = elem.value;
        elem.rows = measureLines(elem, val) + 1;
    }, []);

    return (
        <> 
            <h3>#1. React<sub>canvas - measureText로 textarea의 줄 수 측정</sub></h3>
            <div className={cx('container')}>
                <textarea onInput={handleInput} />
            </div>
        </>
    )
}

export default ReactiveTextBox1;