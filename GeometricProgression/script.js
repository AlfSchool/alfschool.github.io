window.addEventListener('load', ()=> {
    let canvas = document.querySelector("canvas");
    let height = canvas.height;
    let width = canvas.width;
    let ctx = canvas.getContext("2d");
    clear();

    let turtle = {
        x: 0,
        y: 0,
        angle : 0,
        penDown : false,
        color : "white",
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

    point({x: 0, y: 0});
    point({x: 0, y: height});
    point({x: width, y: 0});
    point({x: width, y: height});
    //point({x: width/2, y: height/2});

    let cx = width/2;
    let cy = height*2/3;
    turtle.x = cx;
    turtle.y = cy;
    //point({x: cx, y: cy});
    turtle.putPenDown();

    seq = drawSequence(10);
    console.log(seq.length);

    function drawSequence(n) {
        for (let i = 0; i < 3; i++) {
            drawEdge(n);
        }
    }

    function drawEdge(n) {
        seq = createSequence(n);
        seq.forEach(b => b ? turtle.moveForward(3) : turtle.setAngle(turtle.angle + Math.PI / 3));
        return seq;
    }

    function createSequence(n) {
        let s = [0];
        for (let i = 0; i < n; i++) {
            s.forEach(b => s.push(1-b));
        }
        return s;
    }

    //drawV(width/2, height/2, 0, 100);
    function point({x, y}) {
        let s = 4;
        ctx.fillStyle = "white";
        ctx.fillRect(x-s/2, y-s/2, s, s)
    }

    function clear() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);
    }
});