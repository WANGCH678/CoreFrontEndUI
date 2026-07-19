import cx from '../cx';
import { PAGE_SIZE, type Item } from './useInfiniteFetcher';
import useScrollFetch from './useScrollFetch';

const ListItem = ({ number, title, description }: Item & { number: number }) => (
    <li>
        <p><strong>{number}. {title}</strong></p>
        <p>{description}</p>
    </li>
);

const List = ({ page, pageIndex }: { page: Item[]; pageIndex: number }) => (
    <ul className={cx('list')}>
        {page.map((item, j) => (
            <ListItem key={item.id} {...item} number={pageIndex * PAGE_SIZE + j + 1} />
        ))}
    </ul>
);

const InfiniteScrollR = () => {
    const { data, isLoading, moreRef } = useScrollFetch();

    return (
        <>
            <h2>페이지네이션</h2>
            <h3>#2. React <sub>무한 스크롤</sub></h3>
            {data.map((page, i) => <List page={page} pageIndex={i} key={page[0].id} />)}
            <div id="fetchMore" ref={moreRef} />
            {isLoading && <div className={cx('spinner')} />}
        </>
    );
};

export default InfiniteScrollR;
