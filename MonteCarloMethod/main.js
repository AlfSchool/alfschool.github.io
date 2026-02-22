"use strict";

window.addEventListener('load', () => {
    let canvas = document.querySelector('canvas');
    let ctx = canvas.getContext("2d");
    let l = canvas.height;

    let randomPoints = [];
    for (let i = 0; i < 10_000_000; i++) {
        randomPoints.push({
            x: Math.floor(Math.random() * 500), 
            y: Math.floor(Math.random() * 500),
            inside: false
        });
    }     

    let inside = 0;
    ctx.beginPath();
    randomPoints.forEach(p => {
        let dx = Math.abs(p.x - l/2);
        let dy = Math.abs(p.y - l/2);
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < l/2) {
            p.inside = true;
            inside++
        }
    });
    ctx.fill();

    ctx.beginPath();
    randomPoints.forEach(p => {
        ctx.fillStyle = p.inside ? "blue" : "red";
        ctx.fillRect(p.x, p.y, 1, 1);
    });
    ctx.fill();

    let pi = inside * 4 /randomPoints.length;
    console.log(pi);
});