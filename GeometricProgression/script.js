    window.addEventListener('load', ()=> {
        let canvas = document.querySelector('#canvas');
        let height = canvas.height;
        let width = canvas.width;
        let ctx = canvas.getContext("2d");
        
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;

        let turtle = {
            x: width / 2,
            y: 0,
            angle : 0,
            penDown : false,
            color : "green",
            moveForward(l) {
                ctx.beginPath();
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 1.25;
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
        turtle.putPenDown();

        drawSequence(10, 6);

        const lengthSlider = document.querySelector('#lengthInput');
        lengthSlider.addEventListener('input', (e) => {
            clear();
            let l = Number(e.target.value);
            console.log(turtle.y);
            drawSequence(10, l);
        });

        function drawSequence(n, l) {
            turtle.y = height / 2 + l * 25;
            for (let i = 0; i < 3; i++) {
                drawEdge(n, l);
            }
        }

        function drawEdge(n, l) {
            seq = createSequence(n);
            seq.forEach(b => {
                if (b) {
                    turtle.moveForward(l);
                } else {
                    turtle.setAngle(turtle.angle + Math.PI / 3);
                }    
            });
            return seq;
        }

        function createSequence(n) {
            let s = [0];
            for (let i = 0; i < n; i++) {
                s.forEach(b => s.push(1-b));
            }
            return s;
        }

        function clear() {
            ctx.clearRect(0, 0, width, height);
            ctx.globalAlpha = 0.4;
            ctx.fillRect(0, 0, width, height);
            ctx.globalAlpha = 1;
        }
    });