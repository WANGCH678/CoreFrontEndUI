import Tooltip1 from './1_r';
import Tooltip2_1 from './2-1_r';
import Tooltip2_2 from './2-2_r';
import Tooltip3 from './3_r';
import cx from './cx';

const Tooltip = () => {
    return (
        <div className={cx('tooltips')} style={{ marginBottom: 500 }}>
            <h2>툴팁</h2>
            <Tooltip1 />
            <Tooltip2_1 />
            <Tooltip2_2 />
            <Tooltip3 />
        </div>
    );
}

export default Tooltip;
