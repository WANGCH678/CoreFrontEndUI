import { generateDOM, stringToDOM } from '@/service/util';
import VanillaWrapper from '@/components/vanillaWrapper';
import cx from '../cx';
import data from '../data';
import initSnackbar from './snackbar';

const initiator = (wrapper: HTMLDivElement) => {
    const $items = data.map(({ id, text }) => {
        const $button = generateDOM('button', undefined, '스낵바 띄우기');
        const $snackbarContent = generateDOM('p', undefined, `${id}. ${text} 스낵바 알림`);
        const showSnackbar = initSnackbar($snackbarContent);
        $button.addEventListener('click', showSnackbar);

        const $item = generateDOM('span', cx('ListItem'), `#${id}`);
        $item.append($button);
        return $item;
    });

    wrapper.append(
        ...$items,
        stringToDOM(`<div id="snackbarRoot" class="${cx('Snackbars')}"></div>`)
    );
};

const Snackbar1V = () => (
    <>
        <h2>스낵바</h2>
        <VanillaWrapper title="#1" initiator={initiator} />
    </>
);

export default Snackbar1V;
