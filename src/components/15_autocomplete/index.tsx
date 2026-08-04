import cx from './cx';
import Autocomplete1 from './1_r';
import Autocomplete2 from './2_r';

const Autocompletes = () => (
    <div className={cx('AutoCompletes')}>
        <h2>자동완성</h2>
        <Autocomplete1 />
        <Autocomplete2 />
        <div id="popoverRoot" />
    </div>
);

export default Autocompletes;
