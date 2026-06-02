import LineClamp1 from './1_r';
import LineClamp2 from './2_r';
import cx from './cx';

const LineClamp = () => (
    <div className={cx('LineClamp')}>
        <h2>여러줄 말줄임</h2>
        <LineClamp1 />
        <LineClamp2 />
    </div>
)

export default LineClamp;