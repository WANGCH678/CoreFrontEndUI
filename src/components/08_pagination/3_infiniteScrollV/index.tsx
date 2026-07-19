import VanillaWrapper from '@/components/vanillaWrapper';
import cx from '../cx';
import { type Item, PAGE_SIZE } from './infiniteFetcher';
import scrollFetch, { type AddList } from './scrollFetch';

const generateListItem = ({ number, title, description }: Item & { number: number }) => {
    const $li = document.createElement('li');
    $li.insertAdjacentHTML('beforeend', `
        <p><strong>${number}. ${title}</strong></p>
        <div>${description}</div>
    `);

    return $li;
};

const generateList = (items: Item[], page: number) => {
    const $list = document.createElement('ul');
    $list.classList.add(cx('list'));
    items.forEach((item, i) =>
        $list.append(generateListItem({ ...item, number: page * PAGE_SIZE + i + 1 }))
    );

    return $list;
};

const initiator = (wrapper: HTMLDivElement) => {
    const $$list = document.createElement('div');
    wrapper.append($$list);
    const addList: AddList = (data, page) => $$list.append(generateList(data, page));
    scrollFetch(wrapper, addList);
};

const InfiniteScrollV = () => {
    return (
        <div>
            <h2>페이지네이션</h2>
            <VanillaWrapper title="#3" subTitle="무한 스크롤" initiator={initiator} />
        </div>
    );
};

export default InfiniteScrollV;
