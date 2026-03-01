"use strict";

window.addEventListener('load', () => {
    let canvas = document.querySelector('#canvas');
    const resultLabel = document.querySelector('#showResult');
    let height = canvas.height;
    let width = canvas.width;
    let ctx = canvas.getContext("2d");
    let r = width / 2;

    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, width);
    ctx.globalAlpha = 1;

    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.arc(r, r, r, 0, Math.PI * 2 - Math.PI / 2);
    ctx.stroke();

    calculate(100_000);

    const rectanglesSlider = document.querySelector('#rectanglesInput');
    rectanglesSlider.addEventListener('input', (e) => {
        let n = Number(e.target.value);
        if (n > 100_000) {
            n = 100_000;
        }
        calculate(n);
    });

    function calculate(n) {
        clearQuadrant();
        let widthEdge = r / n;
        let heightEdge = 0;
        let c = 0;
        let sn = 0;
        ctx.fillStyle = "red";
        for (let i = 0; i < n; i++) {
            heightEdge = Math.sqrt(Math.abs(r * r - c * c));
            sn += widthEdge * heightEdge;
            c += widthEdge;
            ctx.fillRect(width/2 + c - widthEdge, height/2, widthEdge, -heightEdge);
        }

        let pi = (4 * sn) / (r * r);
        resultLabel.innerHTML = `Pi value is: ${pi}`;
    }

    function clearQuadrant() {
        ctx.clearRect(width/2, 0, width, width / 2);
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = "black";
        ctx.fillRect(width/2, 0, width, width / 2);
        ctx.globalAlpha = 1;
    }
});