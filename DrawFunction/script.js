window.addEventListener('load', () => {
    const canvas = document.querySelector('#canvas');
    const height = canvas.height;
    const width = canvas.width;
    const ctx = canvas.getContext('2d');
    const zoom = document.querySelector('#zoom');
    let f = null; 

    clear();

    const zoomSlider = document.querySelector('#zoom');
    zoomSlider.addEventListener('input', () => {
        draw(f);
    });

    const inputField = document.querySelector('#stringField');
    inputField.addEventListener('keydown', (e) => {
        if (e.code === 'Enter') {
            clear();
            let stringFunction = e.target.value;
            const mathFunctions = [
                "abs","acos","acosh","asin","asinh","atan","atan2","atanh",
                "cbrt","ceil","clz32","cos","cosh","exp","expm1","floor",
                "f16round","fround","hypot","imul","log","log10","log1p","log2",
                "max","min","pow","random","round","sign","sin","sinh",
                "sqrt","sumPrecise","tan","tanh","trunc"
            ];

            mathFunctions.forEach(fn => {
            const regex = new RegExp(`\\b${fn}\\b`, "g");
            stringFunction = stringFunction.replace(regex, `Math.${fn}`);
});
            console.log(stringFunction);
            f = new Function('x', "return " + stringFunction);
            draw(f); 
        }
    });


    function draw(f) {
        clear();
        ctx.fillStyle = "white";
        ctx.beginPath();
        const firstX = -width/2;
        const firstY = f(firstX) * zoom.value;
        ctx.moveTo(firstX, firstY);
        for (let x = -width/2; x < width/2; x = x + 0.01) {
            const newPoint = screen(x * zoom.value, f(x) * zoom.value);
            ctx.lineTo(newPoint.x, newPoint.y);
        }
        ctx.strokeStyle = "white";
        ctx.stroke();
    }

    function clear() {
        ctx.clearRect(0, 0, height, width);
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "green";
        ctx.fillRect(0, height/2, width, 2);
        ctx.fillRect(width/2, 0, 2, height);
    }

    function screen(x, y) {
        const canvasX = x  + width/2;
        const canvasY = -y  + height/2;
        return {
            x: canvasX,
            y: canvasY
        };
    }
});