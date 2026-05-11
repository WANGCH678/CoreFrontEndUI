import Accordion1 from './1_r.tsx';
import Accordion2 from './2_r.tsx';
import Accordion3 from './3-1_r.tsx';
import Accordion3_2 from './3-2_r.tsx';
import Accordion4 from './4_v.tsx';
import Accordion5 from './5_r.tsx';
import cx from './cx';

const Accordions = () => {
    return (
        <div className={cx('Accordions')}>
            <h2>아코디언</h2>
            <Accordion1 />
            <Accordion2 />
            <Accordion3 />
            <Accordion3_2 />
            <Accordion4 />
            <Accordion5 />
        </div>
    );
}

export default Accordions;