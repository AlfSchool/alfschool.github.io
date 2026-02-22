window.addEventListener('load', ()=> {
    let canvas = document.querySelector("canvas");
    let height = canvas.height;
    let width = canvas.width;
    let ctx = canvas.getContext("2d");
    let vertices = [];

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

    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;

    let l = 50;
    let n = 2;
    let cx = width/2 - l * 1.5;
    let cy = height/2 - l;
    turtle.x = cx;
    turtle.y = cy;
    turtle.liftPen(); //so it doesnt really draw
    turtle.putPenDown();
    //drawTree(cx, cy, Math.PI, l, n);
    drawTriangle(l, n);
    
    let waypoints = [];
    for (let i = 1; i < vertices.length; i++) {
        const pt0 = vertices[i - 1];
        const pt1 = vertices[i];
        for (let j = 0; j < 10; j++) {
            waypoints.push({
                x: pt0.x + (pt1.x - pt0.x) * j / 15,
                y: pt0.y + (pt1.y - pt0.y) * j / 15
            });
        }
    }

    ctx.strokeStyle = "purple";
    //let f = 0;
    //animate();

    function animate() {
        if (f >= waypoints.length - 1) { 
            return;
        }
        const edgesPerFrame = n; 
        for (let i = 0; i < edgesPerFrame && f < waypoints.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(waypoints[f].x, waypoints[f].y);
            ctx.lineTo(waypoints[f+1].x, waypoints[f+1].y);
            ctx.stroke();
            f++;
        }
        requestAnimationFrame(animate);
    }

    function drawTree(x, y, a, l, n) {
        if (n <= 0) {
            return;
        }
        turtle.x = x;
        turtle.y = y;
        let verteces = drawV(a, l);
        point({x: verteces[0].x, y: verteces[0].y});
        point({x: verteces[1].x, y: verteces[1].y});
        drawTree(verteces[0].x, verteces[0].y, a, l/3, n-1);
        drawTree(verteces[1].x, verteces[1].y, a, l/3, n-1);
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
        points.push({
            x: turtle.x,
            y: turtle.y
        });
        turtle.setAngle(turtle.angle - (Math.PI * 2 / 3));
        turtle.putPenDown();
        turtle.moveForward(l);
        console.log(points);
        return points;
    }

    function drawTriangle(l, n) {
        addVertex(turtle.x, turtle.y);
        drawEdge(l, n);
        turtle.setAngle(turtle.angle - Math.PI * 2 / 3);
        drawEdge(l, n);
        turtle.setAngle(turtle.angle - Math.PI * 2 / 3);
        drawEdge(l, n);
    }

    function drawEdge(l, n) {
        if (n == 0) {
            turtle.moveForward(l);
            turtle.setAngle(turtle.angle + Math.PI / 3);
            addVertex(turtle.x, turtle.y);
            turtle.moveForward(l);
            turtle.setAngle(turtle.angle - Math.PI * 2 / 3);
            addVertex(turtle.x, turtle.y);
            turtle.moveForward(l);
            turtle.setAngle(turtle.angle + Math.PI / 3);
            addVertex(turtle.x, turtle.y);
            turtle.moveForward(l);
            addVertex(turtle.x, turtle.y);
            return;
        }
        drawEdge(l/3, n-1);
        turtle.setAngle(turtle.angle + Math.PI / 3);
        drawEdge(l/3, n-1);
        turtle.setAngle(turtle.angle - Math.PI * 2 / 3);
        drawEdge(l/3, n-1);
        turtle.setAngle(turtle.angle + Math.PI / 3);
        drawEdge(l/3, n-1);
    }

    function addVertex(x, y) {
        vertices.push({
            x: x,
            y: y
        })
    }
});