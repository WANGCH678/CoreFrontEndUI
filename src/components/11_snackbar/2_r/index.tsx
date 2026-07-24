import data from '../data';
import cx from '../cx';
import { useSnackbar } from './snackbarContext';
import { SnackbarContextProvider } from './snackbarComponents';

const ListItem = ({ id, text }: { id: string; text: string }) => {
    const { showSnackbar } = useSnackbar(id, <p>{id}. {text} 스낵바 알림</p>);

    return (
        <span className={cx('ListItem')} id={id}>
            #{id}{' '}
            <button type="button" onClick={showSnackbar}>스낵바 띄우기</button>
        </span>
    );
};

const Snackbar2 = () => (
    <SnackbarContextProvider>
        <h2>스낵바</h2>
        <h3>#2. React<sub>Context</sub></h3>
        {data.map(item => <ListItem {...item} key={item.id} />)}
    </SnackbarContextProvider>
);

export default Snackbar2;
