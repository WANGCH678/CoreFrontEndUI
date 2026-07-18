import { type FormEvent, useCallback, useRef } from 'react';

type FormElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type FormControl = Partial<Record<keyof ValidityState, string>> & {
    additionalValidator?: ($el: FormElement, formData: FormData) => boolean;
    onInput?: ($el: FormElement, formData: FormData) => void;
    transformData?: (formData: FormData) => any;
    customError?: string;
};
export type FormController = Record<string, FormControl>;

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

const useForm = (formController: FormController, customNotificationSelector?: string) => {
    const formRef = useRef<HTMLFormElement>(null);

    const reportValidity = useCallback(($el: FormElement) => {
        if (!customNotificationSelector) return $el.reportValidity();

        const isValid = $el.checkValidity();
        const $notification = $el.parentElement!.querySelector(customNotificationSelector);

        if ($notification) {
            $notification.textContent = $el.validationMessage;
            $el.focus();
        }

        return isValid;
    }, [customNotificationSelector]);

    const checkAdditionalValidity = useCallback(($el: FormElement, formData: FormData) => {
        const inputController = formController[$el.id];
        const {
            additionalValidator,
            customError = '[custom error]',
        } = inputController || {};
        const isValid = !additionalValidator || additionalValidator($el, formData);

        if (!isValid) $el.setCustomValidity(customError);
        return isValid;
    }, [formController]);

    const handleInvalid = useCallback((e: FormEvent) => {
        const $el = e.target as FormElement;
        const formData = new FormData($el.form!);

        if (checkAdditionalValidity($el, formData)) {
            const inputController = formController[$el.id];
            const invalidKey = validationKeys.find(k => $el.validity[k]);
            const errorText = (invalidKey && inputController?.[invalidKey]) || '';

            $el.setCustomValidity(errorText);
        }

        return { $el, formData };
    }, [formController, checkAdditionalValidity]);

    const handleInput = useCallback((e: FormEvent) => {
        const { $el, formData } = handleInvalid(e);

        formController[$el.id]?.onInput?.($el, formData);
        reportValidity($el);
    }, [formController, reportValidity, handleInvalid]);

    const handleSubmit = useCallback((e: FormEvent) => {
        try {
            e.preventDefault();
            const $form = e.target as HTMLFormElement;
            const data = new FormData($form);

            for (const $el of $form.elements) {
                checkAdditionalValidity($el as FormElement, data);
                if (!reportValidity($el as FormElement)) {
                    throw new Error('some form field are invalid');
                }
            }

            for (const [key] of data) {
                if (formController[key]?.transformData) {
                    data.set(key, formController[key].transformData(data));
                }
            }

            console.log(Object.fromEntries(data)); // TODO: 실제 서버 전송 코드로 수정이 필요합니다.
        } catch (err) {
            console.error(err);
        }
    }, [formController, reportValidity, checkAdditionalValidity]);

    return { formRef, handleInput, handleInvalid, handleSubmit };
};

export default useForm;
