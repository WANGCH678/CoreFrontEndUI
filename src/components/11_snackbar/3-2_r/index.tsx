import data from '../data';
import cx from '../cx';
import { useSnackbar } from './useSnackbar';

const ListItem = ({ id, text }: { id: string; text: string }) => {
    const { showSnackbar, snackbar } = useSnackbar(<p>{id}. {text} 스낵바 알림</p>);

    return (
        <span className={cx('ListItem')} id={id}>
            #{id}{' '}
            <button type="button" onClick={showSnackbar}>스낵바 띄우기</button>
            {snackbar}
        </span>
    );
};

const Snackbar3_2 = () => (
    <>
        <h2>스낵바</h2>
        <h3>#3-2. React<sub>portal in custom hook</sub></h3>
        {data.map(item => <ListItem {...item} key={item.id} />)}
        <div id="snackbarRoot" className={cx('Snackbars')} />
    </>
);

export default Snackbar3_2;
