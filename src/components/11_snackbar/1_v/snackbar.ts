import { generateDOM } from '@/service/util';
import cx from '../cx';

const SNACKBAR_DURATION = 3000;

const initSnackbar = (children: HTMLElement) => {
    let timeoutId: number | null = null;
    const $snackbar = generateDOM('div', cx('SnackbarItem'));
    $snackbar.append(children);

    const cancelTimer = () => {
        if (timeoutId) window.clearTimeout(timeoutId);
    };
    const startTimer = () => {
        cancelTimer();
        timeoutId = window.setTimeout(hideSnackbar, SNACKBAR_DURATION);
    };
    const hideSnackbar = () => {
        $snackbar.classList.remove(cx('show'));
        $snackbar.removeEventListener('mouseenter', cancelTimer);
        $snackbar.removeEventListener('mouseleave', startTimer);
    };
    const handleTransitionEnd = () => {
        if ($snackbar.className.includes(cx('show'))) {
            $snackbar.addEventListener('mouseenter', cancelTimer);
            $snackbar.addEventListener('mouseleave', startTimer);
            startTimer();
        } else {
            $snackbar.remove();
        }
    };
    const showSnackbar = () => {
        window.requestAnimationFrame(() => $snackbar.classList.add(cx('show')));
        $snackbar.addEventListener('transitionend', handleTransitionEnd);
        document.querySelector('#snackbarRoot')!.append($snackbar);
    };

    return showSnackbar;
};

export default initSnackbar;
