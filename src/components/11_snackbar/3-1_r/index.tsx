import data from '../data';
import cx from '../cx';
import { useSnackbar } from './useSnackbar';
import SnackbarItem from './snackbarItem';

const ListItem = ({ id, text }: { id: string; text: string }) => {
    const { showSnackbar, snackbarRef, opened } = useSnackbar();

    return (
        <span className={cx('ListItem')} id={id}>
            #{id}{' '}
            <button type="button" onClick={showSnackbar}>스낵바 띄우기</button>
            <SnackbarItem ref={snackbarRef} opened={opened}>
                <p>{id}. {text} 스낵바 알림</p>
            </SnackbarItem>
        </span>
    );
};

const Snackbar3_1 = () => (
    <>
        <h2>스낵바</h2>
        <h3>#3-1. React<sub>portal in child component</sub></h3>
        {data.map(item => <ListItem {...item} key={item.id} />)}
        <div id="snackbarRoot" className={cx('Snackbars')} />
    </>
);

export default Snackbar3_1;
