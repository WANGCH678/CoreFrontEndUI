import { stringToDOM } from '@/service/util';
import cx from '../cx';

class ModalModule {
    elem: Element;

    constructor(children?: Element[], className?: string) {
        this.elem = stringToDOM(`<div class="${cx(className)}"></div>`);
        if (children) this.elem.append(...children);
    }
}

export class ModalHeader extends ModalModule {
    constructor(children?: Element[]) {
        super(children, 'ModalHeader');
    }
}

export class ModalContent extends ModalModule {
    constructor(children?: Element[]) {
        super(children, 'ModalContent');
    }
}

export class ModalFooter extends ModalModule {
    constructor(children?: Element[]) {
        super(children, 'ModalFooter');
    }
}

interface FooterButton {
    text: string;
    type?: 'submit' | 'button';
    handleClick?: (e: Event) => void;
}

export interface ModalProps {
    id: string;
    className?: string;
    header?: ModalHeader;
    content: ModalContent;
    footer?: ModalFooter;
    footerButtons?: FooterButton[];
    hideOnBackdropClick?: boolean;
    showCloseButton?: boolean;
}

export default class Modal {
    #root: Element;

    constructor({
        id,
        className,
        header,
        content,
        footer,
        footerButtons = [],
        hideOnBackdropClick = true,
        showCloseButton = true,
    }: ModalProps) {
        this.#root = stringToDOM(`<div class="${cx('Modal', className)}" id="${id}"></div>`);
        const $inner = stringToDOM(`<div class="${cx('inner')}"></div>`);

        if (hideOnBackdropClick) {
            this.#root.addEventListener('click', () => this.hide());
            $inner.addEventListener('click', e => e.stopPropagation());
        }

        if (header) {
            if (showCloseButton) {
                const $closeBtn = stringToDOM(
                    `<button type="button" class="${cx('close')}"></button>`
                );
                $closeBtn.addEventListener('click', () => this.hide());
                header.elem.append($closeBtn);
            }
            $inner.append(header.elem);
        }

        if (content) $inner.append(content.elem);

        if (footer) {
            const $buttons = footerButtons.map(({ text, type = 'button', handleClick }) => {
                const $btn = stringToDOM(`<button type="${type}">${text}</button>`);
                const handler = (e: Event) => {
                    handleClick?.(e);
                    this.hide();
                };
                $btn.addEventListener('click', handler);
                return $btn;
            });

            footer.elem.append(...$buttons);
            $inner.append(footer.elem);
        }

        this.#root.append($inner);
        document.getElementById('modalRoot')!.append(this.#root);
    }

    hide() {
        this.#root.remove();
    }
}
