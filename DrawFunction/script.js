window.addEventListener('load', () => {
    const canvas = document.querySelector('#canvas');
    const height = canvas.height;
    const width = canvas.width;
    const ctx = canvas.getContext('2d');

    clear();
    
    //define your function here
    const func = (x, coefficients) => {
        coefficients = coefficients.toReversed();
        let y = 0;
        const len = coefficients.length;
        for (let i = 0; i < len; i++) {
            y += (coefficients[i] * (Math.pow(x, i))); 
        }
        return y;
    }

    const inputField = document.querySelector('#stringField');
    inputField.addEventListener('keydown', (e) => {
        if (e.code === 'Enter') {
            clear();
            console.log("drawing");
            let inputString = e.target.value;
            draw(func, JSON.parse("[" + inputString + "]"));
        }
    });


    function draw(f, coefficients) {
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "green";
        ctx.fillRect(0, height/2, width, 2);
        ctx.fillRect(width/2, 0, 2, height);
        ctx.fillStyle = "white";
        for (let x = -width/2; x < width/2; x = x + 0.01) {
            screen(x, f(x, coefficients));
        }
    }

    function clear() {
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
    }

    function screen(x, y) {
        const canvasX = x  + width/2;
        const canvasY = -y  + height/2;
        point(canvasX, canvasY);
    }

    function point(x, y, s = 2) {
        ctx.fillRect(x - s/2, y - s/2, s/2, s/2);
    }
});