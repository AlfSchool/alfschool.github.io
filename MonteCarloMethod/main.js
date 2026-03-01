"use strict";

window.addEventListener('load', () => {
    let canvas = document.querySelector('#canvas');
    let height = canvas.height;
    let width = canvas.width;
    let ctx = canvas.getContext("2d");
    const showResult = document.querySelector('#result');

    calculate(500_000);

    function calculate(numberPoints) {
        let x = 0;
        let y = 0;
        let dx = 0;
        let dy = 0;
        let distance = 0;
        let inside = 0;
        for (let i = 0; i < numberPoints; i++) {
            x = Math.floor(Math.random() * width);
            y = Math.floor(Math.random() * height);

            dx = Math.abs(x - width/2);
            dy = Math.abs(y - height/2);
            distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < width/2) {
                ctx.fillStyle = "red";
                inside++
            } else {
                ctx.fillStyle = "gainsboro";
            }
            ctx.fillRect(x, y, 1, 1);
        }
        let pi = inside * 4 / numberPoints;
        showResult.innerHTML = `Pi value is ${pi}`;
        return pi;
    }

    function clear() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 0.4;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;
    }

    const numberPointsSlider = document.querySelector('#numberPointsInput');
    const numberPointsLabel = document.querySelector('#numberPointsLabel');
    numberPointsSlider.addEventListener('change', (e) => {
        clear();
        numberPointsLabel.innerHTML = `Number of points: ${e.target.value}`;
        calculate(e.target.value);
    });
});