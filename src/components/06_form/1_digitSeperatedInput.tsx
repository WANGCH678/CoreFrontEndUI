import {
    type InputHTMLAttributes,
    type KeyboardEvent,
    useCallback,
    useRef,
} from 'react';

type DigitSeperatedInputProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'defaultValue' | 'onInput' | 'onKeyDown' | 'onFocus'
> & {
    defaultValue?: string | number;
};

export const DigitSeperatedInput = ({
    defaultValue = 0,
    ...inputProps
}: DigitSeperatedInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const valueRef = useRef(String(defaultValue));

    const handleInput = useCallback(() => {
        const $el = inputRef.current!;
        const indexFromLast = $el.value.length - ($el.selectionStart || 0);
        const originalValue = Number($el.value.replace(/,/g, ''));

        if (Number.isNaN(originalValue)) {
            $el.setCustomValidity('숫자만 입력 가능합니다.');
            $el.value = valueRef.current;
        } else {
            $el.setCustomValidity('');
            $el.value = originalValue.toLocaleString();
            valueRef.current = $el.value;
        }

        $el.reportValidity();

        const index = $el.value.length - indexFromLast;
        $el.setSelectionRange(index, index);
    }, []);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const $el = inputRef.current!;
        const index = $el.selectionStart || 0;
        const value = $el.value;

        if (index < 2 || e.key !== 'Backspace' || value[index - 1] !== ',') return;

        $el.value = `${value.slice(0, index - 2)}${value.slice(index - 1)}`;
        $el.setSelectionRange(index - 1, index - 1);
    }, []);

    const handleFocus = useCallback(() => {
        window.requestAnimationFrame(() => {
            const $el = inputRef.current;

            if (!$el) return;

            const pos = $el.value.length;
            $el.setSelectionRange(pos, pos);
        });
    }, []);

    return (
        <input
            {...inputProps}
            type="text"
            ref={inputRef}
            defaultValue={defaultValue}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
        />
    );
};

const DigitSeperatedInputContainer = () => (
    <>
        <h3>#1. React<sub>구분 기호 자동 삽입 인풋</sub></h3>
        <DigitSeperatedInput />
    </>
);

export default DigitSeperatedInputContainer;
