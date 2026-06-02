import { useCallback, useEffect, useRef, useState } from "react";
import cx from "./cx";
import data from "./data";
import { useViewportSize } from "@/context/viewportContext";

const LineClampedText = ({
    text,
    maxLines = Number.MAX_SAFE_INTEGER
}: { text: string; maxLines?: number}) => {
    const { width: viewportWidth } = useViewportSize();
    const elemRef = useRef<HTMLDivElement>(null);
    const [showClampButton, setClampButton] = useState(false);
    const [isClamped, setClamped] = useState(false);

    const toggleClamped = useCallback(() => { setClamped(prev => !prev) }, []);

    useEffect(() => {
        if (!elemRef.current || !viewportWidth) return;
        const lineHeight = Number.parseFloat(getComputedStyle(elemRef.current).lineHeight);
        const measuredLines = Math.round(elemRef.current.scrollHeight / lineHeight);
        const linesOverflow = measuredLines > maxLines;
        setClampButton(linesOverflow);
        setClamped(linesOverflow);
    }, [maxLines, viewportWidth]);

    return (
        <div className={cx('content', { clamped: isClamped })}>
            <div className={cx('text')} ref={elemRef} style={{ WebkitLineClamp: isClamped ? maxLines : '' }}>
                {text}
            </div>
            {showClampButton && (
                <button type="button" className={cx('buttonMore')} onClick={toggleClamped} />
            )}
        </div>
    );
}

const LineClamp2 = () => (
    <>
        <h3>#2. React<sub>scrollHeight로 조절</sub></h3>
        {data.map(item => <LineClampedText key={item.id} text={item.description} maxLines={3} />)}
    </>
)

export default LineClamp2;
