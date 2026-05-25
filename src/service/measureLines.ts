const measureLines = (elem: HTMLElement, text: string) => {
    if (!elem || !text) return 0;

    const canvas = document.createElement('canvas');
    const canvasContext: CanvasRenderingContext2D = canvas.getContext('2d')!;
    const style = window.getComputedStyle(elem);
    canvasContext.font = style.getPropertyValue('font');
    canvasContext.letterSpacing = style.getPropertyValue('letter-spacing');

    const measuredLines = text.split('\n').reduce((res, curr) => 
        res + Math.max(Math.ceil(canvasContext.measureText(curr).width / elem.clientWidth), 1),
        0,
    );
    return measuredLines;
};

export default measureLines;