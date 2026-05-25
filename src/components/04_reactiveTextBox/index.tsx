import ReactiveTextBox1 from './1_r';
import ReactiveTextBox2 from './2_r';
import cx from './cx';

const ReactiveTextBoxes = () => {
    return (
        <div className={cx('ReactiveTextBoxes')}>
            <h2>반응형 텍스트 박스</h2>
            <ReactiveTextBox1 />
            <ReactiveTextBox2 />
        </div>
    );
};

export default ReactiveTextBoxes;
