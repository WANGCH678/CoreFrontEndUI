import cx from '../cx';
import NavigationBar from './navigationBar';
import usePageFetcher, { PAGE_SIZE } from './usePageFetcher';

const ListItem = ({
    number,
    title,
    description,
}: { number: number; title: string; description: string }) => (
    <li>
        <p><strong>{number}. {title}</strong></p>
        <p>{description}</p>
    </li>
);

const TraditionalPagination = () => {
    const { currentPage, data, isLoading, fetchPage, totalPages } = usePageFetcher();

    return (
        <>
            <h2>페이지네이션</h2>
            <h3>#1. React <sub>전통적인 네비게이션 바 형태</sub></h3>
            <ul className={cx('list')}>
                {data[currentPage].map((item, i) => (
                    <ListItem
                        {...item}
                        number={PAGE_SIZE * currentPage + i + 1}
                        key={`${currentPage}_${item.id}`}
                    />
                ))}
            </ul>
            {isLoading && <div className={cx('spinner')} />}
            <NavigationBar currentPage={currentPage} fetchPage={fetchPage} totalPages={totalPages} />
        </>
    );
};

export default TraditionalPagination;
