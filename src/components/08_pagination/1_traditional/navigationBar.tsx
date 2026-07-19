import cx from '../cx';

const VISIBLE_PAGES = 5;

const NavigationBar = ({
    currentPage,
    fetchPage,
    totalPages,
}: {
    currentPage: number;
    fetchPage: (page: number) => void;
    totalPages: number;
}) => {
    const from = Math.floor(currentPage / VISIBLE_PAGES) * VISIBLE_PAGES;
    const to = Math.min(from + VISIBLE_PAGES, totalPages);
    const pages = Array.from({ length: to - from }, (_, i) => from + i);

    return (
        <div className={cx('navigation-bar')}>
            <button
                type="button"
                disabled={currentPage <= 0}
                onClick={() => fetchPage(currentPage - VISIBLE_PAGES)}
            >&lt;&lt;</button>
            <button type="button" disabled={currentPage <= 0} onClick={() => fetchPage(currentPage - 1)}>&lt;</button>
            {pages.map(page => page === currentPage ? (
                <span key={page} className={cx('page')}>{page + 1}</span>
            ) : (
                <button
                    type="button"
                    key={page}
                    className={cx('page')}
                    onClick={() => fetchPage(page)}
                >{page + 1}</button>
            ))}
            <button
                type="button"
                onClick={() => fetchPage(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
            >&gt;</button>
            <button
                type="button"
                onClick={() => fetchPage(currentPage + VISIBLE_PAGES)}
                disabled={currentPage >= totalPages - 1}
            >&gt;&gt;</button>
        </div>
    );
};

export default NavigationBar;
