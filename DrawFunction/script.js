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
            stringFunction = stringFormatting(stringFunction);
            f = new Function('x', "return " + stringFunction);
            draw(f); 
        }
    });



    const xPointDerivative = document.querySelector('#derivativeField');
    const showDerivative = document.querySelector('#showDerivative');
    xPointDerivative.addEventListener('keydown', (e) => {
        if (e.code === 'Enter') {
            clear();
            let stringFunction = inputField.value;
            stringFunction = stringFormatting(stringFunction);
            f = new Function('x', "return " + stringFunction);
            draw(f); 
            let x = Number(e.target.value);
            let d = derivative(f, x);
            showDerivative.innerHTML = "is: " + d;
        }
    });

    const xPointLimit = document.querySelector('#limitField');
    const showLimit = document.querySelector('#showLimit');
    xPointLimit.addEventListener('keydown', (e) => {
        if (e.code === 'Enter') {
            clear();
            let stringFunction = inputField.value;
            stringFunction = stringFormatting(stringFunction);
            f = new Function('x', "return " + stringFunction);
            draw(f); 
            let x = Number(e.target.value);
            let d = limit(f, x);
            showLimit.innerHTML = "is: " + d;
        }
    });

    function stringFormatting(fString) {
        const mathFunctions = [
                "abs","acos","acosh","asin","asinh","atan","atan2","atanh",
                "cbrt","ceil","clz32","cos","cosh","exp","expm1","floor",
                "f16round","fround","hypot","imul","log","log10","log1p","log2",
                "max","min","pow","random","round","sign","sin","sinh",
                "sqrt","sumPrecise","tan","tanh","trunc"
            ];

        mathFunctions.forEach(fn => {
            fString = fString.replaceAll(fn, "Math." +  fn);
        });

        return fString;
    }

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

    function derivative(f, x) {
        const h = 1e-15;
        return (f(x + h) - f(x)) / h;
    }

    function limit(f, x) {
        const y = f(x);
        if (!isNaN(y)) {
            return y;
        }
        const h = Number.MIN_VALUE;
        const left = f(x - h);
        const right = f(x + h);
        if (isNaN(left) && isNaN(right)) {
            return NaN;
        }
        let l = isNaN(left) ? right : left;
        if (l < -500) {
            l = -Infinity;
        }
        if (l > 500) {
            l = Infinity;
        }
        return l;
    }
});