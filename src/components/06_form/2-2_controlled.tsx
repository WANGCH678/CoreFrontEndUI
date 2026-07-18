import { type FormEvent, useCallback, useReducer, useRef } from 'react';
import { DigitSeperatedInput } from './1_digitSeperatedInput';

type FormElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type FormState = {
    __id: string;
    __name: string;
    __gender?: string;
    __password: string;
    __password_confirm: string;
    __photo?: string;
    __salary: string;
    __agree: boolean;
};
type FormItem = keyof FormState;

const defaultFormState: FormState = {
    __id: '',
    __name: '',
    __gender: undefined,
    __password: '',
    __password_confirm: '',
    __photo: undefined,
    __salary: '',
    __agree: false,
};

const formReducer = (state: FormState, $el: FormElement) => {
    const { type, id, name } = $el;

    switch (type) {
        case 'radio': return { ...state, [name]: $el.value };
        case 'checkbox': return { ...state, [id]: ($el as HTMLInputElement).checked };
    }

    switch (id) {
        case '__photo': {
            const file = ($el as HTMLInputElement).files?.[0];
            return { ...state, __photo: file ? URL.createObjectURL(file) : '' };
        }
        default: return { ...state, [id]: $el.value };
    }
};

const validationKeys: (keyof ValidityState)[] = [
    'badInput',
    'patternMismatch',
    'rangeOverflow',
    'rangeUnderflow',
    'stepMismatch',
    'tooLong',
    'tooShort',
    'typeMismatch',
    'valueMissing',
];

type FormControl = Partial<Record<keyof ValidityState, string>> & {
    additionalValidator?: ($el: FormElement, formState: FormState) => boolean;
    onInput?: ($el: FormElement, formState: FormState) => void;
    transformData?: (formState: Partial<FormState>) => Partial<FormState>;
    customError?: string;
};

const formController: Record<string, FormControl> = {
    __id: {
        valueMissing: '아이디를 입력하세요.',
        patternMismatch: '아이디는 영어나 숫자 또는 _ 만 입력할 수 있습니다.',
        tooShort: '아이디는 네 글자 이상 입력해 주세요.',
    },
    __name: {
        valueMissing: '이름을 입력하세요.',
        patternMismatch: '띄어쓰기 없이 한글만 입력하세요.',
        tooShort: '이름을 두 글자 이상 입력하세요.',
    },
    __password_confirm: {
        additionalValidator: ($el, formState) => $el.value === formState.__password,
        customError: '비밀번호가 일치하지 않습니다.',
        transformData: ({ __password_confirm, ...formState }) => formState,
    },
    __salary: {
        transformData: formState => ({
            ...formState,
            __salary: (document.querySelector('#__salary') as HTMLInputElement)
                .value.replace(/,/g, ''),
        }),
    },
};

const getSubmitData = (formState: FormState) => Object.keys(formState).reduce<Partial<FormState>>(
    (res, key) => formController[key]?.transformData?.(res) || res,
    formState,
);

const checkAdditionalValidity = ($el: FormElement, formState: FormState) => {
    const inputController = formController[$el.id as FormItem];
    const {
        additionalValidator,
        customError = '[custom error]',
    } = inputController || {};
    const isValid = !additionalValidator || additionalValidator($el, formState);

    if (!isValid) $el.setCustomValidity(customError);
    return isValid;
};

const Form2 = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const [formState, dispatch] = useReducer(formReducer, defaultFormState);
    const handleInvalid = useCallback((e: FormEvent) => {
        const $el = e.target as FormElement;

        if (checkAdditionalValidity($el, formState)) {
            const inputController = formController[$el.id as FormItem];
            const invalidKey = validationKeys.find(k => $el.validity[k]);
            const errorText = (invalidKey && inputController?.[invalidKey]) || '';

            $el.setCustomValidity(errorText);
        }

        return $el;
    }, [formState]);
    const handleChange = useCallback((e: FormEvent) => {
        const $el = handleInvalid(e);

        $el.reportValidity();
        dispatch($el);
    }, [handleInvalid]);
    const handleSubmit = useCallback((e: FormEvent) => {
        e.preventDefault();
        const $form = formRef.current!;

        Object.keys(formState).forEach(id => {
            const $el = $form.elements.namedItem(id) as FormElement;

            if ($el) checkAdditionalValidity($el, formState);
        });

        if (!$form.reportValidity()) return;

        console.log(getSubmitData(formState));
    }, [formState]);

    return (
        <>
            <h3>#2-2. React<sub>제어 폼</sub></h3>
            <form id="__registerForm" ref={formRef} onInvalid={handleInvalid} onSubmit={handleSubmit}>
                <fieldset>
                    <legend>회원가입</legend>
                    <p>
                        <label htmlFor="__id">아이디: </label>
                        <input
                            id="__id"
                            name="__id"
                            type="text"
                            required
                            pattern="^[A-Za-z0-9_]{1,}$"
                            minLength={4}
                            maxLength={12}
                            value={formState.__id}
                            onChange={handleChange}
                        />
                    </p>
                    <p>
                        <label htmlFor="__name">이름: </label>
                        <input
                            id="__name"
                            name="__name"
                            type="text"
                            required
                            pattern="^([가-힣]){1,}$"
                            minLength={2}
                            value={formState.__name}
                            onChange={handleChange}
                        />
                    </p>
                    <p>
                        <label>(선택) 성별: </label>
                        <input
                            id="__gender_male"
                            name="__gender"
                            type="radio"
                            required
                            value="남"
                            onChange={handleChange}
                        />
                        <label htmlFor="__gender_male">남</label>
                        <input
                            id="__gender_female"
                            name="__gender"
                            type="radio"
                            value="여"
                            onChange={handleChange}
                        />
                        <label htmlFor="__gender_female">여</label>
                    </p>
                    <p>
                        <label htmlFor="__password">비밀번호: </label>
                        <input
                            id="__password"
                            name="__password"
                            type="password"
                            required
                            autoComplete="off"
                            value={formState.__password}
                            onChange={handleChange}
                        />
                    </p>
                    <p>
                        <label htmlFor="__password_confirm">비밀번호 확인: </label>
                        <input
                            id="__password_confirm"
                            type="password"
                            required
                            autoComplete="off"
                            value={formState.__password_confirm}
                            onChange={handleChange}
                        />
                    </p>
                    <div>
                        <label htmlFor="__photo">프로필사진: </label>
                        <input
                            id="__photo"
                            name="__photo"
                            type="file"
                            accept="image/png, image/jpeg"
                            required
                            onChange={handleChange}
                        />
                        <div>
                            <img src={formState.__photo} alt="" />
                        </div>
                    </div>
                    <p>
                        <label htmlFor="__salary">(선택) 연봉: </label>
                        <DigitSeperatedInput name="__salary" id="__salary" /> 원
                    </p>
                    <p>
                        <input
                            id="__agree"
                            name="__agree"
                            type="checkbox"
                            required
                            checked={formState.__agree}
                            onChange={handleChange}
                        />
                        <label htmlFor="__agree">약관에 동의합니다</label>
                    </p>
                </fieldset>
            </form>
            <button type="submit" form="__registerForm">제출</button>
        </>
    );
};

export default Form2;
