"use strict";

window.addEventListener('load', () => {
    let canvas = document.querySelector('canvas');
    let ctx = canvas.getContext("2d");
    let r = canvas.height / 2;
    ctx.beginPath();
    ctx.arc(r, r, r, 0, Math.PI * 2);
    ctx.stroke();

    let n = 10000;
    let width = r / n;
    let height = 0;
    let c = 0;
    let rectangles = [];
    for (let i = 0; i < n; i++) {
        point(c + r, r);
        height = Math.sqrt(Math.abs(r * r - c * c));
        rectangles.push({
            h: height,
            w: width
        });
        console.log("height: " + height + ", width: " + width);
        line(c + r, r, height);
        c += width;
    }

    let sn = 0;
    for (let i = 0; i < rectangles.length; i++) {
        sn += rectangles[i].h * rectangles[i].w;
        console.log(rectangles[i]);
    }
    console.log(sn);

    let pi = (4 * sn) / (r * r);
    console.log(pi);

    function line(x, y, height) {
        ctx.fillRect(x, y, 2, -height);
    }

    function point(x, y) {
        ctx.fillRect(x, y, 2, 2);
    }
});