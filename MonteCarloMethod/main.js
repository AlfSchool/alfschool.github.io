"use strict";

window.addEventListener('load', () => {
    let canvas = document.querySelector('#canvas');
    let ctx = canvas.getContext("2d");
    let l = canvas.height;

    let total = 1_000_000;
    let inside = 0;

    let x = 0;
    let y = 0;

    let dx = 0;
    let dy = 0;
    let distance = 0;

    ctx.beginPath();
    for (let i = 0; i < total; i++) {
        x = Math.floor(Math.random() * 500);
        y = Math.floor(Math.random() * 500);

        dx = Math.abs(x - l/2);
        dy = Math.abs(y - l/2);
        distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < l/2) {
            ctx.fillStyle = "red";
            inside++
        } else {
            ctx.fillStyle = "gainsboro";
        }
        ctx.fillRect(x, y, 1, 1);
    }
    ctx.fill();

    let pi = inside * 4 / total;
    console.log(pi);
    const showResult = document.querySelector('#result');
    showResult.innerHTML = `Pi value is ${pi}`;
});