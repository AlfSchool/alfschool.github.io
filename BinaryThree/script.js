window.addEventListener('load', () => {
    let canvas = document.querySelector("#canvas");
    let height = canvas.height;
    let width = canvas.width;
    let ctx = canvas.getContext("2d");

    clear();

    let turtle = {
        x: 0,
        y: 0,
        angle : 0,
        penDown : false,
        color : "green",
        moveForward(l) {
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.moveTo(this.x, this.y);
            this.x = this.x + Math.cos(-this.angle) * l;
            this.y = this.y + Math.sin(-this.angle) * l;
            if (this.penDown) {
                ctx.lineTo(this.x, this.y);
            } else {
                ctx.moveTo(this.x, this.y);
            }
            ctx.stroke();
        },
        setAngle(a) {
            this.angle = a;
        },
        liftPen() {
            this.penDown = false;
        },
        putPenDown() {
            this.penDown = true;
        }
    }

    let l = 200;
    let n = 10;
    let cx = width/2;
    let cy = height/2;
    turtle.x = cx;
    turtle.y = cy;
    turtle.putPenDown();

    drawTree(cx, cy, 0, l, n);

    const recursionSlider = document.querySelector('#recursionInput');
    recursionSlider.addEventListener('input', (e) => {
        n = e.target.value;
        clear();
        drawTree(cx, cy, 0, l, n);
    });

    function drawTree(x, y, a, l, n) {
        if (n <= 0) {
            return;
        }
        turtle.x = x;
        turtle.y = y;
        let verteces = drawV(x, y, a, l);
        drawTree(verteces[0].x, verteces[0].y, a - Math.PI / 6, l / 2, n-1);
        drawTree(verteces[1].x, verteces[1].y, a + Math.PI / 6, l / 2, n-1);
    }

    function drawV(x, y, a, l) {
        let points = [];
        turtle.x = x;
        turtle.y = y;
        turtle.setAngle(a);
        turtle.setAngle(turtle.angle + Math.PI / 3);
        turtle.putPenDown();
        turtle.moveForward(l);
        points.push({
            x: turtle.x,
            y: turtle.y
        });
        turtle.liftPen();
        turtle.setAngle(turtle.angle + Math.PI);
        turtle.moveForward(l);
        turtle.setAngle(turtle.angle - (Math.PI * 2 / 3));
        turtle.putPenDown();
        turtle.moveForward(l);
        points.push({
            x: turtle.x,
            y: turtle.y
        });
        return points;
    }

    function clear() {
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.strokeStyle = "brown";
        ctx.moveTo(width/2, height/2);
        ctx.lineTo(width/2, height/2 + 350);
        ctx.stroke();
    }
});