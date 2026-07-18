import DigitSeperatedInput from './1_digitSeperatedInput';
import UncontrolledForm from './2-1_uncontrolled';
import ControlledForm from './2-2_controlled';
import HookTestForm from './3_hook-test';
import cx from './cx';

const Form = () => (
    <div className={cx('Forms')}>
        <h2>폼</h2>
        <DigitSeperatedInput />
        <UncontrolledForm />
        <ControlledForm />
        <HookTestForm />
    </div>
);

export default Form;
