import cx from './cx';
import useForm, { type FormController } from './useForm';

const formController: FormController = {
    cardNo: { transformData: formData => formData.getAll('cardNo').join('-') },
    validThroughM: { patternMismatch: '01 ~ 12 사이의 숫자를 두 자리로 입력하세요.' },
    validThroughY: { patternMismatch: '00 ~ 99 사이의 숫자를 두 자리로 입력하세요.' },
    validThrough: { transformData: formData => formData.getAll('validThrough').join('/') },
};

const Form3 = () => {
    const {
        formRef,
        handleInput,
        handleInvalid,
        handleSubmit,
    } = useForm(formController, '[data-error-msg]');

    return (
        <>
            <h3>#2-3. React<sub>폼 - hook test</sub></h3>
            <form
                id="testForm3"
                noValidate={true}
                ref={formRef}
                onInput={handleInput}
                onInvalid={handleInvalid}
                onSubmit={handleSubmit}
            >
                <fieldset>
                    <legend>카드 등록</legend>
                    <p>
                        <label htmlFor="_id1">카드 번호: </label>
                        <input name="cardNo" id="_id1" type="number" required min={1000} max={9999} />
                        {' - '}
                        <input name="cardNo" id="_id2" type="number" required min={1000} max={9999} />
                        {' - '}
                        <input name="cardNo" id="_id3" type="number" required min={1000} max={9999} />
                        {' - '}
                        <input name="cardNo" id="_id4" type="number" required min={1000} max={9999} />
                        <span data-error-msg className={cx('errorMsg')} />
                    </p>
                    <p>
                        <label htmlFor="validThroughM">유효기간: </label>
                        <input
                            name="validThrough"
                            id="validThroughM"
                            type="text"
                            required
                            min={1}
                            max={31}
                            pattern="^(?:0[1-9]|1[0-2])$"
                        />
                        {' / '}
                        <input
                            name="validThrough"
                            id="validThroughY"
                            type="text"
                            required
                            min={1}
                            max={12}
                            pattern="^[0-9]{2}$"
                        />
                        <span data-error-msg className={cx('errorMsg')} />
                    </p>
                    <p>
                        <label htmlFor="cvc">CVC: </label>
                        <input name="cvc" id="cvc" type="number" required min={100} max={999} />
                        <span data-error-msg className={cx('errorMsg')} />
                    </p>
                </fieldset>
            </form>
            <button type="submit" form="testForm3">제출</button>
        </>
    );
};

export default Form3;
