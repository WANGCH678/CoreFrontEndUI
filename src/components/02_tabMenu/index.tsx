import TabMenu1 from './1_r.tsx';
import TabMenu2 from './2_r.tsx';
import TabMenu3_1 from './3-1_r.tsx';
import TabMenu3_2 from './3-2_r.tsx';
import TabMenu4V from './4_v.tsx';
import cx from './cx.ts';

const TabMenus = () => (
    <div className={cx('TabMenus')}>
        <h2>탭 메뉴</h2>
        <TabMenu1 />
        <TabMenu2 />
        <TabMenu3_1 />
        <TabMenu3_2 />
        <TabMenu4V />
    </div>
)

export default TabMenus;