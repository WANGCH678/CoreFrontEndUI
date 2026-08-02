import Dropdown from './dropdown';
import data from '../data';

const Dropdown1 = () => (
    <article>
        <h3>#1. Compound Component</h3>
        <Dropdown items={data}>
            <Dropdown.Trigger />
            <Dropdown.List />
        </Dropdown>
        <Dropdown items={data}>
            <Dropdown.Trigger />
            <Dropdown.List />
        </Dropdown>
    </article>
);

export default Dropdown1;
